1. **AI-Assisted Food Creation (Agentic Workflow)**
    *   **Goal:** Use an LLM to generate accurate nutritional info from loose user descriptions.
    *   **Phase 1 (Text only):** [DONE]
        1.  **User Input:** User provides ingredients and amounts via text (e.g., "3 eggs, 100g spinach, 10g butter").
        2.  **Clarification Loop:** LLM analyzes input. If details are missing (e.g., "Is the spinach raw or cooked?"), it asks the user.
        3.  **Data Retrieval (Tools):** Once input is clear, LLM calls reliable APIs/Tools to fetch nutrition data per ingredient.
        4.  **Structured Proposal:** LLM compiles the total macros and details into a structured JSON format and presents it for review.
        5.  **Commit:** User reviews and accepts. The structure is then saved to the database as a new Food Item.
    *   **Phase 1.5 (Tools):** [DONE]
        *   Added `search_food_database` (OpenFoodFacts).
        *   Added `calculate_recipe_per_100g` for precise math.
    *   **Phase 2 (Expansion):** Support URLs (recipe scraping) and images (food photos).
    *   **Note:** Use Gemini/OpenAI models directly first. No fine-tuning needed initially.

2. Add how the body feels generally, consistent issues in detail

3. Notifications for any tablets you need to take.