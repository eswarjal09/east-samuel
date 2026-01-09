import { useState } from 'react';
import { useExercise } from '../context/ExerciseContext';
import { useDate } from '../context/DateContext';
import { Trash2, Dumbbell, Pencil } from 'lucide-react';
import { Card } from './ui/Card';
import Button from './ui/Button';
import EditExerciseLogModal from './EditExerciseLogModal';

export default function ExerciseList() {
    const { workouts, deleteSet } = useExercise();
    const { selectedDate } = useDate();
    const [editingLog, setEditingLog] = useState(null);

    const daysWorkouts = workouts.filter(w => w.date === selectedDate);

    if (daysWorkouts.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>No workouts logged for this day.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {daysWorkouts.map((set) => (
                <Card key={set.id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary rounded-lg">
                            <Dumbbell size={16} />
                        </div>
                        <div>
                            <h5 className="font-medium">{set.name}</h5>
                            <p className="text-sm text-muted-foreground">
                                {set.weight}kg × {set.reps} reps {set.rpe && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded ml-2">RPE {set.rpe}</span>}
                            </p>
                            {set.notes && (
                                <p className="text-xs text-muted-foreground italic mt-1">{set.notes}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingLog(set)}
                            className="text-muted-foreground hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Pencil size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSet(set.id)}
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                </Card>
            ))}

            <EditExerciseLogModal
                isOpen={!!editingLog}
                onClose={() => setEditingLog(null)}
                log={editingLog}
            />
        </div>
    );
}
