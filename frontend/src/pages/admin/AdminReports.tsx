import { useState } from 'react';
import {
  Download,
  Search,
  Table as TableIcon
} from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
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

  // Destructure store data for mock reporting
  const {
    users,
    sellers,
    buyers,
    listings,
    enquiries,
    conversations,
    notifications,
    reviews,
    stats,
  } = useAdminStore();

  const getReportData = () => {
    let data: any[] = [];

    switch (reportType) {
      case 'users':
        data = users.map(u => ({
          ID: u.id,
          Name: u.name,
          Email: u.email,
          Role: u.role,
          Status: u.status,
          CreatedAt: format(new Date(u.createdAt), 'PP'),
          LastLogin: u.lastLoginAt ? format(new Date(u.lastLoginAt), 'PP') : 'N/A'
        }));
        break;
      case 'sellers':
        data = sellers.map(s => ({
          ID: s.id,
          CompanyName: s.companyName,
          Email: s.email,
          Status: s.status,
          Type: s.sellerType,
          Listings: s.listingCount,
          Revenue: s.totalRevenue,
          CreatedAt: format(new Date(s.createdAt), 'PP')
        }));
        break;
      case 'buyers':
        data = buyers.map(b => ({
          ID: b.id,
          Name: b.name,
          Email: b.email,
          Status: b.status,
          Verification: b.verificationStatus,
          Enquiries: b.totalEnquiries,
          CreatedAt: format(new Date(b.createdAt), 'PP')
        }));
        break;
      case 'listings':
        data = listings.map(l => ({
          ID: l.id,
          Title: l.title,
          Category: l.category,
          Price: l.price,
          Status: l.status,
          Seller: l.sellerName,
          Views: l.views,
          CreatedAt: format(new Date(l.createdAt), 'PP')
        }));
        break;
      case 'enquiries':
        data = enquiries.map(e => ({
          ID: e.id,
          Listing: e.listingTitle,
          Value: e.listingValue,
          Buyer: e.buyerName,
          Seller: e.sellerName,
          Status: e.status,
          CreatedAt: format(new Date(e.createdAt), 'PP')
        }));
        break;
      case 'messages':
        data = conversations.map(c => ({
          ID: c.id,
          Listing: c.listingTitle,
          Buyer: c.buyerName,
          Seller: c.sellerName,
          Status: c.status,
          MessageCount: c.messages.length,
          CreatedAt: format(new Date(c.createdAt), 'PP')
        }));
        break;
      case 'notifications':
        data = notifications.map(n => ({
          ID: n.id,
          Title: n.title,
          Type: n.type,
          IsRead: n.isRead ? 'Yes' : 'No',
          CreatedAt: format(new Date(n.createdAt), 'PP')
        }));
        break;
      case 'reviews':
        data = reviews.map(r => ({
          ID: r.id,
          Target: r.targetName,
          Type: r.targetType,
          Reviewer: r.reviewerName,
          Rating: r.rating,
          Status: r.status,
          CreatedAt: format(new Date(r.createdAt), 'PP')
        }));
        break;
      case 'platform':
        data = [
          { Metric: 'Total Users', Value: stats.totalUsers },
          { Metric: 'Total Buyers', Value: stats.totalBuyers },
          { Metric: 'Total Sellers', Value: stats.totalSellers },
          { Metric: 'Total Listings', Value: stats.totalListings },
          { Metric: 'Total Enquiries', Value: stats.totalEnquiries },
          { Metric: 'Total Revenue', Value: `$${stats.totalRevenue.toLocaleString()}` }
        ];
        break;
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(item =>
        Object.values(item).some(val => String(val).toLowerCase().includes(lowerSearch))
      );
    }

    return data;
  };

  const reportData = getReportData();

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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Reports & Data Export
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate and export platform data and analytics
          </p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
                <Download className="w-4 h-4" />
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
              <CardDescription>Select report type and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={(val: AdminReportType) => setReportType(val)}>
                  <SelectTrigger>
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="capitalize">{reportType} Report Preview</CardTitle>
                <CardDescription>
                  Showing {reportData.length} records
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search in report..."
                    className="pl-9 bg-background/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {reportData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                      <tr>
                        {Object.keys(reportData[0]).map(header => (
                          <th key={header} className="px-6 py-4 font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {reportData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          {Object.values(row).map((val: any, colIdx) => (
                            <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reportData.length > 10 && (
                    <div className="p-4 text-center text-sm text-muted-foreground border-t bg-muted/10">
                      Showing 10 of {reportData.length} records. Export to view all.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                  <TableIcon className="w-12 h-12 mb-4 text-muted" />
                  <p className="text-lg font-medium text-foreground">No data available</p>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
