import { CreditCard, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PaymentMethod } from '@/store/useBuyerStore';
import { cn } from '@/lib/utils';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault?: () => void;
  onRemove?: () => void;
  className?: string;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function PaymentMethodCard({
  method,
  onSetDefault,
  onRemove,
  className,
  selectable,
  selected,
  onSelect
}: PaymentMethodCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-colors",
        selectable && "cursor-pointer hover:border-primary/50",
        selected && "border-primary ring-1 ring-primary",
        className
      )}
      onClick={selectable ? onSelect : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-muted rounded flex items-center justify-center shrink-0 border shadow-sm">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium flex items-center gap-2">
                {method.brand} •••• {method.last4}
                {method.isDefault && (
                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-semibold py-0 h-4">
                    Default
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
              </div>
            </div>
          </div>

          {selectable ? (
            <div className="shrink-0 ml-4">
              {selected ? (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {!method.isDefault && onSetDefault && (
                <Button variant="ghost" size="sm" onClick={onSetDefault}>
                  Set Default
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={onRemove}
                  title="Remove payment method"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
