import { type SellerSettings, useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Bell, MessageSquare, ListPlus, Megaphone, Smartphone } from 'lucide-react';

interface SellerNotificationPreferencesProps {
  settings: SellerSettings['notifications'];
}

export function SellerNotificationPreferences({ settings }: SellerNotificationPreferencesProps) {
  const { updateSellerSettings } = useSellerStore();

  const handleToggle = (key: keyof SellerSettings['notifications'], checked: boolean) => {
    updateSellerSettings({
      notifications: {
        ...settings,
        [key]: checked,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notification Preferences</CardTitle>
        <CardDescription>Choose how and when you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive daily digests and important updates via email.</p>
            </div>
          </div>
          <Switch
            id="emailNotifications"
            checked={settings.emailNotifications}
            onCheckedChange={(c) => handleToggle('emailNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Bell className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="enquiryNotifications" className="text-base">New Enquiries</Label>
              <p className="text-sm text-muted-foreground">Get notified when a buyer makes an enquiry on your listing.</p>
            </div>
          </div>
          <Switch
            id="enquiryNotifications"
            checked={settings.enquiryNotifications}
            onCheckedChange={(c) => handleToggle('enquiryNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="messageNotifications" className="text-base">Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Get notified when you receive a direct message.</p>
            </div>
          </div>
          <Switch
            id="messageNotifications"
            checked={settings.messageNotifications}
            onCheckedChange={(c) => handleToggle('messageNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <ListPlus className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="listingNotifications" className="text-base">Listing Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about the status of your listings (approval, expiry).</p>
            </div>
          </div>
          <Switch
            id="listingNotifications"
            checked={settings.listingNotifications}
            onCheckedChange={(c) => handleToggle('listingNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser.</p>
            </div>
          </div>
          <Switch
            id="pushNotifications"
            checked={settings.pushNotifications}
            onCheckedChange={(c) => handleToggle('pushNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Megaphone className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails" className="text-base">Marketing & Promos</Label>
              <p className="text-sm text-muted-foreground">Receive promotional emails and tips for sellers.</p>
            </div>
          </div>
          <Switch
            id="marketingEmails"
            checked={settings.marketingEmails}
            onCheckedChange={(c) => handleToggle('marketingEmails', c)}
          />
        </div>

      </CardContent>
    </Card>
  );
}
