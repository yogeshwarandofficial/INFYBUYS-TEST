import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';
import { useLocation } from 'react-router';

export default function SellerPlaceholder() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const title = pathParts[pathParts.length - 1]
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : 'Feature';

  return (
    <>
      <Seo title={`Seller ${title}`} description={`Manage your ${title.toLowerCase()}`} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto h-full flex flex-col">
        <PageHeader
          title={title}
          description={`Seller ${title.toLowerCase()} management interface.`}
          breadcrumbs={[
            { label: 'Seller Portal', href: '/seller' },
            { label: title }
          ]}
        />

        <Card className="flex-1 min-h-[400px] flex items-center justify-center border-dashed">
          <CardContent className="flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Construction className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-semibold tracking-tight">Coming Soon</h3>
              <p className="text-muted-foreground">
                The {title.toLowerCase()} module is currently under development.
                Please check back in a future update for full functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
