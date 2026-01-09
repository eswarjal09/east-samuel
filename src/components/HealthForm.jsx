import { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import { Plus } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';

export default function HealthForm() {
    const { addMetric } = useHealth();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        type: 'weight',
        value: '',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const unit = formData.type === 'weight' ? 'lbs' : formData.type === 'bodyFat' ? '%' : 'hrs';
        addMetric(formData.type, formData.value, unit, formData.notes);
        setFormData(prev => ({ ...prev, value: '', notes: '' }));
        setIsOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                className="w-full py-8 text-lg rounded-2xl border-dashed border-2"
                onClick={() => setIsOpen(true)}
            >
                <Plus size={20} className="mr-2" />
                Log Health Metric
            </Button>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Log Metric">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Metric Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="weight">Body Weight (lbs)</option>
                        <option value="bodyFat">Body Fat %</option>
                        <option value="sleep">Sleep Duration</option>
                    </select>
                </div>

                <Input
                    label="Value"
                    type="number"
                    name="value"
                    step="0.1"
                    required
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="0.0"
                />

                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes (Optional)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                        placeholder="How are you feeling?"
                    />
                </div>

                <Button type="submit" className="w-full">
                    Log Entry
                </Button>
            </form>
        </Modal>
    );
}
