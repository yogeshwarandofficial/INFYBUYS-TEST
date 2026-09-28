import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/useUserStore';
import { DeleteAccountDialog } from '@/components/buyer/profile/DeleteAccountDialog';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function AccountStatusCard() {
  const { user } = useUserStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const activePlanName = user?.hasActiveSubscription ? 'Active' : 'Free';
  const accountType = user?.roles?.includes('buyer') ? 'Buyer' : (user?.roles?.join(', ') || 'Unknown');
  
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Unknown';

  return (
    <>
      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            Account Status
          </h2>
        </div>

        <p className="text-[13px] font-medium text-slate-500 mb-6">View your current account standing and manage your data.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Account Type</span>
            <span className="text-sm font-semibold text-slate-900 capitalize">{accountType}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Verification</span>
            <div className="flex items-center gap-2">
              {user?.verified ? (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/60 font-bold hover:bg-emerald-100 shadow-none px-2.5 py-1 text-xs">Verified</Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200/60 font-bold hover:bg-amber-100 shadow-none px-2.5 py-1 text-xs">Unverified</Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subscription</span>
            <span className="text-sm font-semibold text-slate-900">{activePlanName} Plan</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Member Since</span>
            <span className="text-sm font-semibold text-slate-900">{memberSince}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-1 w-full sm:w-auto">
            <h4 className="font-bold text-sm text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h4>
            <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="w-full sm:w-auto shrink-0 rounded-xl font-bold shadow-sm h-auto py-2.5">
            Delete Account
          </Button>
        </div>
      </div>

      <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </>
  );
}
