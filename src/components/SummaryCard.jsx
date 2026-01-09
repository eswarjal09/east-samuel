import { cn } from '../lib/utils';

const colorStyles = {
    orange: {
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        text: "text-orange-500",
        bar: "bg-orange-500",
    },
    blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        text: "text-blue-500",
        bar: "bg-blue-500",
    },
    yellow: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        text: "text-yellow-500",
        bar: "bg-yellow-500",
    },
    purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        text: "text-purple-500",
        bar: "bg-purple-500",
    },
};

export default function SummaryCard({ title, value, target, unit, icon: Icon, color = "orange" }) {
    const percentage = Math.min(100, Math.max(0, (value / target) * 100));
    const styles = colorStyles[color] || colorStyles.orange;

    return (
        <div className={cn(
            "bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden group transition-all duration-300 hover:shadow-md",
            styles.border
        )}>
            {/* Background Tint */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-300 pointer-events-none",
                styles.bg,
                "opacity-50 group-hover:opacity-100"
            )} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
                        <div className="flex items-baseline gap-1">
                            <h3 className="text-2xl font-bold">{value}</h3>
                            <span className="text-muted-foreground text-sm">/ {target} {unit}</span>
                        </div>
                    </div>
                    <div className={cn("p-2 rounded-xl bg-secondary/50", styles.text)}>
                        <Icon size={20} />
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500 ease-out", styles.bar)}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
