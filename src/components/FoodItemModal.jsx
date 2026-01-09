import { useState, useEffect } from 'react';
import { api } from '../api/client';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function FoodItemModal({ isOpen, onClose, onSuccess, mode = 'create', initialData = null }) {
    const [formData, setFormData] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        serving_unit: 'grams',
        serving_weight: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && mode === 'edit' && initialData) {
            setFormData({
                name: initialData.name,
                calories: initialData.calories,
                protein: initialData.protein,
                carbs: initialData.carbs,
                fat: initialData.fat,
                serving_unit: initialData.serving_unit || 'grams',
                serving_weight: initialData.serving_weight || '',
            });
        } else if (isOpen && mode === 'create') {
            setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '', serving_unit: 'grams', serving_weight: '' });
        }
    }, [isOpen, mode, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = {
                ...formData,
                calories: Number(formData.calories),
                protein: Number(formData.protein),
                carbs: Number(formData.carbs),
                fat: Number(formData.fat),
                serving_weight: formData.serving_weight ? Number(formData.serving_weight) : null,
            };

            if (mode === 'edit') {
                await api.updateFoodItem(initialData.id, payload);
            } else {
                await api.createFoodItem(payload);
            }

            if (mode === 'create') {
                setFormData({ name: '', calories: '', protein: '', carbs: '', fat: '', serving_unit: 'grams' });
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || `Failed to ${mode} item`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? "Edit Food Item" : "Create New Food Item"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="bg-secondary/30 p-3 rounded-lg border border-white/10 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground block">Unit Type</label>
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${formData.serving_unit === 'grams' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setFormData(p => ({ ...p, serving_unit: 'grams' }))}
                        >
                            Per 100g
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm rounded-md transition-all ${formData.serving_unit === 'serving' ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setFormData(p => ({ ...p, serving_unit: 'serving' }))}
                        >
                            Per 1 Serving
                        </button>
                    </div>
                </div>

                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20 text-sm text-blue-200 mb-4">
                    {formData.serving_unit === 'grams'
                        ? 'Enter values per 100g. Standard for raw ingredients.'
                        : 'Enter values for exactly 1 full portion/serving.'}
                </div>

                <Input
                    label="Food Name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., White Rice (Cooked)"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label={formData.serving_unit === 'grams' ? "Calories (per 100g)" : "Calories (per Serving)"}
                        type="number"
                        name="calories"
                        required
                        value={formData.calories}
                        onChange={handleChange}
                        placeholder="kcal"
                    />
                    <Input
                        label="Protein (g)"
                        type="number"
                        name="protein"
                        required
                        value={formData.protein}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    <Input
                        label="Carbs (g)"
                        type="number"
                        name="carbs"
                        required
                        value={formData.carbs}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    <Input
                        label="Fat (g)"
                        type="number"
                        name="fat"
                        required
                        value={formData.fat}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Item' : 'Create Item')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
