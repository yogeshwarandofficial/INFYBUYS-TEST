import { type SellerSettings, useSellerStore } from '@/store/useSellerStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Palette, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/providers/ThemeProvider';

interface SellerAppearanceSettingsProps {
  settings: SellerSettings['preferences'];
}

export function SellerAppearanceSettings({ settings }: SellerAppearanceSettingsProps) {
  const { updateSellerSettings } = useSellerStore();
  const { setTheme } = useTheme();

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
    updateSellerSettings({
      preferences: {
        ...settings,
        themePreference: value,
      },
    });
  };

  const handleLanguageChange = (value: string) => {
    updateSellerSettings({
      preferences: {
        ...settings,
        languagePreference: value,
      },
    });
  };

  return (
    <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg text-[#111827]">Appearance & Localization</CardTitle>
        <CardDescription className="text-[#64748B]">Customize how InfyBuys looks and feels for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 w-full sm:w-auto pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Palette className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="themePreference" className="text-[15px] font-semibold text-[#111827]">Theme Preference</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Select your preferred color theme.</p>
            </div>
          </div>
          <Select
            value={settings.themePreference}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger id="themePreference" className="w-[180px] bg-white border-[#E5E9F2] shadow-sm rounded-xl text-[#111827]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 w-full sm:w-auto pr-4">
            <div className="w-10 h-10 rounded-xl bg-[#F6F8FC] flex items-center justify-center shrink-0"><Globe className="w-5 h-5 text-[#94A3B8]" /></div>
            <div className="space-y-0.5">
              <Label htmlFor="languagePreference" className="text-[15px] font-semibold text-[#111827]">Language</Label>
              <p className="text-[13px] text-[#64748B] mt-0.5">Select your preferred language.</p>
            </div>
          </div>
          <Select
            value={settings.languagePreference}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="languagePreference" className="w-[180px] bg-white border-[#E5E9F2] shadow-sm rounded-xl text-[#111827]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </CardContent>
    </Card>
  );
}
