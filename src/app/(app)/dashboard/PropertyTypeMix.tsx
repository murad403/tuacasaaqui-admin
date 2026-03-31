/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Apartment', value: 45 },
  { name: 'House', value: 30 },
  { name: 'Studio', value: 15 },
  { name: 'Villa', value: 10 },
];

const COLORS = ['#0891b2', '#10b981', '#3b82f6', '#f59e0b'];

const renderCustomLabel = (props: any) => {
  const { name, value, cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0 } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="600"
    >
      {`${name} ${value}%`}
    </text>
  );
};

const PropertyTypeMix = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-title mb-4">Property Type Mix</h3>
      <div className="w-full h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="40%"
              cy="50%"
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PropertyTypeMix;
