import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useDate } from './DateContext';

const HealthContext = createContext();

export function useHealth() {
    return useContext(HealthContext);
}

export function HealthProvider({ children }) {
    const [metrics, setMetrics] = useState([]);

    const fetchMetrics = async () => {
        try {
            const data = await api.getHealthMetrics();
            // Sort by ID desc
            setMetrics(data.reverse());
        } catch (error) {
            console.error("Failed to fetch health metrics:", error);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, []);

    const { selectedDate } = useDate();

    const addMetric = async (type, value, unit, notes, date = null) => {
        const dateToUse = date || selectedDate;
        try {
            const newMetric = await api.createHealthMetric({
                type,
                value: Number(value),
                unit,
                date: dateToUse,
                // notes: notes // Backend doesn't support notes yet, but keeping signature consistent
            });

            setMetrics((prev) => {
                return [newMetric, ...prev];
            });
        } catch (error) {
            console.error("Failed to add metric:", error);
        }
    };

    const deleteMetric = async (id) => {
        // console.log("Deleting metric with ID:", id); // Debug log
        try {
            await api.deleteHealthMetric(id);
            setMetrics((prev) => prev.filter((m) => m.id !== id));
        } catch (error) {
            console.error("Failed to delete metric:", error);
            alert("Failed to delete metric. Check console for details.");
        }
    };

    const getLatestMetric = (type) => {
        return metrics.find((m) => m.type === type);
    };

    const getMetricHistory = (type) => {
        return metrics
            .filter((m) => m.type === type)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const getMetricsForDate = (date) => {
        return metrics.filter((m) => m.date === date);
    };

    return (
        <HealthContext.Provider value={{ metrics, addMetric, deleteMetric, getLatestMetric, getMetricHistory, getMetricsForDate }}>
            {children}
        </HealthContext.Provider>
    );
}
