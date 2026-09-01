import { Breadcrumb } from './Breadcrumb';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn("bg-muted/30 border-b", className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <Breadcrumb items={breadcrumbs} className="mb-6" />
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
