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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Appearance & Localization</CardTitle>
        <CardDescription>Customize how InfyBuys looks and feels for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3 w-full sm:w-auto pr-4">
            <Palette className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <Label htmlFor="themePreference" className="text-base">Theme Preference</Label>
              <p className="text-sm text-muted-foreground">Select your preferred color theme.</p>
            </div>
          </div>
          <Select
            value={settings.themePreference}
            onValueChange={handleThemeChange}
          >
            <SelectTrigger id="themePreference" className="w-[180px]">
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
            <Globe className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <Label htmlFor="languagePreference" className="text-base">Language</Label>
              <p className="text-sm text-muted-foreground">Select your preferred language.</p>
            </div>
          </div>
          <Select
            value={settings.languagePreference}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="languagePreference" className="w-[180px]">
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
