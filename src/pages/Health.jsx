import HealthForm from '../components/HealthForm';
import HealthHistory from '../components/HealthHistory';
import { useHealth } from '../context/HealthContext';
import { useDate } from '../context/DateContext';

export default function Health() {
    const { getMetricsForDate } = useHealth();
    const { selectedDate } = useDate();

    const daysMetrics = getMetricsForDate(selectedDate);
    const weight = daysMetrics.find(m => m.type === 'weight');
    const bodyFat = daysMetrics.find(m => m.type === 'bodyFat');
    const sleep = daysMetrics.find(m => m.type === 'sleep');

    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Health Details</h2>
                <p className="text-muted-foreground">Monitor your body metrics.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Weight</p>
                    <div className="font-bold text-xl">{weight ? weight.value : '--'} <span className="text-xs font-normal text-muted-foreground">lbs</span></div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Body Fat</p>
                    <div className="font-bold text-xl">{bodyFat ? bodyFat.value : '--'} <span className="text-xs font-normal text-muted-foreground">%</span></div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Sleep</p>
                    <div className="font-bold text-xl">{sleep ? sleep.value : '--'} <span className="text-xs font-normal text-muted-foreground">hrs</span></div>
                </div>
            </div>

            <HealthForm />

            <div className="border-t border-border my-6" />

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">History</h3>
                <HealthHistory />
            </div>
        </div>
    );
}
