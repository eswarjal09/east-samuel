import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useDate } from '../context/DateContext';

export default function DateNavigator() {
    const { selectedDate, nextDay, prevDay, resetToToday, isToday } = useDate();

    const formatDate = (dateString) => {
        // Parse the selected date string (YYYY-MM-DD) components
        const [y, m, d] = dateString.split('-').map(Number);
        const selectedDateObj = new Date(y, m - 1, d);

        // Get "Today" and "Yesterday" in terms of local YYYY-MM-DD strings
        const now = new Date();
        const getLocalYMD = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const todayStr = getLocalYMD(now);

        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterdayStr = getLocalYMD(yesterdayDate);

        if (dateString === todayStr) return 'Today';
        if (dateString === yesterdayStr) return 'Yesterday';

        return selectedDateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
            <button
                onClick={prevDay}
                className="p-1 hover:bg-background rounded-md transition-colors text-muted-foreground hover:text-foreground"
            >
                <ChevronLeft size={20} />
            </button>

            <button
                onClick={resetToToday}
                className="flex items-center gap-2 px-2 py-1 hover:bg-background rounded-md transition-colors min-w-[100px] justify-center"
            >
                <Calendar size={14} className="text-muted-foreground" />
                <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
            </button>

            <button
                onClick={nextDay}
                disabled={isToday}
                className={`p-1 rounded-md transition-colors ${isToday
                        ? 'text-muted-foreground/30 cursor-not-allowed'
                        : 'hover:bg-background text-muted-foreground hover:text-foreground'
                    }`}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
