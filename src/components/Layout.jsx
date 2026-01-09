import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Utensils, Dumbbell, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import DateNavigator from './DateNavigator';

export default function Layout({ children }) {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/' },
        { icon: Utensils, label: 'Food', path: '/food' },
        { icon: Dumbbell, label: 'Exercise', path: '/exercise' },
        { icon: Activity, label: 'Health', path: '/health' },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            {/* Mobile Top Navigation */}
            <div className="md:hidden sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold">P</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Personal Health</h1>
                    </div>
                    <DateNavigator />
                </div>

                {/* Mobile Nav Tabs */}
                <nav className="flex justify-around px-2 pb-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-all flex-1",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                )}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-border p-6 gap-8 sticky top-0 h-screen">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold">P</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        Personal Health
                    </h1>
                </div>
                <DateNavigator />
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                        : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
