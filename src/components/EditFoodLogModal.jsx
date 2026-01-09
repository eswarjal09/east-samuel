import { useState, useEffect } from 'react';
import { useFood } from '../context/FoodContext';
import { api } from '../api/client';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function EditFoodLogModal({ isOpen, onClose, log }) {
    const { updateFood } = useFood();
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && log && foodItems.length > 0) {
            setNotes(log.notes || '');
            // Try to find matching item by name
            const match = foodItems.find(i => i.name === log.name);
            if (match) {
                setSelectedItemId(match.id);
                // Reverse calculate weight: (log.calories / item.calories) * 100
                if (match.calories > 0) {
                    const calcWeight = (log.calories / match.calories) * 100;
                    setWeight(Math.round(calcWeight));
                }
            } else {
                // If no match found, we can't easily edit weight autocalc.
                // User must select item manually.
                setWeight('');
                setSelectedItemId('');
            }
        }
    }, [isOpen, log, foodItems]);

    const loadItems = async () => {
        try {
            const items = await api.getFoodItems();
            setFoodItems(items);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateFood(log.id, {
                food_item_id: Number(selectedItemId),
                weight: Number(weight),
                notes,
                date: log.date // Keep original date
            });
            onClose();
        } catch (err) {
            setError(err.message || "Failed to update log");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Log">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                {!selectedItemId && (
                    <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 text-sm text-yellow-200">
                        Could not automatically link this log to a food item. Please select the food again to edit.
                    </div>
                )}

                <div>
                    <label className="text-sm font-medium text-muted-foreground">Food Item</label>
                    <select
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        required
                    >
                        <option value="">-- Select Food --</option>
                        {foodItems.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name} ({item.calories} cal/100g)
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="Weight (g)"
                    type="number"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />

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
                    <Button type="submit" className="flex-1" disabled={loading || !selectedItemId || !weight}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
