import { useHealth } from '../context/HealthContext';
import { useDate } from '../context/DateContext';
import { Trash2 } from 'lucide-react';
import { Card } from './ui/Card';
import Button from './ui/Button';

export default function HealthHistory() {
    const { metrics, deleteMetric } = useHealth();
    const { selectedDate } = useDate();

    const daysMetrics = metrics.filter(m => m.date === selectedDate);

    if (daysMetrics.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No health metrics logged for this day.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {daysMetrics.map((metric) => (
                <Card key={metric.id} className="flex justify-between items-center">
                    <div>
                        <h4 className="font-medium capitalize">{metric.type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <p className="text-sm text-muted-foreground">
                            {new Date(metric.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xl font-bold">
                            {metric.value} <span className="text-sm text-muted-foreground font-normal">{metric.unit}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMetric(metric.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete Entry"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}
