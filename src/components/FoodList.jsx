import { useState } from 'react';
import { useFood } from '../context/FoodContext';
import { useDate } from '../context/DateContext';
import { Trash2, Pencil } from 'lucide-react';
import { Card } from './ui/Card';
import Button from './ui/Button';
import EditFoodLogModal from './EditFoodLogModal';

export default function FoodList() {
    const { logs, deleteFood } = useFood();
    const { selectedDate } = useDate();
    const [editingLog, setEditingLog] = useState(null);

    const todaysLogs = logs.filter(log => log.date === selectedDate);

    if (todaysLogs.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No food logged for this day.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {todaysLogs.map((log) => (
                <Card key={log.id} className="flex justify-between items-center group">
                    <div>
                        <h4 className="font-medium">{log.name}</h4>
                        <div className="text-sm text-muted-foreground flex gap-3">
                            <span>{log.calories} kcal</span>
                            <span className="text-blue-400">{log.protein}p</span>
                            <span className="text-yellow-400">{log.carbs}c</span>
                            <span className="text-purple-400">{log.fat}f</span>
                        </div>
                        {log.notes && (
                            <p className="text-xs text-muted-foreground italic mt-1">{log.notes}</p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingLog(log)}
                            className="text-muted-foreground hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Pencil size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteFood(log.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </Card>
            ))}

            <EditFoodLogModal
                isOpen={!!editingLog}
                onClose={() => setEditingLog(null)}
                log={editingLog}
            />
        </div>
    );
}
