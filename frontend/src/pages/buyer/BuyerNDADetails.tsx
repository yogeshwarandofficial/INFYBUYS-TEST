import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { useMyNdas } from '@/hooks/useNda';
import { NDAStatusBadge } from '@/components/buyer/nda/NDAStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BuyerNDADetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: ndas = [], isLoading } = useMyNdas();

  const nda = ndas.find(n => n.id === id);

  useEffect(() => {
    if (!isLoading && !nda) {
      navigate('/buyer/nda');
    }
  }, [isLoading, nda, navigate]);

  if (!nda) return null;

  return (
    <>
      <Seo title={`NDA - ${nda.listing?.seller?.sellerProfile?.businessName || 'Business'}`} description="View NDA details and status." />

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
            </p>
          </div>
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
                    <div className="font-medium text-lg">{nda.listing?.seller?.sellerProfile?.businessName || 'Business'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Listing Title</div>
                    <div className="font-medium">{nda.listing?.title || 'Unknown Listing'}</div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
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
                <CardTitle className="text-base">Agreement Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">NDA Version</div>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                    {nda.ndaVersion}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <div className="w-0.5 h-full bg-border" />
                    </div>
                    <div className="pb-4">
                      <p className="font-medium text-sm">Requested</p>
                      <p className="text-xs text-muted-foreground">{new Date(nda.requestedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {nda.signedAt && (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <div className="pb-4">
                        <p className="font-medium text-sm">Signed</p>
                        <p className="text-xs text-muted-foreground">{new Date(nda.signedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
