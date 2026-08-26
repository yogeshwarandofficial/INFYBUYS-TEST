import { FileText, Download, Eye, Calendar, HardDrive, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BuyerNDA } from '@/store/useBuyerStore';

interface NDADocumentCardProps {
  nda: BuyerNDA;
  onView: () => void;
  onDownload: () => void;
  onDelete?: () => void;
}

export function NDADocumentCard({ nda, onView, onDownload, onDelete }: NDADocumentCardProps) {
  if (nda.status !== 'approved' || !nda.documentName) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base truncate" title={nda.documentName}>
              {nda.documentName}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Badge variant="secondary" className="px-1.5 py-0 text-xs font-normal">v{nda.version}</Badge>
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {nda.documentSize}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Valid till {nda.expiresAt ? new Date(nda.expiresAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={onView}>
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={onDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            {onDelete && (
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0" onClick={onDelete} aria-label="Delete document">
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
