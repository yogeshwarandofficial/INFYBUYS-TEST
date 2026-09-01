import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useBuyerStore } from '@/store/useBuyerStore';
import { NDAStatusBadge } from '@/components/buyer/nda/NDAStatusBadge';
import { NDAStatusTimeline } from '@/components/buyer/nda/NDAStatusTimeline';
import { NDADocumentCard } from '@/components/buyer/nda/NDADocumentCard';
import { NDAActionMenu } from '@/components/buyer/nda/NDAActionMenu';
import { MockDocumentViewer } from '@/components/buyer/nda/MockDocumentViewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Building2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuyerNDADetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    ndas,
    approveMockNDA,
    rejectMockNDA,
    cancelNDA,
    deleteNDA
  } = useBuyerStore();

  const nda = ndas.find(n => n.id === id);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (!nda) {
      navigate('/buyer/nda');
    }
  }, [nda, navigate]);

  if (!nda) return null;

  return (
    <>
      <Seo title={`NDA - ${nda.businessName}`} description="View NDA details and status." />

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/buyer/nda')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              NDA Request
              <NDAStatusBadge status={nda.status} />
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              ID: {nda.id}
              <span>•</span>
              <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{nda.type}</Badge>
            </p>
          </div>
          <NDAActionMenu
            nda={nda}
            onApproveMock={() => approveMockNDA(nda.id)}
            onRejectMock={() => rejectMockNDA(nda.id, 'Buyer does not meet minimum capital requirements.')}
            onCancel={() => cancelNDA(nda.id)}
            onDelete={() => {
              deleteNDA(nda.id);
              navigate('/buyer/nda');
            }}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">

            {/* Business Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> Business Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Business Name</div>
                    <div className="font-medium text-lg">{nda.businessName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Listing Title</div>
                    <div className="font-medium">{nda.listingTitle}</div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      Seller: <span className="font-medium text-foreground">{nda.sellerName}</span>
                    </div>
                    <Button variant="link" size="sm" asChild className="p-0 h-auto">
                      <Link to={`/listing/${nda.listingId}`}>
                        View Listing <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Purpose</div>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {nda.purpose || 'No purpose specified.'}
                  </p>
                </div>
                {nda.message && (
                  <div>
                    <div className="text-sm font-medium mb-1">Message to Seller</div>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                      {nda.message}
                    </p>
                  </div>
                )}
                {nda.status === 'rejected' && nda.rejectionReason && (
                  <div className="pt-2">
                    <div className="text-sm font-medium text-destructive mb-1">Rejection Reason</div>
                    <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                      {nda.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Document Section */}
            {nda.status === 'approved' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Confidential Documents</h3>
                <NDADocumentCard
                  nda={nda}
                  onView={() => setViewerOpen(true)}
                  onDownload={() => {
                    const link = document.createElement('a');
                    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock NDA Document\nGenerated for testing.');
                    link.download = nda.documentName || 'Mock_NDA.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <NDAStatusTimeline nda={nda} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MockDocumentViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        nda={nda}
      />
    </>
  );
}
