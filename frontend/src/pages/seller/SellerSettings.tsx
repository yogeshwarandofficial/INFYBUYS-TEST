import { useState, useEffect } from 'react';
import { Seo } from '@/components/shared/Seo';
import { useSellerStore } from '@/store/useSellerStore';
import { SellerNotificationPreferences } from '@/components/seller/settings/SellerNotificationPreferences';
import { SellerPrivacySettings } from '@/components/seller/settings/SellerPrivacySettings';
import { SellerAppearanceSettings } from '@/components/seller/settings/SellerAppearanceSettings';
import { SellerAccountStatusCard } from '@/components/seller/settings/SellerAccountStatusCard';
import { SellerDeleteAccountDialog } from '@/components/seller/settings/SellerDeleteAccountDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function SellerSettings() {
  const { profile, settings, cancelSellerAccountDeletion, initSellerSettings } = useSellerStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    initSellerSettings();
  }, [initSellerSettings]);

  return (
    <>
      <Seo title="Settings - Seller Portal | InfyBuys" />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Account Settings</h1>
          <p className="text-[15px] text-[#64748B] mt-1">
            Manage your account preferences, notifications, and privacy settings.
          </p>
        </div>

        {settings.account.accountDeletionRequested && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-lg flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Account Deletion Pending</p>
                <p className="text-sm">Your request to delete your account is being processed.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => cancelSellerAccountDeletion()}>
              Cancel Deletion
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {/* Notification Preferences */}
          <section id="notifications">
            <SellerNotificationPreferences settings={settings.notifications} />
          </section>

          {/* Privacy Settings */}
          <section id="privacy">
            <SellerPrivacySettings settings={settings.privacy} />
          </section>

          {/* Appearance & Language */}
          <section id="appearance">
            <SellerAppearanceSettings settings={settings.preferences} />
          </section>

          {/* Account Status */}
          <section id="account-status">
            <SellerAccountStatusCard profile={profile} />
          </section>

          {/* Danger Zone */}
          <section id="danger-zone">
            <Card className="overflow-hidden bg-rose-50/50 backdrop-blur-md border border-rose-200 shadow-sm shadow-blue-900/5 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg text-rose-700">Danger Zone</CardTitle>
                <CardDescription className="text-rose-700/70">Irreversible and destructive actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-[15px] text-rose-900">Delete Account</h4>
                    <p className="text-[13px] text-rose-700/80 mt-1">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <Button
                    variant="destructive" className="rounded-xl shadow-sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={settings.account.accountDeletionRequested}
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <SellerDeleteAccountDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
