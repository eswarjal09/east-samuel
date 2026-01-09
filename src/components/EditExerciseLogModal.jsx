import { useState, useEffect } from 'react';
import { useExercise } from '../context/ExerciseContext';
import { api } from '../api/client';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function EditExerciseLogModal({ isOpen, onClose, log }) {
    const { updateSet } = useExercise();
    const [exerciseItems, setExerciseItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRpe] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && log && exerciseItems.length > 0) {
            setNotes(log.notes || '');
            setWeight(log.weight || '');
            setReps(log.reps || '');
            setRpe(log.rpe || '');

            const match = exerciseItems.find(i => i.name === log.name);
            if (match) {
                setSelectedItemId(match.id);
            } else {
                setSelectedItemId('');
            }
        }
    }, [isOpen, log, exerciseItems]);

    const loadItems = async () => {
        try {
            const items = await api.getExerciseItems();
            setExerciseItems(items);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateSet(log.id, {
                exercise_item_id: Number(selectedItemId),
                weight: weight ? Number(weight) : null,
                reps: Number(reps),
                rpe: rpe ? Number(rpe) : null,
                notes,
                date: log.date
            });
            onClose();
        } catch (err) {
            setError(err.message || "Failed to update log");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Set">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label className="text-sm font-medium text-muted-foreground">Exercise</label>
                    <select
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        required
                    >
                        <option value="">-- Select Exercise --</option>
                        {exerciseItems.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                    <Input
                        label="Reps"
                        type="number"
                        required
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                    />
                    <Input
                        label="RPE"
                        type="number"
                        value={rpe}
                        onChange={(e) => setRpe(e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading || !selectedItemId || !reps}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
