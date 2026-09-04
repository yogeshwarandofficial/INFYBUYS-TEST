import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { HelpCircle, MessageSquare } from 'lucide-react';

interface AdminEngagementChartProps {
  data: { date: string; enquiries: number; messages: number }[];
  totalEnquiries?: number;
  totalConversations?: number;
}

export function AdminEngagementChart({ data, totalEnquiries, totalConversations }: AdminEngagementChartProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.75)] backdrop-blur-[18px] border border-[rgba(226,232,240,0.8)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] rounded-2xl p-6 col-span-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#111827]">Platform Engagement</h3>
          <p className="text-sm text-[#64748B] mt-1">Enquiries and conversations over time</p>
        </div>
      </div>

      {(totalEnquiries !== undefined && totalConversations !== undefined) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Enquiries Mini Stat */}
          <div className="bg-white/60 border border-blue-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Enquiries</p>
              <h4 className="text-2xl font-bold text-[#111827]">{totalEnquiries}</h4>
            </div>
          </div>
          
          {/* Conversations Mini Stat */}
          <div className="bg-white/60 border border-purple-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Conversations</p>
              <h4 className="text-2xl font-bold text-[#111827]">{totalConversations}</h4>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-[350px] w-full [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
          <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} style={{ outline: 'none' }} className="focus:outline-none">
            <defs>
              <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value}`}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value}`}
              width={40}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0F172A', fontWeight: 500 }}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              yAxisId="left"
              dataKey="enquiries"
              name="Enquiries"
              fill="url(#colorEnquiries)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
              minPointSize={6}
              style={{ filter: 'drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.3))', outline: 'none' }}
              className="focus:outline-none"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="messages"
              name="Conversations"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 7, strokeWidth: 0, fill: '#8b5cf6', style: { outline: 'none' } }}
              style={{ outline: 'none' }}
              className="focus:outline-none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
