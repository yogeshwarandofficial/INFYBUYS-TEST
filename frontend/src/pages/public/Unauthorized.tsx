import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useUserStore } from '@/store/useUserStore';

export default function Unauthorized() {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        You don't have permission to access this page. Your current role is <span className="font-semibold text-foreground">{user?.roles?.join(', ') || 'Guest'}</span>.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
        <Button variant="outline" onClick={() => navigate(user ? (user.roles?.some(r => ['admin', 'super-admin'].includes(r.toLowerCase())) ? '/admin' : (user.roles?.some(r => r.toLowerCase() === 'seller') ? '/seller' : '/buyer')) : '/login')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
