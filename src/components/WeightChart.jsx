import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useHealth } from '../context/HealthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export default function WeightChart({ className }) {
    const { getMetricHistory } = useHealth();

    // Process data: existing history sorted by date
    const weightHistory = useMemo(() => {
        const history = getMetricHistory('weight');
        if (!history || history.length === 0) return [];
        return history;
    }, [getMetricHistory]);

    // Generate chart data with forward fill
    const chartData = useMemo(() => {
        if (weightHistory.length === 0) return [];

        const sortedHistory = [...weightHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

        const startDate = new Date(sortedHistory[0].date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Map for fast lookup
        const historyMap = new Map();
        sortedHistory.forEach(h => historyMap.set(h.date, h.value));

        let lastKnownWeight = sortedHistory[0].value;
        const result = [];

        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (historyMap.has(dateStr)) {
                lastKnownWeight = historyMap.get(dateStr);
            }
            result.push({
                date: dateStr,
                weight: lastKnownWeight,
                formattedDate: new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            });
        }
        return result;
    }, [weightHistory]);

    if (weightHistory.length === 0) {
        return (
            <Card className={`col-span-1 md:col-span-2 ${className}`}>
                <CardHeader>
                    <CardTitle>Weight Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No weight data recorded yet.
                    </div>
                </CardContent>
            </Card>
        );
    }

    const latestWeight = chartData[chartData.length - 1]?.weight;
    const latestUnit = weightHistory[weightHistory.length - 1]?.unit || 'lbs'; // Fallback unit

    // Calculate domain for Y axis to make chart look dynamic
    const minWeight = Math.min(...chartData.map(d => d.weight));
    const maxWeight = Math.max(...chartData.map(d => d.weight));
    const padding = (maxWeight - minWeight) * 0.1 || 5; // 10% padding or 5 units

    return (
        <Card className={`w-full h-full ${className}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">Weight Trend</CardTitle>
                <div className="text-2xl font-bold">
                    {latestWeight} <span className="text-sm font-normal text-muted-foreground">{latestUnit}</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="formattedDate"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                minTickGap={30}
                            />
                            <YAxis
                                domain={[minWeight - padding, maxWeight + padding]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                tickFormatter={(value) => value.toFixed(0)}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                labelStyle={{ color: 'var(--foreground)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                                strokeWidth={2}
                                isAnimationActive={true}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
