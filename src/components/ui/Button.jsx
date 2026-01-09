import { cn } from '../../lib/utils';

export default function Button({
    className,
    variant = 'primary',
    size = 'default',
    children,
    ...props
}) {
    const variants = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-secondary/50 text-muted-foreground hover:text-foreground",
        destructive: "text-destructive hover:bg-destructive/10",
        outline: "border-2 border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5"
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8",
        icon: "h-10 w-10 p-2 flex items-center justify-center"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
