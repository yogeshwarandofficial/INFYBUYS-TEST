import { CheckCircle2, Clock, FileText, Ban, AlertCircle, XCircle } from 'lucide-react';
import type { BuyerNDA } from '@/store/useBuyerStore';
import { cn } from '@/lib/utils';

interface NDAStatusTimelineProps {
  nda: BuyerNDA;
}

export function NDAStatusTimeline({ nda }: NDAStatusTimelineProps) {
  const steps = [
    {
      id: 'requested',
      label: 'Requested',
      date: nda.requestedAt,
      completed: true,
      active: nda.status === 'draft' || nda.status === 'pending',
      icon: FileText
    },
    {
      id: 'review',
      label: 'Under Review',
      date: nda.status !== 'pending' && nda.status !== 'draft' ? nda.updatedAt : null,
      completed: ['under-review', 'approved', 'rejected', 'expired', 'cancelled'].includes(nda.status),
      active: nda.status === 'under-review',
      icon: AlertCircle
    },
    {
      id: 'final',
      label: nda.status === 'rejected' ? 'Rejected'
             : nda.status === 'cancelled' ? 'Cancelled'
             : nda.status === 'expired' ? 'Expired'
             : 'Approved',
      date: nda.approvedAt || (['rejected', 'cancelled', 'expired'].includes(nda.status) ? nda.updatedAt : null),
      completed: ['approved', 'rejected', 'expired', 'cancelled'].includes(nda.status),
      active: ['approved', 'rejected', 'expired', 'cancelled'].includes(nda.status),
      icon: nda.status === 'rejected' ? XCircle
          : nda.status === 'cancelled' ? Ban
          : nda.status === 'expired' ? Clock
          : CheckCircle2,
      isError: ['rejected', 'cancelled', 'expired'].includes(nda.status)
    }
  ];

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {steps.map((step) => {
        const Icon = step.icon;
        const isCompleted = step.completed;
        const isActive = step.active;
        const isError = step.isError;

        return (
          <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            {/* Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm",
              isCompleted && !isError ? "border-primary text-primary" :
              isError ? "border-destructive text-destructive" :
              "border-muted text-muted-foreground",
              isActive && "ring-4 ring-primary/20"
            )}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className={cn(
                  "font-medium",
                  isError ? "text-destructive" : isCompleted ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.label}
                </h4>
                {step.date && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(step.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
