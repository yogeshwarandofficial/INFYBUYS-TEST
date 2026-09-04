import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface AdminListingsDistributionChartProps {
  data: { name: string; value: number; color: string }[];
  totalListings?: number;
}

export function AdminListingsDistributionChart({ data, totalListings }: AdminListingsDistributionChartProps) {
  const total = totalListings ?? data.reduce((acc, curr) => acc + curr.value, 0);

  // If there's no data at all, provide a dummy segment so the donut still draws a gray circle
  const displayData = data.length > 0 ? data : [{ name: 'No Data', value: 1, color: '#e2e8f0' }];

  return (
    <div className="bg-[rgba(255,255,255,0.75)] backdrop-blur-[18px] border border-[rgba(226,232,240,0.8)] shadow-[0_8px_30px_rgba(15,23,42,0.06)] rounded-2xl p-6 flex flex-col h-full [&_*]:outline-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#111827]">Listings by Category</h3>
        <p className="text-sm text-[#64748B] mt-1">Distribution of active listings across categories</p>
      </div>

      <div className="flex-1 flex flex-row flex-wrap items-center justify-center gap-6 sm:gap-8 w-full my-auto py-4 px-2">
        
        {/* Chart Container */}
        <div className="w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }} style={{ outline: 'none' }} className="focus:outline-none">
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={data.length > 1 ? 4 : 0}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
                labelLine={false}
                style={{ outline: 'none' }}
                className="focus:outline-none"
                label={(props: any) => {
                  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
                  if (data.length === 0) return null;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                  if (percent < 0.05) return null;
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600} style={{ pointerEvents: 'none' }}>
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {displayData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ outline: 'none' }}
                    className="focus:outline-none"
                  />
                ))}
              </Pie>
              {data.length > 0 && (
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered Total Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-[#111827]">{total}</span>
            <span className="text-[10px] font-medium text-[#64748B] uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Custom HTML Legend Container */}
        {data.length > 0 && (
          <div className="w-full sm:w-auto flex-shrink-0 max-w-[200px]">
            <ul className="flex flex-col gap-2.5">
              {data.map((entry, index) => {
                const count = entry.value;
                const percent = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
                return (
                  <li key={`legend-item-${index}`} className="flex items-center text-sm">
                    <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-[#64748B] flex-1 truncate pr-2" title={entry.name}>{entry.name}</span>
                    <span className="font-semibold text-[#111827] min-w-[20px] text-right">{count}</span>
                    <span className="text-[#94A3B8] min-w-[40px] text-right text-xs font-medium">{percent}%</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
