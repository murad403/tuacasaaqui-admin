'use client';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
  { name: 'Stable', value: 45 },
  { name: 'Rising', value: 35 },
  { name: 'Declining', value: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

const MarketStatusBreakdown = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-title mb-8">Market Status Breakdown</h3>
      <div className="w-full h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
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
