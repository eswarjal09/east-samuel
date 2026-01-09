import { useState, useEffect } from 'react';
import { useFood } from '../context/FoodContext';
import { useDate } from '../context/DateContext';
import { api } from '../api/client';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import FoodItemModal from './FoodItemModal';
import ManageItemsModal from './ManageItemsModal';
import AIChatModal from './AIChatModal';
import { Plus, Calculator, Sparkles } from 'lucide-react';

export default function FoodForm() {
    const { addFood } = useFood();
    const { selectedDate, isFuture } = useDate();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [inputUnit, setInputUnit] = useState('grams'); // 'grams' or 'serving'
    const [notes, setNotes] = useState('');

    // New Item Modal State
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
    }, [isOpen]);

    const loadItems = async () => {
        try {
            const items = await api.getFoodItems();
            setFoodItems(items);
        } catch (err) {
            console.error("Failed to load food items", err);
        }
    };

    const selectedItem = foodItems.find(i => i.id === Number(selectedItemId));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedItemId || !inputValue) return;

        // Simplify payload: send strictly what user entered
        const payload = {
            food_item_id: Number(selectedItemId),
            date: selectedDate,
            notes
        };

        if (inputUnit === 'grams') {
            payload.weight = Number(inputValue);
            payload.quantity = null;
            payload.unit = 'g';
        } else {
            // Servings
            payload.weight = null; // Don't try to interpret
            payload.quantity = Number(inputValue);
            payload.unit = 'serving';
        }

        await addFood(payload, selectedDate);

        // Reset
        setInputValue('');
        setNotes('');
        setIsOpen(false);
    };

    let multiplier = 0;
    if (selectedItem && inputValue) {
        const val = Number(inputValue);
        if (selectedItem.serving_unit === 'serving') {
            // Item is PER SERVING. We strictly forced 'serving' input.
            // Multiplier is just the quantity.
            multiplier = val;
        } else {
            // Item is PER 100g. We strictly forced 'grams' input.
            // Multiplier is weight / 100.
            multiplier = val / 100;
        }
    }

    const calculatedMacros = selectedItem && inputValue ? {
        calories: Math.round(selectedItem.calories * multiplier),
        protein: (selectedItem.protein * multiplier).toFixed(1),
        carbs: (selectedItem.carbs * multiplier).toFixed(1),
        fat: (selectedItem.fat * multiplier).toFixed(1),
    } : null;

    if (!isOpen) {
        if (isFuture) return null;

        return (
            <Button
                variant="outline"
                className={`w-full py-8 text-lg rounded-2xl border-dashed border-2 ${isFuture ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isFuture && setIsOpen(true)}
                disabled={isFuture}
            >
                <Plus size={20} className="mr-2" />
                {isFuture ? 'Cannot log future' : 'Log Food'}
            </Button>
        );
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Food">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-muted-foreground">Select Food</label>
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
                                    + Create New Food
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAiModalOpen(true)}
                                    className="text-xs bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-2 py-1 rounded-full flex items-center gap-1 hover:opacity-90 transition-opacity"
                                >
                                    <Sparkles size={12} />
                                    AI Assist
                                </button>
                            </div>
                        </div>
                        <select
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                            value={selectedItemId}
                            onChange={(e) => {
                                setSelectedItemId(e.target.value);
                                setInputValue(''); // Reset input on change
                                // Unit follows the item definition strictly now
                                const item = foodItems.find(i => i.id === Number(e.target.value));
                                if (item) {
                                    setInputUnit(item.serving_unit === 'serving' ? 'serving' : 'grams');
                                }
                            }}
                            required
                        >
                            <option value="">-- Choose a food --</option>
                            {foodItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name} ({item.calories} cal/{item.serving_unit === 'serving' ? 'serving' : '100g'})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Strict Mode: No Toggle. Label tells you what to enter. */}
                    <Input
                        label={inputUnit === 'grams' ? "Weight (g)" : "Quantity (Servings)"}
                        type="number"
                        required
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={inputUnit === 'grams' ? "e.g. 150" : "e.g. 1.5"}
                    />

                    {calculatedMacros && (
                        <div className="bg-secondary/30 p-4 rounded-xl space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Calculator size={16} />
                                <span>Calculated Macros</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div>
                                    <div className="text-lg font-bold">{calculatedMacros.calories}</div>
                                    <div className="text-xs text-muted-foreground">kcal</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-400">{calculatedMacros.protein}g</div>
                                    <div className="text-xs text-muted-foreground">Pro</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-amber-400">{calculatedMacros.carbs}g</div>
                                    <div className="text-xs text-muted-foreground">Carb</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-rose-400">{calculatedMacros.fat}g</div>
                                    <div className="text-xs text-muted-foreground">Fat</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                            placeholder="Add details..."
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={!selectedItemId || !inputValue}>
                        Add Entry
                    </Button>
                </form>
            </Modal>

            <FoodItemModal
                isOpen={isItemModalOpen}
                onClose={() => setIsItemModalOpen(false)}
                onSuccess={() => {
                    loadItems();
                    // Optionally auto-select the new item? Keeping it simple for now.
                }}
            />

            <ManageItemsModal
                isOpen={isManageModalOpen}
                onClose={() => {
                    setIsManageModalOpen(false);
                    loadItems(); // Refresh list after managing
                }}
                type="food"
            />

            <AIChatModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                onSuccess={() => {
                    loadItems();
                }}
            />
        </>
    );
}
