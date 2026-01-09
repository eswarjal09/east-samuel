from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "MacroFactor Clone API"}

# Food Endpoints
@app.get("/food/items/", response_model=List[schemas.FoodItem])
def read_food_items(db: Session = Depends(get_db)):
    return crud.get_food_items(db)

@app.post("/food/items/", response_model=schemas.FoodItem)
def create_food_item(item: schemas.FoodItemCreate, db: Session = Depends(get_db)):
    return crud.create_food_item(db, item=item)

@app.put("/food/items/{item_id}", response_model=schemas.FoodItem)
def update_food_item(item_id: int, item: schemas.FoodItemCreate, db: Session = Depends(get_db)):
    db_item = crud.update_food_item(db, item_id=item_id, item=item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@app.delete("/food/items/{item_id}")
def delete_food_item(item_id: int, db: Session = Depends(get_db)):
    crud.delete_food_item(db, item_id=item_id)
    return {"ok": True}

@app.get("/food/", response_model=List[schemas.Food])
def read_food_logs(date: str = None, db: Session = Depends(get_db)):
    return crud.get_food_logs(db, date=date)

@app.post("/food/", response_model=schemas.Food)
def create_food_log(food: schemas.FoodCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_food_log(db, food=food)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/food/{food_id}", response_model=schemas.Food)
def update_food_log(food_id: int, food: schemas.FoodCreate, db: Session = Depends(get_db)):
    try:
        db_log = crud.update_food_log(db, log_id=food_id, log_update=food)
        if not db_log:
            raise HTTPException(status_code=404, detail="Log not found")
        return db_log
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/food/{food_id}")
def delete_food_log(food_id: int, db: Session = Depends(get_db)):
    crud.delete_food_log(db, food_id=food_id)
    return {"ok": True}

# Exercise Endpoints
@app.get("/exercise/items/", response_model=List[schemas.ExerciseItem])
def read_exercise_items(db: Session = Depends(get_db)):
    return crud.get_exercise_items(db)

@app.post("/exercise/items/", response_model=schemas.ExerciseItem)
def create_exercise_item(item: schemas.ExerciseItemCreate, db: Session = Depends(get_db)):
    return crud.create_exercise_item(db, item=item)

@app.put("/exercise/items/{item_id}", response_model=schemas.ExerciseItem)
def update_exercise_item(item_id: int, item: schemas.ExerciseItemCreate, db: Session = Depends(get_db)):
    db_item = crud.update_exercise_item(db, item_id=item_id, item=item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@app.delete("/exercise/items/{item_id}")
def delete_exercise_item(item_id: int, db: Session = Depends(get_db)):
    crud.delete_exercise_item(db, item_id=item_id)
    return {"ok": True}

@app.get("/exercise/", response_model=List[schemas.Exercise])
def read_exercise_logs(db: Session = Depends(get_db)):
    return crud.get_exercise_logs(db)

@app.post("/exercise/", response_model=schemas.Exercise)
def create_exercise_log(exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_exercise_log(db, exercise=exercise)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/exercise/{exercise_id}", response_model=schemas.Exercise)
def update_exercise_log(exercise_id: int, exercise: schemas.ExerciseCreate, db: Session = Depends(get_db)):
    try:
        db_log = crud.update_exercise_log(db, log_id=exercise_id, log_update=exercise)
        if not db_log:
            raise HTTPException(status_code=404, detail="Log not found")
        return db_log
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/exercise/{exercise_id}")
def delete_exercise_log(exercise_id: int, db: Session = Depends(get_db)):
    crud.delete_exercise_log(db, exercise_id=exercise_id)
    return {"ok": True}

# Health Endpoints
@app.get("/health/", response_model=List[schemas.Health])
def read_health_metrics(db: Session = Depends(get_db)):
    return crud.get_health_metrics(db)

@app.post("/health/", response_model=schemas.Health)
def create_health_metric(metric: schemas.HealthCreate, db: Session = Depends(get_db)):
    return crud.create_health_metric(db, metric=metric)

@app.delete("/health/{metric_id}")
def delete_health_metric(metric_id: int, db: Session = Depends(get_db)):
    crud.delete_health_metric(db, metric_id=metric_id)
    return {"ok": True}

# Goal Endpoints
@app.get("/goals/", response_model=schemas.Goal)
def read_goal(db: Session = Depends(get_db)):
    goal = crud.get_goal(db)
    if not goal:
        # Return default if not found
        return schemas.Goal(id=0, calories=2500, protein=180, carbs=250, fat=80)
    return goal

@app.post("/goals/", response_model=schemas.Goal)
def update_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db)):
    return crud.create_or_update_goal(db, goal=goal)

# AI Endpoints
import agent
@app.post("/ai/chat", response_model=schemas.AIChatResponse)
def chat_with_ai(request: schemas.AIChatRequest):
    return agent.get_gemini_response(request.message, request.conversation_history)

