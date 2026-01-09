import { useState, useEffect } from 'react';
import { useExercise } from '../context/ExerciseContext';
import { useDate } from '../context/DateContext';
import { Plus } from 'lucide-react';
import { api } from '../api/client';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import ExerciseItemModal from './ExerciseItemModal';
import ManageItemsModal from './ManageItemsModal';

export default function ExerciseForm() {
    const { addSet } = useExercise();
    const { selectedDate, isFuture } = useDate();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [exerciseItems, setExerciseItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rpe, setRpe] = useState('');
    const [notes, setNotes] = useState('');

    // New Item Modal
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
    }, [isOpen]);

    const loadItems = async () => {
        try {
            const items = await api.getExerciseItems();
            setExerciseItems(items);
        } catch (err) {
            console.error("Failed to load exercises", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItemId || !reps) return; // Reps is strict requirement per user

        await addSet({
            exercise_item_id: Number(selectedItemId),
            weight: weight ? Number(weight) : null,
            reps: Number(reps),
            rpe: rpe ? Number(rpe) : null,
            notes
        }, selectedDate);

        // Reset fields but keep selection for next set? User often logs multiple sets.
        // Original code kept name.
        setReps('');
        setRpe('');
        setNotes('');
        // Keep weight? Often same weight.
        // Keep selection.
        // But close modal? User request said "when logging...".
        // Original `handleSubmit` closed modal? No.
        // "setIsOpen(false)" was in original?
        // Let's check original.
        // Original: setFormData(prev => ({ ...prev, weight: '', reps: '', rpe: '', notes: '' })); // Keep name for next set
        // But it DID NOT close modal in original code I think?
        // Wait, original:
        // const handleSubmit = (e) => {
        //     e.preventDefault();
        //     addSet(formData, selectedDate);
        //     setFormData(prev => ({ ...prev, weight: '', reps: '', rpe: '', notes: '' })); // Keep name for next set
        // };
        // It did NOT close modal. So I should NOT close modal to allow multiple sets.
        // But I should show success feedback? Or just clear inputs.
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                className={`w-full py-8 text-lg rounded-2xl border-dashed border-2 ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isFuture && setIsOpen(true)}
                disabled={isFuture}
            >
                <Plus size={20} className="mr-2" />
                {isFuture ? 'Cannot log future' : 'Log Workout'}
            </Button>
        );
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Set">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-muted-foreground">Select Exercise</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsManageModalOpen(true)}
                                    className="text-xs text-muted-foreground hover:text-white transition-colors"
                                >
                                    Manage Items
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsItemModalOpen(true)}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    + Create New Exercise
                                </button>
                            </div>
                        </div>
                        <select
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                            value={selectedItemId}
                            onChange={(e) => setSelectedItemId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose an exercise --</option>
                            {exerciseItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            label="Weight (lbs/kg)"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="Optional"
                        />
                        <Input
                            label="Reps"
                            type="number"
                            required
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            placeholder="0"
                        />
                        <Input
                            label="RPE"
                            type="number"
                            max="10"
                            value={rpe}
                            onChange={(e) => setRpe(e.target.value)}
                            placeholder="-"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[60px]"
                            placeholder="Form cues..."
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={!selectedItemId || !reps}>
                        Log Set
                    </Button>
                </form>
            </Modal>

            <ExerciseItemModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                onSuccess={() => {
                    loadItems();
                }}
            />

            <ManageItemsModal
                isOpen={isManageModalOpen}
                onClose={() => {
                    setIsManageModalOpen(false);
                    loadItems(); // Refresh list
                }}
                type="exercise"
            />
        </>
    );
}
