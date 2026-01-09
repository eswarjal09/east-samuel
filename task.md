# Task: Implement AI Tools for Nutrition Retrieval

- [x] **Design Phase** <!-- id: 0 -->
    - [x] Define the specific tools needed (`lookup_ingredient`, etc.) <!-- id: 1 -->
    - [x] Define the Agent's reasoning loop (Thought -> Tool -> Math -> Response) <!-- id: 2 -->
    - [x] Select the external API source (OpenFoodFacts, USDA, or custom) <!-- id: 3 -->
- [/] **Backend Implementation** <!-- id: 4 -->
    - [ ] Create `tools.py` with the function definitions <!-- id: 5 -->
    - [ ] Implement the API client for the chosen external source <!-- id: 6 -->
    - [ ] Update `agent.py` to register these tools with Gemini <!-- id: 7 -->
    - [ ] Update `agent.py` system prompt to enforce tool usage <!-- id: 8 -->
- [ ] **Verification** <!-- id: 9 -->
    - [ ] Test with complex queries ("Chicken and Rice") <!-- id: 10 -->
    - [ ] Verify 100g calculations are accurate <!-- id: 11 -->
    - [x] **Enhancement**: Allow natural units (e.g. "2 eggs") by instructing Agent to estimate grams. <!-- id: 12 -->
    - [ ] **Data Model Update**: Add `unit` column to `FoodItem` (default: 'grams', optional: 'serving') <!-- id: 13 -->
    - [ ] **Frontend Update**: Update `FoodItemModal` to select Unit Type <!-- id: 14 -->
    - [ ] **Frontend Update**: Update `FoodForm` to calculate based on Unit Type <!-- id: 15 -->
    - [ ] **Agent Update**: Update Agent to set `unit='serving'` for recipes <!-- id: 16 -->
