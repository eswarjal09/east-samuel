import FoodForm from '../components/FoodForm';
import FoodList from '../components/FoodList';
import { useFood } from '../context/FoodContext';
import { useDate } from '../context/DateContext';

export default function Food() {
    const { getDailyTotals } = useFood();
    const { selectedDate } = useDate();
    const totals = getDailyTotals(selectedDate);

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Food Log</h2>
                    <p className="text-muted-foreground">Track your nutrition.</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{totals.calories} <span className="text-sm text-muted-foreground font-normal">kcal</span></div>
                </div>
            </div>

            <FoodForm />

            <div className="border-t border-border my-6" />

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">Today's Entries</h3>
                <FoodList />
            </div>
        </div>
    );
}
