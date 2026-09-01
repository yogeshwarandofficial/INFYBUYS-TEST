import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useBuyerStore, type BuyerSettings } from '@/store/useBuyerStore';

export function BuyerPreferencesCard() {
  const { settings, updateSettings } = useBuyerStore();

  const handleToggle = (key: keyof BuyerSettings) => (checked: boolean) => {
    updateSettings({ [key]: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive alerts and updates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications" className="text-base font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive daily summaries and critical alerts via email.</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="savedSearchAlerts" className="text-base font-medium">Saved Search Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when new listings match your saved searches.</p>
            </div>
            <Switch
              id="savedSearchAlerts"
              checked={settings.savedSearchAlerts}
              onCheckedChange={handleToggle('savedSearchAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enquiryNotifications" className="text-base font-medium">Enquiry Updates</Label>
              <p className="text-sm text-muted-foreground">Alerts when sellers respond to your enquiries.</p>
            </div>
            <Switch
              id="enquiryNotifications"
              checked={settings.enquiryNotifications}
              onCheckedChange={handleToggle('enquiryNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="messageNotifications" className="text-base font-medium">Direct Messages</Label>
              <p className="text-sm text-muted-foreground">Get notified when you receive a new direct message.</p>
            </div>
            <Switch
              id="messageNotifications"
              checked={settings.messageNotifications}
              onCheckedChange={handleToggle('messageNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketingEmails" className="text-base font-medium">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive news, feature updates, and exclusive offers.</p>
            </div>
            <Switch
              id="marketingEmails"
              checked={settings.marketingEmails}
              onCheckedChange={handleToggle('marketingEmails')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pushNotifications" className="text-base font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications directly in your browser.</p>
            </div>
            <Switch
              id="pushNotifications"
              checked={settings.pushNotifications}
              onCheckedChange={handleToggle('pushNotifications')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
