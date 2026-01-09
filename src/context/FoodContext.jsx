import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const FoodContext = createContext();

export function useFood() {
    return useContext(FoodContext);
}

export function FoodProvider({ children }) {
    const [logs, setLogs] = useState([]);
    const [goals, setGoals] = useState({
        calories: 2500,
        protein: 180,
        carbs: 250,
        fat: 80,
    });

    const fetchData = async () => {
        try {
            const [logsData, goalsData] = await Promise.all([
                api.getFoodLogs(),
                api.getGoal()
            ]);
            setLogs(logsData);
            // Ensure goalsData has values, otherwise fallback (though API handles this)
            if (goalsData) {
                setGoals(goalsData);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addFood = async (food, date) => {
        try {
            const newLog = await api.createFoodLog({
                ...food,
                date: date || new Date().toISOString().split('T')[0],
            });
            setLogs((prev) => [newLog, ...prev]);
        } catch (error) {
            console.error("Failed to add food:", error);
        }
    };

    const updateFood = async (id, food) => {
        try {
            const updatedLog = await api.updateFoodLog(id, food);
            setLogs((prev) => prev.map((log) => (log.id === id ? updatedLog : log)));
        } catch (error) {
            console.error("Failed to update food:", error);
            throw error;
        }
    };

    const deleteFood = async (id) => {
        try {
            await api.deleteFoodLog(id);
            setLogs((prev) => prev.filter((log) => log.id !== id));
        } catch (error) {
            console.error("Failed to delete food:", error);
        }
    };

    const getDailyTotals = (date) => {
        const dayLogs = logs.filter((log) => log.date === date);
        return dayLogs.reduce(
            (acc, log) => ({
                calories: acc.calories + (Number(log.calories) || 0),
                protein: acc.protein + (Number(log.protein) || 0),
                carbs: acc.carbs + (Number(log.carbs) || 0),
                fat: acc.fat + (Number(log.fat) || 0),
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
    };

    return (
        <FoodContext.Provider value={{ logs, goals, setGoals, addFood, updateFood, deleteFood, getDailyTotals }}>
            {children}
        </FoodContext.Provider>
    );
}
