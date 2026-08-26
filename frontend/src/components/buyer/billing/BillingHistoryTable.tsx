import { Download, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BillingRecord } from '@/store/useBuyerStore';

interface BillingHistoryTableProps {
  records: BillingRecord[];
}

export function BillingHistoryTable({ records }: BillingHistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card/50">
        <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium">No billing history</h3>
        <p className="text-muted-foreground mt-1">You haven't been billed yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm text-left whitespace-nowrap">
        <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4 font-medium border-b">Invoice</th>
            <th className="px-6 py-4 font-medium border-b">Date</th>
            <th className="px-6 py-4 font-medium border-b">Description</th>
            <th className="px-6 py-4 font-medium border-b">Amount</th>
            <th className="px-6 py-4 font-medium border-b">Status</th>
            <th className="px-6 py-4 font-medium border-b text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium">
                {record.invoiceNumber}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                {record.description}
              </td>
              <td className="px-6 py-4 font-medium">
                ${record.amount.toFixed(2)} {record.currency}
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant={record.status === 'paid' ? 'secondary' : 'outline'}
                  className={
                    record.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 hover:bg-green-100/80 border-0' :
                    record.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 hover:bg-red-100/80 border-0' :
                    ''
                  }
                >
                  {record.status}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild title="View Invoice">
                    <Link to={`/buyer/billing/invoice/${record.id}`}>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Mock Download Invoice"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock Invoice Document\nGenerated for testing.');
                      link.download = `${record.invoiceNumber}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
