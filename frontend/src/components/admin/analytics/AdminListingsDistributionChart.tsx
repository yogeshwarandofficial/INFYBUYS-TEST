import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface AdminListingsDistributionChartProps {
  data: { name: string; value: number; color: string }[];
}

const COLORS: Record<string, string> = {
  'Active': '#10b981', // emerald-500
  'Pending': '#f59e0b', // amber-500
  'Sold': '#3b82f6', // blue-500
  'Archived': '#64748b', // slate-500
};

export function AdminListingsDistributionChart({ data }: AdminListingsDistributionChartProps) {
  return (
    <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#111827]">Listings by Category</h3>
        <p className="text-sm text-[#64748B]">Distribution of active listings across categories</p>
      </div>
      <div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#000' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
