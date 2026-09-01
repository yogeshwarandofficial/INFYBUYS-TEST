import { Seo } from '@/components/shared/Seo';
import { Settings } from 'lucide-react';

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
      <Seo title="Under Maintenance" description="We are currently performing scheduled maintenance." />
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary animate-pulse">
        <Settings className="w-12 h-12 animate-[spin_4s_linear_infinite]" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Scheduled Maintenance</h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-lg">
        We are currently performing scheduled maintenance to improve your experience. We'll be back online shortly. Thank you for your patience!
      </p>
      <div className="text-sm text-muted-foreground">
        Expected downtime: ~30 minutes
      </div>
    </div>
  );
}
