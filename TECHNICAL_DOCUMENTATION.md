# Technical Documentation

## Project Overview
**Personal Health** is a full-stack health tracking application designed to help users monitor their nutrition, exercise, and body metrics. It features a React frontend and a FastAPI backend with a SQLite database (configurable for PostgreSQL).

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (Icons), React Router DOM.
- **Backend**: FastAPI, SQLAlchemy (ORM), Pydantic (Schemas), SQLite (Local DB).
- **Language**: JavaScript (Frontend), Python (Backend).
    ```

## Database Schema (SQLAlchemy Models)
Defined in `backend/models.py`.

### `FoodLog` (`food_logs`)
- `id`: Integer, Primary Key
- `name`: String
- `calories`: Integer
- `protein`: Float
- `carbs`: Float
- `fat`: Float
- `date`: String (YYYY-MM-DD)

### `ExerciseLog` (`exercise_logs`)
- `id`: Integer, Primary Key
- `name`: String
- `weight`: Float
- `reps`: Integer
- `rpe`: Float (Optional)
- `date`: String (YYYY-MM-DD)

### `HealthMetric` (`health_metrics`)
- `id`: Integer, Primary Key
- `type`: String ('weight', 'bodyFat', 'sleep')
- `value`: Float
- `unit`: String
- `date`: String (YYYY-MM-DD)

### `Goal` (`goals`)
- `id`: Integer, Primary Key
- `calories`: Integer (Default: 2500)
- `protein`: Integer (Default: 180)
- `carbs`: Integer (Default: 250)
- `fat`: Integer (Default: 80)

## API Endpoints
Defined in `backend/main.py`. Base URL: `http://localhost:8000`.

### Food
- `GET /food/`: Get all food logs (optional `?date=YYYY-MM-DD` filter).
- `POST /food/`: Create a new food log.
- `DELETE /food/{food_id}`: Delete a food log by ID.

### Exercise
- `GET /exercise/`: Get all exercise logs.
- `POST /exercise/`: Create a new exercise log.
- `DELETE /exercise/{exercise_id}`: Delete an exercise log by ID.

### Health
- `GET /health/`: Get all health metrics.
- `POST /health/`: Create a new health metric.
- `DELETE /health/{metric_id}`: Delete a health metric by ID.

### Goals
- `GET /goals/`: Get current goals (returns default if none exist).
- `POST /goals/`: Update goals.

## Frontend Architecture

### Context Providers
State is managed globally using React Context API:
- **`DateContext`**: Manages the globally selected date (`selectedDate`).
- **`FoodContext`**: Manages food logs and goals. Filters data based on `selectedDate`.
- **`ExerciseContext`**: Manages workout logs.
- **`HealthContext`**: Manages health metrics (weight, body fat, etc.).

### Key Components
- **`Layout.jsx`**: Main wrapper with navigation (Sidebar for desktop, Top/Bottom bar for mobile) and `DateNavigator`.
- **`DateNavigator.jsx`**: Controls for switching dates (Prev, Next, Today).
- **`Dashboard.jsx`**: Overview page showing daily summaries and progress.
- **`FoodForm.jsx` / `FoodList.jsx`**: Components for logging and viewing food.
- **`ExerciseForm.jsx` / `ExerciseList.jsx`**: Components for logging and viewing workouts.
- **`HealthForm.jsx` / `HealthHistory.jsx`**: Components for logging and viewing health metrics.
