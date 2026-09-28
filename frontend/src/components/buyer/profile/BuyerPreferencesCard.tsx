import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUserSettings, useUpdateUserSettings, type UserSettings } from '@/hooks/useUserSettings';
import { Settings2 } from 'lucide-react';

export function BuyerPreferencesCard() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();

  const handleToggle = (key: keyof UserSettings) => (checked: boolean) => {
    updateSettingsMutation.mutate({ [key]: checked });
  };

  if (isLoading || !settings) return <div>Loading preferences...</div>;

  return (
    <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Settings2 className="w-5 h-5" />
          </div>
          Notification Preferences
        </h2>
      </div>
      
      <p className="text-[13px] font-medium text-slate-500 mb-6">Manage how you receive alerts and updates.</p>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <Label htmlFor="savedSearchAlerts" className="text-sm font-bold text-slate-900">Saved Search Alerts</Label>
            <p className="text-xs text-slate-500">Get notified when new listings match your saved searches.</p>
          </div>
          <Switch
            id="savedSearchAlerts"
            checked={settings.savedSearchAlerts}
            onCheckedChange={handleToggle('savedSearchAlerts')}
          />
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <Label htmlFor="enquiryNotifications" className="text-sm font-bold text-slate-900">Enquiry Updates</Label>
            <p className="text-xs text-slate-500">Alerts when sellers respond to your enquiries.</p>
          </div>
          <Switch
            id="enquiryNotifications"
            checked={settings.enquiryNotifications}
            onCheckedChange={handleToggle('enquiryNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="messageNotifications" className="text-sm font-bold text-slate-900">Enquiry Messages</Label>
            <p className="text-xs text-slate-500">Get notified when you receive a new direct message.</p>
          </div>
          <Switch
            id="messageNotifications"
            checked={settings.messageNotifications}
            onCheckedChange={handleToggle('messageNotifications')}
          />
        </div>
      </div>
    </div>
  );
}
