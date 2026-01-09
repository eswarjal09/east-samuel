import { cn } from '../../lib/utils';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn("bg-card border border-border rounded-xl p-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }) {
    return (
        <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({ className, children, ...props }) {
    return (
        <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props}>
            {children}
        </h3>
    );
}

export function CardContent({ className, children, ...props }) {
    return (
        <div className={cn("", className)} {...props}>
            {children}
        </div>
    );
}
