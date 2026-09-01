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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Privacy Settings</CardTitle>
        <CardDescription>Manage who can see your profile and contact information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 w-full sm:w-auto pr-4">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <Label htmlFor="profileVisibility" className="text-base">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Control who can view your seller profile.</p>
            </div>
          </div>
          <Select
            value={settings.profileVisibility}
            onValueChange={(v) => handleToggle('profileVisibility', v)}
          >
            <SelectTrigger id="profileVisibility" className="w-[180px]">
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
            <EyeOff className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <Label htmlFor="showContactInformation" className="text-base">Show Contact Info</Label>
              <p className="text-sm text-muted-foreground">Allow buyers to see your email and phone number on your profile.</p>
            </div>
          </div>
          <Switch
            id="showContactInformation"
            checked={settings.showContactInformation}
            onCheckedChange={(c) => handleToggle('showContactInformation', c)}
          />
        </div>

      </CardContent>
    </Card>
  );
}
