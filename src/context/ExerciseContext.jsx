import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const ExerciseContext = createContext();

export function useExercise() {
    return useContext(ExerciseContext);
}

export function ExerciseProvider({ children }) {
    const [workouts, setWorkouts] = useState([]);

    const fetchWorkouts = async () => {
        try {
            const data = await api.getExerciseLogs();
            // Sort by ID desc (newest first) as a proxy for timestamp since we don't have timestamp in DB yet
            // or we can rely on DB order. Let's reverse to show newest added first.
            setWorkouts(data.reverse());
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const addSet = async (exercise, date) => {
        try {
            const newSet = await api.createExerciseLog({
                ...exercise,
                date: date || new Date().toISOString().split('T')[0],
            });
            setWorkouts((prev) => [newSet, ...prev]);
        } catch (error) {
            console.error("Failed to add workout:", error);
        }
    };

    const updateSet = async (id, exercise) => {
        try {
            const updatedSet = await api.updateExerciseLog(id, exercise);
            setWorkouts((prev) => prev.map((set) => (set.id === id ? updatedSet : set)));
        } catch (error) {
            console.error("Failed to update workout:", error);
            throw error;
        }
    };

    const deleteSet = async (id) => {
        try {
            await api.deleteExerciseLog(id);
            setWorkouts((prev) => prev.filter((set) => set.id !== id));
        } catch (error) {
            console.error("Failed to delete workout:", error);
        }
    };

    const getHistory = (exerciseName) => {
        return workouts
            .filter((w) => w.name.toLowerCase() === exerciseName.toLowerCase());
    };

    return (
        <ExerciseContext.Provider value={{ workouts, addSet, updateSet, deleteSet, getHistory }}>
            {children}
        </ExerciseContext.Provider>
    );
}
