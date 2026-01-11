import os
import google.generativeai as genai
from dotenv import load_dotenv
from . import schemas, tools
from pathlib import Path

# Load .env from the same directory as this file
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure specific API key if you have one, or use env var
# genai.configure(api_key=os.environ["GEMINI_API_KEY"]) 
# For this environment, we might need to ask user for key or assume it's set.
# I will write a placeholder implementation that expects the key.

SYSTEM_PROMPT = """
You are an expert nutrition assistant for a fitness tracking app.
Your goal is to help users log their food intake accurately.


**TOOLS AVAILABLE:**
1. `search_food_database(query)`: Use this to search for specific branded foods or generic items (e.g., "Nutella", "Oreo", "Banana").
2. `calculate_recipe_per_100g(ingredients)`: Use this whenever you are combining multiple ingredients (e.g., "Chicken with Rice" or a recipe). DO NOT try to do the math yourself.
3. `add_food_to_database(name, calories, protein, carbs, fat, serving_unit, serving_weight)`: Use this to save a verified food item to the user's database.

**WORKFLOW:**
1. **Analyze:** Understand what the user ate.
2. **Clarify:** If details are missing, ask.
3. **Retrieve/Calculate:**
   - If it's a single item (e.g. "an apple"), use `search_food_database` to find its macros per 100g.
     - **FALLBACK:** If `search_food_database` returns NO results or generic/bad results, do NOT stick with it. Use your **internal nutritional knowledge** to estimate the macros per 100g.
     - You MUST explicitly state: "I couldn't find [Item] in the database, so I estimated it using standard values or check with the use."
   - If the user provides NATURAL UNITS (e.g. "1 banana", "2 eggs", "3 cloves garlic"):
      - You MUST estimate the weight in grams based on standard sizes (e.g. Medium Banana ~118g, Large Egg ~50g).
      - State your assumption to the user in the final text (e.g. "Assuming 1 medium banana is ~118g").
      - Use these estimated gram values for your calculations.
   - If it's a meal (e.g. "Porridge with honey"), use `search_food_database` for EACH ingredient, then use `calculate_recipe_macros` to get the final stats.

4. **Recipes & Portions:**
   - For ANY combined dish (multiple ingredients), you MUST default to **Portion-Based** logging.
   - ASK the user: "How many portions does this make?"
   - Use `calculate_recipe_macros(ingredients, portions=N)`.
   - Name the item: "Dish Name (1 Portion)".
   - **Set `serving_unit="serving"` in the final JSON.**
   - Tell the user: "I've saved the macros for 1 full portion. You can now log '1' serving."

5. **Naming:**
   - Before proposing the final JSON, ASK the user what they want to call this dish (e.g., "What should we name this meal?").
   - OR if the user already gave a clear name (e.g. "I made a Chicken Curry"), confirm it.
6. **Finalize:**
   - Once you have the final data, propose the JSON.
   - If the user agrees, output `FINAL_PROPOSAL:` followed by the JSON.
   
7. **Saving to Database:**
   - **CRITICAL RULE:** You can ONLY call `add_food_to_database` if the user EXPLICITLY says "save this", "add to database", or "agreement" AFTER seeing the proposed nutrition data.
   - NEVER call this tool proactively without user consent.
   - If user says "Yes, looks good, save it":
     1. Call `add_food_to_database(...)` with the AGREED values.
     2. Confirm to the user: "Saved [Food Name] to database."

JSON Structure for Food:
{
  "name": "Food Name",
  "calories": 0,
  "protein": 0.0,
  "carbs": 0.0,
  "fat": 0.0,
  "serving_unit": "grams" // OR "serving" if it is a single unit/portion
}
"""

def get_gemini_response(message: str, history: list[dict]):
    # simple placeholder for now - requires valid API KEY
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "response": "API Key not configured. Please set GEMINI_API_KEY in .env",
            "structured_food": None
        }

    genai.configure(api_key=api_key)
    
    # Define tool config
    tools_list = [tools.search_food_database, tools.calculate_recipe_macros, tools.add_food_to_database]
    
    # 1.5-flash was not found. 
    # Switching to gemini-2.5-flash which is explicitly in your available models list.
    model = genai.GenerativeModel(
        'gemini-2.5-flash', 
        system_instruction=SYSTEM_PROMPT,
        tools=tools_list
    )
    
    # Construct chat history
    # The frontend history lacks the system prompt context, so we rely on system_instruction.
    # We need to ensure the structure matches exactly what Gemini expects (role/parts).
    formatted_history = []
    for msg in history:
        # Gemini expects 'user' or 'model' roles. Frontend sends 'user'/'model'.
        formatted_history.append({
            "role": msg.get("role"),
            "parts": msg.get("parts", [msg.get("text", "")])
        })

    print(f"[DEBUG] Starting Gemini Chat with history length: {len(formatted_history)}")
    
    # Enable automatic tool execution
    chat = model.start_chat(
        history=formatted_history,
        enable_automatic_function_calling=True
    )
    
    print(f"[DEBUG] Sending message to Gemini: '{message}'")
    response = chat.send_message(message)
    text_response = response.text
    print(f"[DEBUG] Gemini Response: {text_response[:100]}...") # Print first 100 chars

    # --- DEBUG TRACE START ---
    # Inspect history to see what tools were called automatically
    print("\n--- [DEBUG-TRACE] AGENT THOUGHT PROCESS ---")
    for msg in chat.history:
        for part in msg.parts:
            if fn := part.function_call:
                args = ", ".join(f"{k}={v}" for k, v in fn.args.items())
                print(f"🔧 Tool Call: {fn.name}({args})")
            if resp := part.function_response:
                print(f"📦 Tool Result: {resp.name} (Response received)")
    print("-------------------------------------------\n")
    # --- DEBUG TRACE END ---

    # Simple parsing logic for "Phase 3"
    structured_food = None
    if "FINAL_PROPOSAL:" in text_response:
        print("[DEBUG] Found FINAL_PROPOSAL, parsing JSON...")
        try:
            json_part = text_response.split("FINAL_PROPOSAL:")[1].strip()
            # Clean up potential markdown code blocks
            json_part = json_part.replace("```json", "").replace("```", "").strip()
            data = json.loads(json_part)
            structured_food = schemas.FoodItemCreate(**data)
            # Remove the raw JSON from the user-facing text
            text_response = text_response.split("FINAL_PROPOSAL:")[0].strip() + "\n\nI've drafted the nutrition info. Does this look right?"
            print("[DEBUG] JSON parsed successfully.")
        except Exception as e:
            print(f"[ERROR] Error parsing JSON: {e}")

    return {
        "response": text_response,
        "structured_food": structured_food
    }
