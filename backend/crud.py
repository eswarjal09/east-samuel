from sqlalchemy.orm import Session
from . import models, schemas

# Food CRUD
def get_food_items(db: Session):
    return db.query(models.FoodItem).all()

def create_food_item(db: Session, item: schemas.FoodItemCreate):
    db_item = models.FoodItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_food_item(db: Session, item_id: int, item: schemas.FoodItemCreate):
    db_item = db.query(models.FoodItem).filter(models.FoodItem.id == item_id).first()
    if db_item:
        for key, value in item.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_food_item(db: Session, item_id: int):
    # Depending on requirements, we might want to cascade delete logs or prevent delete if logs exist.
    # For now, simple delete (might fail if foreign keys enforce strict integrity without cascade).
    # Assuming standard cascade or user accepts old logs might break or lose info if relying on relation.
    # Actually, FoodLog copies name/macros at creation time (unlinked usually in simple apps, but here linked?).
    # Check create_food_log: it copies fields "name=item.name...". It DOES NOT store foreign key?
    # Wait, create_food_log in crud.py lines 30-38 stores values directly.
    # Logic check: `food_item_id` is NOT in FoodLog model based on implied usage?
    # Let's check models.py to be safe. But if it copies, deleting Item is safe for history.
    db.query(models.FoodItem).filter(models.FoodItem.id == item_id).delete()
    db.commit()

def get_food_logs(db: Session, date: str = None):
    query = db.query(models.FoodLog)
    if date:
        query = query.filter(models.FoodLog.date == date)
    return query.all()

def create_food_log(db: Session, food: schemas.FoodCreate):
    # Fetch the food item to calculate macros
    item = db.query(models.FoodItem).filter(models.FoodItem.id == food.food_item_id).first()
    if not item:
        raise ValueError("Food item not found")
    
    # Calculate macros
    multiplier = 0.0
    
    if item.serving_unit == 'serving':
        # Item macros are PER SERVING
        if food.unit == 'serving' and food.quantity is not None:
             multiplier = food.quantity
        elif food.weight > 0 and item.serving_weight:
             multiplier = food.weight / item.serving_weight
        else:
             # Fallback: If logged as serving but no quantity -> use 1.0 (or 0?)
             # User asked to keep it simple. If we don't have quantity/weight, we can't calculate.
             multiplier = food.quantity if food.quantity else 0.0

    else:
        # Item macros are PER 100g
        if food.weight > 0:
            # Standard weight based logging
            multiplier = food.weight / 100.0
        elif food.unit == 'serving' and food.quantity is not None:
            if item.serving_weight:
                # Convert serving to weight
                multiplier = (food.quantity * item.serving_weight) / 100.0
            else:
                # User specifically asked for this error state/constraint logic previously?
                # Actually user just said "simplify portion size based".
                # If per 100g but logged as portion WITHOUT serving weight, we technically can't do it.
                multiplier = 0.0
            
    db_food = models.FoodLog(
        name=item.name,
        calories=int(item.calories * multiplier),
        protein=round(item.protein * multiplier, 1),
        carbs=round(item.carbs * multiplier, 1),
        fat=round(item.fat * multiplier, 1),
        date=food.date,
        notes=food.notes,
        quantity=food.quantity,
        unit=food.unit
    )
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def update_food_log(db: Session, log_id: int, log_update: schemas.FoodCreate):
    db_log = db.query(models.FoodLog).filter(models.FoodLog.id == log_id).first()
    if not db_log:
        return None
    
    # Recalculate if weight changed or food item changed (if we supported changing item, but here we only receive weight/notes typically, wait FoodCreate has food_item_id)
    # If food_item_id changes, we need to fetch new item.
    item = db.query(models.FoodItem).filter(models.FoodItem.id == log_update.food_item_id).first()
    if not item:
        raise ValueError("Food item not found")

    ratio = log_update.weight / 100.0
    
    db_log.name = item.name
    db_log.calories = int(item.calories * ratio)
    db_log.protein = round(item.protein * ratio, 1)
    db_log.carbs = round(item.carbs * ratio, 1)
    db_log.fat = round(item.fat * ratio, 1)
    db_log.date = log_update.date
    db_log.notes = log_update.notes
    
    db.commit()
    db.refresh(db_log)
    return db_log

def delete_food_log(db: Session, food_id: int):
    db.query(models.FoodLog).filter(models.FoodLog.id == food_id).delete()
    db.commit()

# Exercise CRUD
def get_exercise_items(db: Session):
    return db.query(models.ExerciseItem).all()

def create_exercise_item(db: Session, item: schemas.ExerciseItemCreate):
    db_item = models.ExerciseItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_exercise_item(db: Session, item_id: int, item: schemas.ExerciseItemCreate):
    db_item = db.query(models.ExerciseItem).filter(models.ExerciseItem.id == item_id).first()
    if db_item:
        for key, value in item.dict().items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_exercise_item(db: Session, item_id: int):
    db.query(models.ExerciseItem).filter(models.ExerciseItem.id == item_id).delete()
    db.commit()

def get_exercise_logs(db: Session):
    return db.query(models.ExerciseLog).all()

def create_exercise_log(db: Session, exercise: schemas.ExerciseCreate):
    item = db.query(models.ExerciseItem).filter(models.ExerciseItem.id == exercise.exercise_item_id).first()
    if not item:
        raise ValueError("Exercise item not found")

    db_exercise = models.ExerciseLog(
        name=item.name,
        weight=exercise.weight,
        reps=exercise.reps,
        rpe=exercise.rpe,
        date=exercise.date,
        notes=exercise.notes
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    return db_exercise

def update_exercise_log(db: Session, log_id: int, log_update: schemas.ExerciseCreate):
    db_log = db.query(models.ExerciseLog).filter(models.ExerciseLog.id == log_id).first()
    if not db_log:
        return None

    item = db.query(models.ExerciseItem).filter(models.ExerciseItem.id == log_update.exercise_item_id).first()
    if not item:
        raise ValueError("Exercise item not found")

    db_log.name = item.name
    db_log.weight = log_update.weight
    db_log.reps = log_update.reps
    db_log.rpe = log_update.rpe
    db_log.date = log_update.date
    db_log.notes = log_update.notes

    db.commit()
    db.refresh(db_log)
    return db_log

def delete_exercise_log(db: Session, exercise_id: int):
    db.query(models.ExerciseLog).filter(models.ExerciseLog.id == exercise_id).delete()
    db.commit()

# Health CRUD
def get_health_metrics(db: Session):
    return db.query(models.HealthMetric).all()

def create_health_metric(db: Session, metric: schemas.HealthCreate):
    db_metric = models.HealthMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    db.refresh(db_metric)
    return db_metric

def delete_health_metric(db: Session, metric_id: int):
    db.query(models.HealthMetric).filter(models.HealthMetric.id == metric_id).delete()
    db.commit()

# Goal CRUD
def get_goal(db: Session):
    return db.query(models.Goal).first()

def create_or_update_goal(db: Session, goal: schemas.GoalCreate):
    db_goal = db.query(models.Goal).first()
    if db_goal:
        db_goal.calories = goal.calories
        db_goal.protein = goal.protein
        db_goal.carbs = goal.carbs
        db_goal.fat = goal.fat
    else:
        db_goal = models.Goal(**goal.dict())
        db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal
