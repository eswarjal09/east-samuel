from sqlalchemy import Column, Integer, String, Float, Date
from database import Base

class FoodLog(Base):
    __tablename__ = "food_logs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Integer)
    protein = Column(Float)
    carbs = Column(Float)
    fat = Column(Float)
    date = Column(String, index=True) # Storing as YYYY-MM-DD string for simplicity with SQLite
    notes = Column(String, nullable=True)
    quantity = Column(Float, nullable=True) # The amount entered by user (e.g. 1.5)
    unit = Column(String, nullable=True)     # The unit entered by user (e.g. 'serving', 'g')

class ExerciseLog(Base):
    __tablename__ = "exercise_logs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    weight = Column(Float)
    reps = Column(Integer)
    rpe = Column(Float, nullable=True)
    date = Column(String, index=True)
    notes = Column(String, nullable=True)

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, index=True) # 'weight', 'bodyFat', 'sleep'
    value = Column(Float)
    unit = Column(String)
    date = Column(String, index=True)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    calories = Column(Integer, default=2500)
    protein = Column(Integer, default=180)
    carbs = Column(Integer, default=250)
    fat = Column(Integer, default=80)

class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    calories = Column(Integer) # per 100g
    protein = Column(Float) # per 100g
    carbs = Column(Float) # per 100g
    fat = Column(Float) # per 100g
    serving_unit = Column(String, default="grams") # "grams" or "serving"
    serving_weight = Column(Float, nullable=True) # Weight of one serving in grams

class ExerciseItem(Base):
    __tablename__ = "exercise_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
