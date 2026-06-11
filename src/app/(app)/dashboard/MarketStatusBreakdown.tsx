'use client';
import { useMarketStatusQuery } from '@/redux/features/dashboard/dashboard.api';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

const MarketStatusBreakdown = () => {
  const { data: marketStatusData, isLoading } = useMarketStatusQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="w-full h-80 flex flex-col items-center justify-center gap-6">
          <Skeleton className="h-48 w-48 rounded-full" />
          <div className="flex gap-4 w-full justify-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    );
  }

  const data = (marketStatusData ?? []).map((item) => ({
    name: item.percentage !== undefined ? `${item.market_status} (${item.percentage}%)` : item.market_status,
    value: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      <h3 className="text-lg font-semibold text-title mb-4">Market Status Breakdown</h3>
      <div className="w-full h-80 flex items-center justify-center select-none **:outline-none **:focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer={false}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            />
            <Legend 
              layout="horizontal" 
              align="center" 
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MarketStatusBreakdown;
