import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/store/useUserStore';
import { DeleteAccountDialog } from '@/components/buyer/profile/DeleteAccountDialog';

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
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>View your current account standing and manage your data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Account Type</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold capitalize">{accountType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Verification</span>
              <div className="flex items-center gap-2">
                {user?.verified ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Verified</Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Unverified</Badge>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Subscription</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{activePlanName} Plan</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Member Since</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{memberSince}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 border-t pt-6">
          <div className="space-y-1 w-full sm:w-auto">
            <h4 className="font-medium text-sm text-destructive">Danger Zone</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="w-full sm:w-auto shrink-0">
            Delete Account
          </Button>
        </CardFooter>
      </Card>

      <DeleteAccountDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} />
    </>
  );
}
