import { useFood } from '../context/FoodContext';

import { useDate } from '../context/DateContext';
import SummaryCard from '../components/SummaryCard';
import { Flame, Beef, Wheat, Droplets } from 'lucide-react';
import WeightChart from '../components/WeightChart';

export default function Dashboard() {
    const { getDailyTotals, goals } = useFood();

    const { selectedDate } = useDate();

    const totals = getDailyTotals(selectedDate);


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Here's your daily breakdown.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-sm text-muted-foreground">{(() => {
                        const [y, m, d] = selectedDate.split('-').map(Number);
                        const date = new Date(y, m - 1, d);
                        return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    })()}</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                    title="Calories"
                    value={totals.calories}
                    target={goals.calories}
                    unit="kcal"
                    icon={Flame}
                    color="orange"
                />
                <SummaryCard
                    title="Protein"
                    value={totals.protein}
                    target={goals.protein}
                    unit="g"
                    icon={Beef}
                    color="blue"
                />
                <SummaryCard
                    title="Carbs"
                    value={totals.carbs}
                    target={goals.carbs}
                    unit="g"
                    icon={Wheat}
                    color="yellow"
                />
                <SummaryCard
                    title="Fat"
                    value={totals.fat}
                    target={goals.fat}
                    unit="g"
                    icon={Droplets}
                    color="purple"
                />
            </div>

            <div className="border-t border-border" />

            <div className="grid gap-4 md:grid-cols-2">
                {/* Weight Card */}
                <WeightChart className="col-span-1 md:col-span-2" />


            </div>
        </div>
    );
}
