import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Download, FileText, Building2 } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBuyerStore } from '@/store/useBuyerStore';

export default function InvoiceDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { billingHistory } = useBuyerStore();

  const invoice = billingHistory.find((inv) => inv.id === id);

  useEffect(() => {
    if (!invoice) {
      navigate('/buyer/billing', { replace: true });
    }
  }, [invoice, navigate]);

  if (!invoice) return null;

  const handleMockDownload = () => {
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`Mock Invoice Document\n\nInvoice: ${invoice.invoiceNumber}\nDate: ${new Date(invoice.date).toLocaleDateString()}\nAmount: $${invoice.amount.toFixed(2)}\nStatus: ${invoice.status}\n\nGenerated for testing.`);
    link.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Seo title={`Invoice ${invoice.invoiceNumber}`} />

      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/buyer/billing">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Billing
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title="Invoice Details"
            description="View details of your past transaction."
            className="mb-0"
            breadcrumbs={[{ label: 'Billing', href: '/buyer/billing' }, { label: 'Invoice' }]}
          />
          <Button onClick={handleMockDownload} variant="outline" className="shrink-0">
            <Download className="w-4 h-4 mr-2" />
            Mock Download Invoice
          </Button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-900/50 flex items-start gap-3 text-yellow-800 dark:text-yellow-200 text-sm">
          <FileText className="w-4 h-4 shrink-0 mt-0.5" />
          <strong>Mock Invoice — For Demonstration Only</strong>
        </div>

        <Card className="overflow-hidden">
          <div className="bg-muted p-8 flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-xl font-bold mb-4">
                <Building2 className="w-6 h-6 text-primary" />
                InfyBuys
              </div>
              <div className="text-muted-foreground text-sm space-y-1">
                <p>123 Marketplace Ave</p>
                <p>Suite 100</p>
                <p>San Francisco, CA 94105</p>
                <p>contact@infybuys.mock</p>
              </div>
            </div>

            <div className="md:text-right">
              <h2 className="text-2xl font-bold text-primary mb-2">INVOICE</h2>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Invoice Number:</span> {invoice.invoiceNumber}</p>
                <p><span className="text-muted-foreground">Date of Issue:</span> {new Date(invoice.date).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Status:</span> <span className="uppercase font-semibold">{invoice.status}</span></p>
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="mb-12">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Billed To</h3>
              <div className="text-sm space-y-1">
                <p className="font-medium text-base">Current Buyer</p>
                <p className="text-muted-foreground">buyer@example.com</p>
                <p className="text-muted-foreground">Buyer Account ID: BUY-90210</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium border-b">Description</th>
                    <th className="px-6 py-4 font-medium border-b text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">
                      {invoice.description}
                      <p className="text-xs text-muted-foreground font-normal mt-1">
                        Subscription fee for {invoice.planName} plan
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      ${invoice.amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-muted/30">
                  <tr>
                    <td className="px-6 py-4 text-right text-muted-foreground">Subtotal</td>
                    <td className="px-6 py-4 text-right font-medium">${invoice.amount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-right text-muted-foreground border-t">Tax (0%)</td>
                    <td className="px-6 py-4 text-right font-medium border-t">$0.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-right font-bold text-lg border-t">Total</td>
                    <td className="px-6 py-4 text-right font-bold text-lg border-t">${invoice.amount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-12 text-sm text-muted-foreground text-center border-t pt-8">
              <p>Thank you for your business.</p>
              <p className="mt-1">This is a system-generated mock invoice. No signature is required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
