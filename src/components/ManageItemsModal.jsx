import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Pencil, Trash2, Search } from 'lucide-react';
import FoodItemModal from './FoodItemModal';
import ExerciseItemModal from './ExerciseItemModal';

export default function ManageItemsModal({ isOpen, onClose, type = 'food' }) {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [itemToEdit, setItemToEdit] = useState(null);

    const loadItems = useCallback(async () => {
        try {
            const data = type === 'food'
                ? await api.getFoodItems()
                : await api.getExerciseItems();
            setItems(data);
        } catch (error) {
            console.error("Failed to load items:", error);
        }
    }, [type]);

    // Load items when modal opens
    useEffect(() => {
        if (isOpen) {
            loadItems();
        }
    }, [isOpen, loadItems]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            if (type === 'food') {
                await api.deleteFoodItem(id);
            } else {
                await api.deleteExerciseItem(id);
            }
            // Optimistic update
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            console.error("Failed to delete item:", error);
            alert("Failed to delete item");
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditSuccess = () => {
        setItemToEdit(null);
        loadItems();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Manage ${type === 'food' ? 'Food' : 'Exercise'} Items`}
        >
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {filteredItems.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No items found.</p>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                                <div>
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {type === 'food'
                                            ? `${item.calories} kcal / 100g`
                                            : ''}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => setItemToEdit(item)}
                                    >
                                        <Pencil size={16} className="text-blue-400" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 hover:bg-destructive/20"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 size={16} className="text-red-400" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>

            {/* Edit Modals */}
            {type === 'food' && (
                <FoodItemModal
                    isOpen={!!itemToEdit}
                    onClose={() => setItemToEdit(null)}
                    onSuccess={handleEditSuccess}
                    mode="edit"
                    initialData={itemToEdit}
                />
            )}

            {type === 'exercise' && (
                <ExerciseItemModal
                    isOpen={!!itemToEdit}
                    onClose={() => setItemToEdit(null)}
                    onSuccess={handleEditSuccess}
                    mode="edit"
                    initialData={itemToEdit}
                />
            )}
        </Modal>
    );
}
