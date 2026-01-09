import { cn } from '../../lib/utils';

export default function Input({
    label,
    className,
    error,
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground/50",
                    error && "border-destructive focus:ring-destructive",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
