import { type SellerSettings, useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SellerPrivacySettingsProps {
  settings: SellerSettings['privacy'];
}

export function SellerPrivacySettings({ settings }: SellerPrivacySettingsProps) {
  const { updateSellerSettings } = useSellerStore();

  const handleToggle = (key: keyof SellerSettings['privacy'], value: any) => {
    updateSellerSettings({
      privacy: {
        ...settings,
        [key]: value,
      },
    });
  };

  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Privacy Settings</CardTitle>
        <CardDescription className="text-[#64748B]">Manage who can see your profile and contact information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 w-full sm:w-auto pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Shield className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="profileVisibility" className="text-[15px] font-semibold text-[#111827]">Profile Visibility</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Control who can view your seller profile.</p>
            </div>
          </div>
          <Select
            value={settings.profileVisibility}
            onValueChange={(v) => handleToggle('profileVisibility', v)}
          >
            <SelectTrigger id="profileVisibility" className="w-[180px] bg-white border-[#E5E9F2] shadow-sm rounded-xl text-[#111827]">
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public (Everyone)</SelectItem>
              <SelectItem value="registered_buyers">Registered Buyers Only</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><EyeOff className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="showContactInformation" className="text-[15px] font-semibold text-[#111827]">Show Contact Info</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Allow buyers to see your email and phone number on your profile.</p>
            </div>
          </div>
          <Switch className="data-[state=checked]:bg-[#2563EB]"
            id="showContactInformation"
            checked={settings.showContactInformation}
            onCheckedChange={(c) => handleToggle('showContactInformation', c)}
          />
        </div>

      </CardContent>
    </Card>
  );
}
