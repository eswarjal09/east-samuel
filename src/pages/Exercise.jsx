import ExerciseForm from '../components/ExerciseForm';
import ExerciseList from '../components/ExerciseList';

export default function Exercise() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Exercise Log</h2>
                <p className="text-muted-foreground">Track your strength progress.</p>
            </div>

            <ExerciseForm />

            <div className="border-t border-border my-6" />

            <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4">History</h3>
                <ExerciseList />
            </div>
        </div>
    );
}
