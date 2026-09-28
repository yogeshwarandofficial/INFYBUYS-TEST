import { useState, useEffect } from 'react';
import {
  Download,
  Search,
  Table as TableIcon
} from 'lucide-react';
import { apiClient } from '@/services/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

type AdminReportType =
  | 'users'
  | 'sellers'
  | 'buyers'
  | 'listings'
  | 'enquiries'
  | 'messages'
  | 'notifications'
  | 'reviews'
  | 'platform';

export default function AdminReports() {
  const [reportType, setReportType] = useState<AdminReportType>('users');
  const [dateRange, setDateRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [rawReportData, setRawReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get<any[]>(`/admin/reports?type=${reportType}&range=${dateRange}`);
        setRawReportData(data);
      } catch (err) {
        console.error('Failed to fetch report data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType, dateRange]);

  const getFilteredReportData = () => {
    let data = [...rawReportData];
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(lowerSearch))
      );
    }
    return data;
  };

  const reportData = getFilteredReportData();

  const handleExport = (formatType: 'csv' | 'json') => {
    if (reportData.length === 0) return;

    let content = '';
    let type = '';
    let extension = '';

    if (formatType === 'csv') {
      const headers = Object.keys(reportData[0]);
      const csvRows = [
        headers.join(','),
        ...reportData.map(row =>
          headers.map(header => {
            const val = row[header];
            const stringVal = String(val).replace(/"/g, '""');
            return stringVal.includes(',') ? `"${stringVal}"` : stringVal;
          }).join(',')
        )
      ];
      content = csvRows.join('\n');
      type = 'text/csv;charset=utf-8;';
      extension = 'csv';
    } else {
      content = JSON.stringify(reportData, null, 2);
      type = 'application/json;charset=utf-8;';
      extension = 'json';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `infybuys_${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
            Reports & Data Export
          </h1>
          <p className="text-[15px] text-[#64748B] mt-1">
            Generate and export platform data and analytics
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white/50 p-3 rounded-2xl border border-[#E5E9F2] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Select value={reportType} onValueChange={(val: AdminReportType) => setReportType(val)}>
                <SelectTrigger className="w-full sm:w-[180px] h-9 text-xs bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform Overview</SelectItem>
                  <SelectItem value="users">All Users</SelectItem>
                  <SelectItem value="sellers">Sellers & Businesses</SelectItem>
                  <SelectItem value="buyers">Buyers & Investors</SelectItem>
                  <SelectItem value="listings">Listings & Assets</SelectItem>
                  <SelectItem value="enquiries">Enquiries & Deals</SelectItem>
                  <SelectItem value="messages">Messages & Conversations</SelectItem>
                  <SelectItem value="reviews">Reviews & Ratings</SelectItem>
                  <SelectItem value="notifications">System Notifications</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs bg-white">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last 12 Months</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                placeholder="Search in report..."
                className="pl-9 h-9 text-xs bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-9 gap-2 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all w-full lg:w-auto">
                  <Download className="w-3.5 h-3.5" />
                  Export Data
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full rounded-2xl border border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm">
            <div className="flex flex-row items-center justify-between border-b border-[#E5E9F2] px-6 py-4">
              <div>
                <h3 className="font-semibold text-[16px] text-[#111827] capitalize">{reportType} Report Preview</h3>
                <p className="text-[13px] text-[#64748B] mt-0.5">Showing {reportData.length} records</p>
              </div>
            </div>
            <div className="p-0 overflow-auto">
              {reportData.length > 0 ? (
                <table className="w-full text-sm text-left table-fixed">
                  <thead className="text-[12px] font-semibold text-[#64748B] uppercase bg-[#F8FAFC] border-b border-[#E5E9F2]">
                    <tr>
                      {Object.keys(reportData[0]).map(header => {
                        const lower = header.toLowerCase();
                        let widthClass = '';
                        if (lower === 'id' || lower.includes('id')) widthClass = 'w-[120px]';
                        else if (lower === 'email') widthClass = 'w-[200px]';
                        else if (lower === 'name' || lower === 'title') widthClass = 'w-[180px]';
                        else if (lower === 'role' || lower === 'status') widthClass = 'w-[100px]';
                        else if (lower.includes('date') || lower.includes('time') || lower === 'createdat') widthClass = 'w-[150px]';
                        
                        return (
                          <th key={header} className={`px-4 py-3 font-medium whitespace-nowrap ${widthClass}`}>
                            {header}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E9F2]">
                    {reportData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F8FAFC]/50 transition-colors h-[64px]">
                        {Object.values(row).map((val: any, colIdx) => (
                          <td key={colIdx} className="px-4 py-2 align-middle max-w-0">
                            <div className="truncate text-[13px] text-gray-700" title={String(val)}>
                              {val}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-[#64748B]">
                  <TableIcon className="w-10 h-10 mb-4 text-[#CBD5E1]" />
                  <p className="text-[15px] font-medium text-[#111827]">No data available</p>
                  <p className="text-[13px] mt-1">Try adjusting your search or filter criteria.</p>
                </div>
              )}
              {reportData.length > 10 && (
                <div className="px-6 py-4 text-center text-[13px] text-[#64748B] border-t border-[#E5E9F2] bg-[#F8FAFC]/50">
                  Showing 10 of {reportData.length} records. Export to view all.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
