import { useState, useEffect } from 'react';
import { api } from '../api/client';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

export default function ExerciseItemModal({ isOpen, onClose, onSuccess, mode = 'create', initialData = null }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && mode === 'edit' && initialData) {
            setName(initialData.name);
        } else if (isOpen && mode === 'create') {
            setName('');
        }
    }, [isOpen, mode, initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (mode === 'edit') {
                await api.updateExerciseItem(initialData.id, { name });
            } else {
                await api.createExerciseItem({ name });
            }

            if (mode === 'create') {
                setName('');
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message || `Failed to ${mode} item`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={mode === 'edit' ? "Edit Exercise" : "Create New Exercise"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Input
                    label="Exercise Name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Bench Press"
                />

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
