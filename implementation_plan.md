# Implementation Plan - AI Nutrition Tools

## Goal
Empower the AI Agent to fetch real-world nutritional data instead of relying on internal knowledge. This ensures accuracy for branded products and specific ingredients.

## User Review Required
> [!IMPORTANT]
> **External API Source:** I am proposing **OpenFoodFacts** as it is free, open-source, and has a good Python library. USDA is another option but requires an API key which adds friction.

## Proposed Changes

### Backend
#### [NEW] `backend/tools.py`
- `search_food_database(query: str) -> list[dict]`:
    - Searches OpenFoodFacts API.
    - Returns a simplified list of results: `[{name, calories, protein, carbs, fat, serving_size_g}]`.
- `calculate_recipe_per_100g(ingredients: list[dict]) -> dict`:
    - **REQUIRED:** Helper to compute the math accurately since LLMs can struggle with arithmetic.
    - Input: List of `{name, weight_g, calories_per_100g, protein_per_100g...}`
    - Output: Total recipe nutrition per 100g.

#### [MODIFY] `backend/requirements.txt`
- Add `openfoodfacts` (or just use `requests` if the lib is too heavy).

#### [MODIFY] `backend/agent.py`
- **Tool Registration:** Configure the Gemini model with a `tools` argument containing our new functions.
- **System Prompt Update:** 
    - "You have access to a food database. USE IT when the user mentions a specific food."
    - "Always verify your calculations for 'per 100g' values."

## Verification Plan

### Automated Verification
- Create a test script `verify_tools.py`:
    - calling `search_food_database("Nutella")` and asserting it returns non-zero results.

### Manual Verification
1.  **Restart Backend.**
2.  Open **AI Assist**.
3.  Type: *"I had 50g of Nutella."*
4.  **Observer:** The Agent should display a "Thinking..." state (or similar) while it calls the tool.
5.  **Result:** It should return exact numbers from the OpenFoodFacts DB, not generic estimates.
