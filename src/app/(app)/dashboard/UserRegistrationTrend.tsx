'use client';
import { useUserRegistrationTrendQuery } from '@/redux/features/dashboard/dashboard.api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatDay = (day: string) => {
  const date = new Date(day);
  if (Number.isNaN(date.getTime())) {
    return day;
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const UserRegistrationTrend = () => {
  const { data } = useUserRegistrationTrendQuery();

  const chartData = (data ?? []).map((item) => ({
    day: formatDay(item.day),
    value: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-title">User Registration Trend</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-teal-500" style={{backgroundColor: '#14B8A6'}}></div>
          <span className="text-sm text-gray-500">Daily Signups</span>
        </div>
      </div>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#9ca3af" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#9ca3af" 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
              cursor={{ stroke: '#e5e7eb' }}
            />
            <Area 
              type="natural" 
              dataKey="value" 
              stroke="#14B8A6" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserRegistrationTrend;
