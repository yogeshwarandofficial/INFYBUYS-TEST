import { useNavigate, useLocation } from 'react-router';
import { Seo } from '@/components/shared/Seo';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';

export default function AdminPlaceholder() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract a readable name from the pathname (e.g., "/admin/users" -> "Users")
  const pathParts = location.pathname.split('/').filter(Boolean);
  const moduleName = pathParts[pathParts.length - 1];
  const displayTitle = moduleName
    ? moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
    : 'Admin Module';

  return (
    <>
      <Seo title={`${displayTitle} - Admin Portal | InfyBuys`} />

      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          {displayTitle}
        </h1>

        <p className="text-muted-foreground max-w-md mb-8">
          This admin module is currently under construction and will be available in a future update.
        </p>

        <Button onClick={() => navigate('/admin')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>
    </>
  );
}
