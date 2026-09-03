import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AdminEngagementChartProps {
  data: { date: string; enquiries: number; messages: number }[];
}

export function AdminEngagementChart({ data }: AdminEngagementChartProps) {
  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-6 col-span-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Platform Engagement</h3>
        <p className="text-sm text-[#64748B]">Enquiries and conversations over time</p>
      </div>
      <div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'currentColor' }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#000' }}
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
              />
              <Bar
                dataKey="enquiries"
                name="Enquiries"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="messages"
                name="Messages"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
