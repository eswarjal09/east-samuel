const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
    // Food
    getFoodLogs: async (date) => {
        const url = date ? `${API_URL}/food/?date=${date}` : `${API_URL}/food/`;
        const res = await fetch(url);
        return res.json();
    },
    createFoodLog: async (food) => {
        const res = await fetch(`${API_URL}/food/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(food),
        });
        return res.json();
    },
    updateFoodLog: async (id, food) => {
        const res = await fetch(`${API_URL}/food/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(food),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    deleteFoodLog: async (id) => {
        await fetch(`${API_URL}/food/${id}`, { method: 'DELETE' });
    },
    getFoodItems: async () => {
        const res = await fetch(`${API_URL}/food/items/`);
        return res.json();
    },
    createFoodItem: async (item) => {
        const res = await fetch(`${API_URL}/food/items/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    updateFoodItem: async (id, item) => {
        const res = await fetch(`${API_URL}/food/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    deleteFoodItem: async (id) => {
        await fetch(`${API_URL}/food/items/${id}`, { method: 'DELETE' });
    },

    // Exercise
    getExerciseLogs: async () => {
        const res = await fetch(`${API_URL}/exercise/`);
        return res.json();
    },
    createExerciseLog: async (exercise) => {
        const res = await fetch(`${API_URL}/exercise/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exercise),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    updateExerciseLog: async (id, exercise) => {
        const res = await fetch(`${API_URL}/exercise/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exercise),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    deleteExerciseLog: async (id) => {
        await fetch(`${API_URL}/exercise/${id}`, { method: 'DELETE' });
    },
    getExerciseItems: async () => {
        const res = await fetch(`${API_URL}/exercise/items/`);
        return res.json();
    },
    createExerciseItem: async (item) => {
        const res = await fetch(`${API_URL}/exercise/items/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    updateExerciseItem: async (id, item) => {
        const res = await fetch(`${API_URL}/exercise/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
    deleteExerciseItem: async (id) => {
        await fetch(`${API_URL}/exercise/items/${id}`, { method: 'DELETE' });
    },

    // Health
    getHealthMetrics: async () => {
        const res = await fetch(`${API_URL}/health/`);
        return res.json();
    },
    createHealthMetric: async (metric) => {
        const res = await fetch(`${API_URL}/health/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metric),
        });
        return res.json();
    },

    deleteHealthMetric: async (id) => {
        await fetch(`${API_URL}/health/${id}`, { method: 'DELETE' });
    },

    // Goals
    getGoal: async () => {
        const res = await fetch(`${API_URL}/goals/`);
        return res.json();
    },
    updateGoal: async (goal) => {
        const res = await fetch(`${API_URL}/goals/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal),
        });
        return res.json();
    },

    // AI
    chatWithAI: async (message, history) => {
        const res = await fetch(`${API_URL}/ai/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, conversation_history: history }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
    },
};
