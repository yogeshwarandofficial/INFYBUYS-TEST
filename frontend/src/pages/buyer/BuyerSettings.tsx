import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
import { BuyerPreferencesCard } from '@/components/buyer/profile/BuyerPreferencesCard';
import { AccountStatusCard } from '@/components/buyer/profile/AccountStatusCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LogOut, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useBuyerStore } from '@/store/useBuyerStore';
import { useTheme } from '@/providers/ThemeProvider';

export default function BuyerSettings() {
  const { logout } = useUserStore();
  const { settings, updateSettings } = useBuyerStore();
  const { setTheme } = useTheme();

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    updateSettings({ themePreference: value });
    setTheme(value);
  };

  const handleLanguageChange = (value: string) => {
    updateSettings({ languagePreference: value });
  };

  return (
    <>
      <Seo title="Account Settings" description="Manage your account preferences and settings." />

      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <PageHeader
          title="Account Settings"
          description="Manage your notifications, appearance, and account status."
          breadcrumbs={[{ label: 'Settings' }]}
        />

        <div className="space-y-8">
          <BuyerPreferencesCard />

          <Card>
            <CardHeader>
              <CardTitle>Appearance & Regional</CardTitle>
              <CardDescription>Customize how InfyBuys looks and feels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme Preference</Label>
                  <Select value={settings.themePreference} onValueChange={handleThemeChange}>
                    <SelectTrigger aria-label="Select theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" /> Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" /> Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" /> System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.languagePreference} onValueChange={handleLanguageChange}>
                    <SelectTrigger aria-label="Select language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" /> English (US)
                        </div>
                      </SelectItem>
                      {/* Stub for additional languages */}
                      <SelectItem value="es" disabled>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="w-4 h-4" /> Español (Coming soon)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <AccountStatusCard />

          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Sign out of your current session on this device.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
