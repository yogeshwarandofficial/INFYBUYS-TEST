import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import type { ReactNode } from 'react';

interface LegalLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalLayout({ title, description, lastUpdated, children }: LegalLayoutProps) {
  return (
    <>
      <Seo title={`${title} - InfyBuys`} description={description} />

      <PageHeader
        title={title}
        breadcrumbs={[{ label: title }]}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground mb-8">
            Last Updated: {lastUpdated}
          </p>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
