'use client';
import { useFeedbackRatingTrendQuery } from '@/redux/features/dashboard/dashboard.api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

const formatMonth = (monthStr: string) => {
  const parts = monthStr.split('-');
  if (parts.length < 2) return monthStr;
  const year = parts[0].substring(2); // '2026' -> '26'
  const monthIdx = parseInt(parts[1], 10) - 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${months[monthIdx]} ${year}`;
  }
  return monthStr;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      month: string;
      value: number;
      count: number;
    };
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-4 justify-between">
            <span className="text-gray-500">Average Rating:</span>
            <span className="font-semibold text-amber-500">{(data.value ?? 0).toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <span className="text-gray-500">Total Feedbacks:</span>
            <span className="font-semibold text-gray-900">{data.count}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const FeedbackRatingTrend = () => {
  const { data: feedbackRatingTrendData, isLoading } = useFeedbackRatingTrendQuery();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 h-full">
        <Skeleton className="h-7 w-48 mb-3 sm:mb-4" />
        <Skeleton className="w-full h-72 sm:h-80" />
      </div>
    );
  }

  const data = (feedbackRatingTrendData ?? []).map((item) => ({
    month: formatMonth(item.month),
    value: item.avg_rating,
    count: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 h-full">
      <h3 className="text-lg font-semibold text-title mb-3 sm:mb-4">Feedback Rating Trend</h3>
      <div className="w-full h-72 sm:h-80 select-none **:outline-none **:focus:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart accessibilityLayer={false} data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="month" stroke="#9ca3af" tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" domain={[0, 5]} ticks={[0, 2, 4, 5]} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FeedbackRatingTrend;
