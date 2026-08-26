import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBuyerStore } from '@/store/useBuyerStore';
import { DeleteAccountDialog } from '@/components/buyer/profile/DeleteAccountDialog';

export function AccountStatusCard() {
  const { profile, plans, subscription } = useBuyerStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const activePlan = plans.find(p => p.id === subscription?.planId) || plans[0];

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
                <span className="font-semibold">{profile.buyerType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Verification</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500">Verified</Badge>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Subscription</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{activePlan.name} Plan</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Member Since</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">October 2023</span>
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
