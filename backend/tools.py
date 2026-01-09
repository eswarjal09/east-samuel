import requests
import time
from . import schemas

def search_food_database(query: str):
    """
    Searches the OpenFoodFacts database for a food item and returns nutrition data per 100g.
    Use this to get accurate data for specific products (e.g. "Nutella", "Oreo", "Barilla Pasta").
    
    Args:
        query: The name of the food to search for.
        
    Returns:
        List of dictionaries containing name, brand, calories, and macros per 100g.
    """
    # OpenFoodFacts requests a User-Agent.
    headers = {"User-Agent": "personal health/1.0 (eswarjal09@gmail.com)"}
    
    def safe_float(val):
        try:
            if val is None: return 0.0
            return float(val)
        except (ValueError, TypeError):
            return 0.0

    try:
        print(f"[DEBUG] Searching OpenFoodFacts for: '{query}'")
        
        # Use V1 search API which supports 'fields' parameter for text search
        # https://world.openfoodfacts.org/cgi/search.pl
        url = "https://world.openfoodfacts.org/cgi/search.pl"
        params = {
            "search_terms": query,
            "search_simple": 1,
            "action": "process",
            "json": 1,
            # Explicitly request only needed fields to reduce payload size
            "fields": "product_name,brands,nutriments,serving_size,serving_quantity",
            "page_size": 5
        }
        
        response = requests.get(url, params=params, headers=headers)
        if response.status_code != 200:
            print(f"[ERROR] OpenFoodFacts API returned status {response.status_code}")
            return []
            
        results = response.json()
        products_found = results.get('products', [])        
        simplified_results = []
        count = 0
        
        # Parse the top 5 results
        for product in products_found:
            if count >= 5:
                break
                
            nutriments = product.get('nutriments', {})
            print(f"nutriments from the product: '{nutriments}'")
            # Try to get 100g values directly
            kcal = nutriments.get('energy-kcal_100g')
            prot = nutriments.get('proteins_100g')
            carb = nutriments.get('carbohydrates_100g')
            fat = nutriments.get('fat_100g')
            
            # Fallback: Calculate from serving if 100g is missing
            if kcal is None:
                serving_qty = safe_float(product.get('serving_quantity'))
                kcal_srv = safe_float(nutriments.get('energy-kcal_serving'))
                
                if serving_qty > 0 and kcal_srv > 0:
                    kcal = (kcal_srv / serving_qty) * 100
                    # Try to fill others from serving too
                    if prot is None: prot = (safe_float(nutriments.get('proteins_serving')) / serving_qty) * 100
                    if carb is None: carb = (safe_float(nutriments.get('carbohydrates_serving')) / serving_qty) * 100
                    if fat is None: fat = (safe_float(nutriments.get('fat_serving')) / serving_qty) * 100

            # If still missing critical energy info, skip
            if kcal is None:
                continue
                
            item = {
                "name": product.get('product_name', 'Unknown'),
                "brand": product.get('brands', 'Unknown'),
                "calories": int(safe_float(kcal)),
                "protein": round(safe_float(prot), 1),
                "carbs": round(safe_float(carb), 1),
                "fat": round(safe_float(fat), 1),
                "serving_size": product.get('serving_size', '100g'),
                "serving_weight": safe_float(product.get('serving_quantity'))  # Normalized weight of serving in grams
            }
            simplified_results.append(item)
            count += 1
            
        print(f"[DEBUG] Found {len(simplified_results)} results for '{query}'")
        return simplified_results
        
    except Exception as e:
        print(f"[ERROR] Error searching OpenFoodFacts: {e}")
        return []

def calculate_recipe_macros(ingredients: list[dict], portions: int = 1):
    """
    Calculates the nutritional values for a recipe.
    If portions > 1, returns values PER PORTION.
    If portions = 1 (default), returns values for the WHOLE BATCH.
    
    Args:
        ingredients: List[dict] (weight_g, calories_per_100g, etc.)
        portions: Number of servings the recipe makes.
                     
    Returns:
        A dictionary with calories/macros for ONE PORTION.
    """
    total_weight = 0
    total_cal = 0
    total_pro = 0
    total_carb = 0
    total_fat = 0
    
    for ing_dict in ingredients:
        # Validate using Pydantic manually for safety
        try:
            ing = schemas.IngredientInput(**ing_dict)
        except Exception:
            # If validation fails, skip or try to use raw dict with defaults
            continue

        w = ing.weight_g
        if w <= 0: continue
        
        factor = w / 100.0
        
        total_weight += w
        total_cal += ing.calories_per_100g * factor
        total_pro += ing.protein_per_100g * factor
        total_carb += ing.carbs_per_100g * factor
        total_fat += ing.fat_per_100g * factor
        
    if portions < 1: portions = 1
    
    # Calculate values per portion
    return {
        "calories": int(total_cal / portions),
        "protein": round(total_pro / portions, 1),
        "carbs": round(total_carb / portions, 1),
        "fat": round(total_fat / portions, 1),
        "weight_per_portion": round(total_weight / portions, 1)
    }
