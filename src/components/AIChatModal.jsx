import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Check, Loader2 } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { api } from '../api/client';

export default function AIChatModal({ isOpen, onClose, onSuccess }) {
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hi! Describe your food, and I'll help you log it." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [proposal, setProposal] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);
        setProposal(null); // Clear previous proposal if any

        try {
            // Convert history to format expected by backend
            const history = messages
                .filter(m => m.text) // skip empty
                .map(m => ({
                    role: m.role,
                    parts: [m.text]
                }));

            const data = await api.chatWithAI(userMsg, history);

            setMessages(prev => [...prev, { role: 'model', text: data.response }]);

            if (data.structured_food) {
                setProposal(data.structured_food);
            }

        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error connecting to the brain." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptProposal = async () => {
        if (!proposal) return;
        try {
            await api.createFoodItem(proposal);
            onSuccess(); // Refresh parent list
            onClose();
            // Reset chat
            setMessages([{ role: 'model', text: "Hi! Describe your food, and I'll help you log it." }]);
            setProposal(null);
        } catch (err) {
            console.error("Failed to save proposal:", err);
            // Optionally show error in chat
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="AI Nutrition Assistant">
            <div className="flex flex-col h-[60vh] md:h-[500px]">

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto space-y-4 p-2">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Bot size={16} className="text-primary" />
                                </div>
                            )}
                            <div className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground'
                                }`}>
                                {msg.text}
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-primary" />
                            </div>
                            <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-2 flex items-center">
                                <Loader2 size={16} className="animate-spin mr-2" /> Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Proposal Card (if active) */}
                {proposal && (
                    <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{proposal.name}</h3>
                                <p className="text-xs text-muted-foreground">Per 100g (Estimated)</p>
                            </div>
                            <Button size="sm" onClick={handleAcceptProposal}>
                                <Check size={16} className="mr-1" />
                                Save to Database
                            </Button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                            <div className="bg-background/50 p-2 rounded-lg">
                                <div className="font-bold">{proposal.calories}</div>
                                <div className="text-[10px] opacity-70">kcal</div>
                            </div>
                            <div className="bg-background/50 p-2 rounded-lg">
                                <div className="font-bold text-blue-400">{proposal.protein}g</div>
                                <div className="text-[10px] opacity-70">Pro</div>
                            </div>
                            <div className="bg-background/50 p-2 rounded-lg">
                                <div className="font-bold text-amber-400">{proposal.carbs}g</div>
                                <div className="text-[10px] opacity-70">Carb</div>
                            </div>
                            <div className="bg-background/50 p-2 rounded-lg">
                                <div className="font-bold text-rose-400">{proposal.fat}g</div>
                                <div className="text-[10px] opacity-70">Fat</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <form onSubmit={handleSend} className="mt-4 pt-4 border-t border-border flex gap-2">
                    <input
                        className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="e.g., '1 cup of cooked white rice'..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-xl px-4">
                        <Send size={20} />
                    </Button>
                </form>
            </div>
        </Modal>
    );
}
