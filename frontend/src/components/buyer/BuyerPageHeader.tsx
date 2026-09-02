import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { cn } from '@/lib/utils';
import React from 'react';

interface BuyerPageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
  action?: React.ReactNode;
}

export function BuyerPageHeader({ title, description, breadcrumbs, className, action }: BuyerPageHeaderProps) {
  return (
    <div className={cn("w-full", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className="mb-4" />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
