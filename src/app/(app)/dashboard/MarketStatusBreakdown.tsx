'use client';
import { useMarketStatusQuery } from '@/redux/features/dashboard/dashboard.api';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

const MarketStatusBreakdown = () => {
  const { data: marketStatusData } = useMarketStatusQuery();

  const data = (marketStatusData ?? []).map((item) => ({
    name: item.market_status,
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
