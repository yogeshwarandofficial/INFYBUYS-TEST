import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserSettings, useUpdateUserSettings, type UserSettings } from '@/hooks/useUserSettings';

export function BuyerPreferencesCard() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();

  const handleToggle = (key: keyof UserSettings) => (checked: boolean) => {
    updateSettingsMutation.mutate({ [key]: checked });
  };

  if (isLoading || !settings) return <div>Loading preferences...</div>;

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
              <Label htmlFor="messageNotifications" className="text-base font-medium">Enquiry Messages</Label>
              <p className="text-sm text-muted-foreground">Get notified when you receive a new direct message.</p>
            </div>
            <Switch
              id="messageNotifications"
              checked={settings.messageNotifications}
              onCheckedChange={handleToggle('messageNotifications')}
            />
          </div>


        </div>
      </CardContent>
    </Card>
  );
}
