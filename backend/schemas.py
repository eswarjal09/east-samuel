from pydantic import BaseModel
from typing import Optional, List

# Food Schemas
class FoodItemBase(BaseModel):
    name: str
    calories: int
    protein: float
    carbs: float
    carbs: float
    fat: float
    serving_unit: str = "grams"
    serving_weight: Optional[float] = None

class FoodItemCreate(FoodItemBase):
    pass

class FoodItem(FoodItemBase):
    id: int
    class Config:
        from_attributes = True

class FoodBase(BaseModel):
    name: str
    calories: int
    protein: float
    carbs: float
    fat: float
    date: str
    quantity: Optional[float] = None
    unit: Optional[str] = None

class FoodCreate(BaseModel):
    food_item_id: int
    weight: Optional[float] = None
    date: str
    notes: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None

class Food(FoodBase):
    id: int
    notes: Optional[str] = None
    class Config:
        from_attributes = True

# Exercise Schemas
class ExerciseItemBase(BaseModel):
    name: str

class ExerciseItemCreate(ExerciseItemBase):
    pass

class ExerciseItem(ExerciseItemBase):
    id: int
    class Config:
        from_attributes = True

class ExerciseBase(BaseModel):
    name: str
    weight: Optional[float] = None
    reps: int
    rpe: Optional[float] = None
    date: str
    notes: Optional[str] = None

class ExerciseCreate(BaseModel):
    exercise_item_id: int
    reps: int
    weight: Optional[float] = None # Still allow weight for logging purpose (e.g. lift weight), but name comes from item
    rpe: Optional[float] = None
    date: str
    notes: Optional[str] = None

class Exercise(ExerciseBase):
    id: int
    class Config:
        from_attributes = True

# Health Schemas
class HealthBase(BaseModel):
    type: str
    value: float
    unit: str
    date: str

class HealthCreate(HealthBase):
    pass

class Health(HealthBase):
    id: int
    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    calories: int
    protein: int
    carbs: int
    fat: int

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    class Config:
        from_attributes = True

# AI Schemas
class AIChatRequest(BaseModel):
    message: str
    conversation_history: List[dict] # [{"role": "user", "parts": ["text"]}, ...]

class AIChatResponse(BaseModel):
    response: str
    structured_food: Optional[FoodItemCreate] = None

class IngredientInput(BaseModel):
    weight_g: float
    calories_per_100g: float
    protein_per_100g: float
    carbs_per_100g: float
    fat_per_100g: float
