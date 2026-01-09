import { createContext, useContext, useState } from 'react';

const DateContext = createContext();

export function useDate() {
    return useContext(DateContext);
}

export function DateProvider({ children }) {
    // Helper to get local date string YYYY-MM-DD
    const getLocalDateString = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [selectedDate, setSelectedDate] = useState(getLocalDateString());

    const nextDay = () => {
        const today = getLocalDateString();
        if (selectedDate === today) return;

        const date = new Date(selectedDate + 'T00:00:00'); // Force local midnight parsing if we wanted, but safer to just use YMD integers
        // Actually, easiest to just parse YYYY-MM-DD
        const [y, m, d] = selectedDate.split('-').map(Number);
        const newDate = new Date(y, m - 1, d + 1);
        setSelectedDate(getLocalDateString(newDate));
    };

    const prevDay = () => {
        const [y, m, d] = selectedDate.split('-').map(Number);
        const newDate = new Date(y, m - 1, d - 1);
        setSelectedDate(getLocalDateString(newDate));
    };

    const resetToToday = () => {
        setSelectedDate(getLocalDateString());
    };

    const isToday = selectedDate === getLocalDateString();

    // Check if selectedDate is in the future relative to today's local date
    const isFuture = selectedDate > getLocalDateString();

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate, nextDay, prevDay, resetToToday, isToday, isFuture }}>
            {children}
        </DateContext.Provider>
    );
}
