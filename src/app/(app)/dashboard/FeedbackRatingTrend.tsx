'use client';
import { useFeedbackRatingTrendQuery } from '@/redux/features/dashboard/dashboard.api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const FeedbackRatingTrend = () => {
  const { data: feedbackRatingTrendData } = useFeedbackRatingTrendQuery();

  const data = (feedbackRatingTrendData ?? []).map((item) => ({
    month: item.month,
    value: item.count,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-title mb-4">Feedback Rating Trend</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              cursor={{ stroke: '#e5e7eb' }}
            />
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
