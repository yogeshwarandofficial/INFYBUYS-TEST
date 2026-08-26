import type { EnquiryStatus } from '@/store/useBuyerStore';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnquiryStatusTimelineProps {
  currentStatus: EnquiryStatus;
}

export function EnquiryStatusTimeline({ currentStatus }: EnquiryStatusTimelineProps) {
  const steps = [
    { id: 'sent', label: 'Sent to Seller' },
    { id: 'responded', label: 'Seller Responded' },
    { id: 'closed', label: 'Closed' }
  ];

  const getStepStatus = (stepId: string) => {
    if (currentStatus === 'closed') {
      if (stepId === 'closed') return 'active';
      return 'completed';
    }
    if (currentStatus === 'responded') {
      if (stepId === 'sent') return 'completed';
      if (stepId === 'responded') return 'active';
      return 'pending';
    }
    if (currentStatus === 'sent') {
      if (stepId === 'sent') return 'active';
      return 'pending';
    }
    return 'pending';
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 w-full mb-8">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className={cn("flex items-center", isLast ? "flex-none" : "flex-1")}>
            <div className="flex items-center gap-3">
              {status === 'completed' ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : status === 'active' ? (
                <div className="relative flex items-center justify-center w-6 h-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                  <Circle className="w-6 h-6 text-primary fill-primary" />
                </div>
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground/30" />
              )}
              <span className={cn(
                "font-medium text-sm whitespace-nowrap",
                status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
              )}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="hidden sm:block flex-1 mx-4 h-[2px] rounded-full bg-border relative overflow-hidden">
                <div className={cn(
                  "absolute inset-y-0 left-0 bg-primary transition-all duration-500",
                  status === 'completed' ? "w-full" : "w-0"
                )}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
