import { type SellerSettings, useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, MessageSquare, ListPlus } from 'lucide-react';

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
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Notification Preferences</CardTitle>
        <CardDescription className="text-[#64748B]">Choose how and when you want to be notified.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">


        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Bell className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="enquiryNotifications" className="text-[15px] font-semibold text-[#111827]">New Enquiries</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Get notified when a buyer makes an enquiry on your listing.</p>
            </div>
          </div>
          <Switch className="data-[state=checked]:bg-[#2563EB]"
            id="enquiryNotifications"
            checked={settings.enquiryNotifications}
            onCheckedChange={(c) => handleToggle('enquiryNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><MessageSquare className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="messageNotifications" className="text-[15px] font-semibold text-[#111827]">Direct Messages</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Get notified when you receive a direct message.</p>
            </div>
          </div>
          <Switch className="data-[state=checked]:bg-[#2563EB]"
            id="messageNotifications"
            checked={settings.messageNotifications}
            onCheckedChange={(c) => handleToggle('messageNotifications', c)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><ListPlus className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="listingNotifications" className="text-[15px] font-semibold text-[#111827]">Listing Updates</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Get notified about the status of your listings (approval, expiry).</p>
            </div>
          </div>
          <Switch className="data-[state=checked]:bg-[#2563EB]"
            id="listingNotifications"
            checked={settings.listingNotifications}
            onCheckedChange={(c) => handleToggle('listingNotifications', c)}
          />
        </div>



      </CardContent>
    </Card>
  );
}
