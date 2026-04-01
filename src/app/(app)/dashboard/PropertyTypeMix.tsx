/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useTypePropertyTypeMixQuery } from '@/redux/features/dashboard/dashboard.api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#0891b2', '#10b981', '#3b82f6', '#f59e0b', "#14B8A6", "#EF4444"];
const LABEL_COLORS = ['#3B82F6', '#10B981', '#007595', '#009966', '#155DFC', '#E17100'];

const renderCustomLabel = (props: any) => {
  const { name, value, index = 0, cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0 } = props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text 
      x={x} 
      y={y} 
      fill={"#000000"} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="14"
      fontWeight="600"
    >
      {`${name} ${value}%`}
    </text>
  );
};

const PropertyTypeMix = () => {
  const { data: propertyTypeMixData } = useTypePropertyTypeMixQuery();

  const totalCount = (propertyTypeMixData ?? []).reduce((sum, item) => sum + item.count, 0);

  const data = (propertyTypeMixData ?? []).map((item) => ({
    name: item.property_type,
    value: totalCount > 0 ? Number(((item.count / totalCount) * 100).toFixed(1)) : 0,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      <h3 className="text-lg font-semibold text-title mb-4">Property Type Mix</h3>
      <div className="w-full h-80 flex items-center justify-center select-none **:outline-none **:focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer={false}>
            <Pie
              data={data}
              cx="50%"
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
