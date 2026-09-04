import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';
import { Users, Store } from 'lucide-react';

interface AdminUserGrowthChartProps {
  data: { date: string; buyers: number; sellers: number }[];
  totalBuyers?: number;
  totalSellers?: number;
}

export function AdminUserGrowthChart({ data, totalBuyers, totalSellers }: AdminUserGrowthChartProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.75)] backdrop-blur-[18px] border border-[rgba(226,232,240,0.8)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] rounded-2xl p-6 col-span-full lg:col-span-2 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[#111827]">User Growth</h3>
          <p className="text-sm text-[#64748B] mt-1">New buyers and sellers acquired over time</p>
        </div>
      </div>

      {(totalBuyers !== undefined && totalSellers !== undefined) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Buyers Mini Stat */}
          <div className="bg-white/60 border border-blue-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Buyers</p>
              <h4 className="text-2xl font-bold text-[#111827]">{totalBuyers}</h4>
            </div>
          </div>
          
          {/* Sellers Mini Stat */}
          <div className="bg-white/60 border border-purple-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <Store className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">Total Sellers</p>
              <h4 className="text-2xl font-bold text-[#111827]">{totalSellers}</h4>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-[350px] w-full [&_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }} style={{ outline: 'none' }} className="focus:outline-none">
            <defs>
              <linearGradient id="colorBuyers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorSellers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickFormatter={(value) => `${value}`}
              width={40}
            />
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#0F172A', fontWeight: 500 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Area
              type="monotone"
              dataKey="buyers"
              name="Buyers"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBuyers)"
              dot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
            />
            <Area
              type="monotone"
              dataKey="sellers"
              name="Sellers"
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSellers)"
              dot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#8b5cf6' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
