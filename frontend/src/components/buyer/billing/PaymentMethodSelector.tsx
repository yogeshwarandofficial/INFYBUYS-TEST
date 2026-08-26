import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuyerStore } from '@/store/useBuyerStore';
import { PaymentMethodCard } from './PaymentMethodCard';
import { AddPaymentMethodDialog } from './AddPaymentMethodDialog';

interface PaymentMethodSelectorProps {
  selectedMethodId: string | null;
  onSelect: (id: string) => void;
}

export function PaymentMethodSelector({ selectedMethodId, onSelect }: PaymentMethodSelectorProps) {
  const { paymentMethods } = useBuyerStore();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Payment Method</h3>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Mock Card
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="bg-muted/50 border border-dashed rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">No mock payment methods saved.</p>
          <Button variant="secondary" onClick={() => setIsAdding(true)}>
            Add Mock Payment Method
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {paymentMethods.map((pm) => (
            <PaymentMethodCard
              key={pm.id}
              method={pm}
              selectable
              selected={selectedMethodId === pm.id}
              onSelect={() => onSelect(pm.id)}
            />
          ))}
        </div>
      )}

      <AddPaymentMethodDialog open={isAdding} onOpenChange={setIsAdding} />
    </div>
  );
}
