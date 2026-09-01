import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Download, ShieldAlert } from 'lucide-react';
import type { BuyerNDA } from '@/store/useBuyerStore';

interface MockDocumentViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nda: BuyerNDA;
}

export function MockDocumentViewer({ open, onOpenChange, nda }: MockDocumentViewerProps) {
  if (!nda || nda.status !== 'approved') return null;

  const handleDownload = () => {
    // Mock download behavior
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock NDA Document Content\nThis is a mock file generated for testing purposes.');
    link.download = nda.documentName || 'Mock_NDA.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg">{nda.documentName}</DialogTitle>
                <div className="text-sm text-muted-foreground flex gap-3">
                  <span>Version {nda.version}</span>
                  <span>•</span>
                  <span>{nda.documentSize}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download Mock
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative rounded-md border bg-muted/30 p-1 mt-4">
          <div className="absolute top-4 left-0 right-0 z-10 flex justify-center pointer-events-none">
            <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <ShieldAlert className="w-4 h-4" />
              Mock Document Preview
            </div>
          </div>

          <ScrollArea className="h-full bg-white dark:bg-card p-8 shadow-inner text-black dark:text-card-foreground">
            <div className="max-w-2xl mx-auto space-y-6 opacity-90 pt-8">
              <div className="text-center mb-10">
                <h1 className="text-2xl font-serif font-bold underline mb-2">NON-DISCLOSURE AGREEMENT</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Effective Date: {new Date(nda.approvedAt || '').toLocaleDateString()}</p>
              </div>

              <div className="space-y-4 font-serif leading-relaxed text-sm">
                <p>
                  This Non-Disclosure Agreement (the "Agreement") is entered into by and between <strong>{nda.businessName}</strong> ("Disclosing Party"),
                  and <strong>Buyer</strong> ("Receiving Party"), collectively referred to as the "Parties".
                </p>
                <h3 className="font-bold mt-6 mb-2">1. Confidential Information</h3>
                <p>
                  "Confidential Information" shall mean any and all technical and non-technical information provided by the Disclosing Party to the Receiving Party,
                  including but not limited to financial records, trade secrets, business plans, customer lists, and proprietary technology.
                </p>
                <h3 className="font-bold mt-6 mb-2">2. Purpose</h3>
                <p>
                  The Receiving Party agrees that the Confidential Information is to be used solely for the purpose of evaluating a potential business transaction or acquisition.
                </p>
                <h3 className="font-bold mt-6 mb-2">3. Non-Disclosure Obligations</h3>
                <p>
                  The Receiving Party agrees not to disclose, publish, or otherwise disseminate Confidential Information to any third party without the prior written consent of the Disclosing Party.
                </p>

                <div className="mt-16 pt-8 border-t border-gray-300 grid grid-cols-2 gap-8">
                  <div>
                    <div className="mb-8 border-b border-gray-400 w-full h-8 flex items-end">
                      <span className="italic text-gray-400">Electronically Signed</span>
                    </div>
                    <p className="font-bold text-xs uppercase tracking-wider">Disclosing Party</p>
                    <p className="mt-1">{nda.sellerName}</p>
                    <p className="text-xs text-gray-500 mt-1">{nda.businessName}</p>
                  </div>
                  <div>
                    <div className="mb-8 border-b border-gray-400 w-full h-8 flex items-end">
                      <span className="italic text-gray-400">Electronically Signed</span>
                    </div>
                    <p className="font-bold text-xs uppercase tracking-wider">Receiving Party</p>
                    <p className="mt-1">Buyer Account</p>
                    <p className="text-xs text-gray-500 mt-1">InfyBuys User</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
