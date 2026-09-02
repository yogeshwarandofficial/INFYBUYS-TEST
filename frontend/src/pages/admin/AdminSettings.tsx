import { useState } from 'react';
import type { AdminPlatformSettings } from '@/store/useAdminStore';
import { useAdminStore } from '@/store/useAdminStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSettings() {
  const { settings, updateSettings } = useAdminStore();

  const [formData, setFormData] = useState<AdminPlatformSettings>(settings);
  const [activeTab, setActiveTab] = useState('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof AdminPlatformSettings) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (name: keyof AdminPlatformSettings) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSave = () => {
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'registrations', label: 'Registrations' },
    { id: 'moderation', label: 'Moderation' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'limits', label: 'Limits' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
            Platform Configuration
          </h1>
          <p className="text-[15px] text-[#64748B] mt-1">
            Manage global settings, registrations, and moderation rules.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {saveSuccess && (
            <span className="text-sm text-green-600 font-medium">Settings saved!</span>
          )}
          <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex w-full justify-start border-b mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information and localization settings for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    name="platformName"
                    value={formData.platformName}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformDescription">Platform Description</Label>
                  <Input
                    id="platformDescription"
                    name="platformDescription"
                    value={formData.platformDescription}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    name="supportEmail"
                    type="email"
                    value={formData.supportEmail}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleTextChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Select
                    value={formData.defaultCurrency}
                    onValueChange={handleSelectChange('defaultCurrency')}
                  >
                    <SelectTrigger id="defaultCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={handleSelectChange('timezone')}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC (Universal Time Coordinated)</SelectItem>
                      <SelectItem value="America/New_York">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="America/Los_Angeles">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="Europe/London">GMT (Greenwich Mean Time)</SelectItem>
                      <SelectItem value="Asia/Tokyo">JST (Japan Standard Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'registrations' && (
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>Registration Settings</CardTitle>
              <CardDescription>Control who can register and access the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Take the platform offline for maintenance. Only admins can log in.
                    </p>
                  </div>
                  <Switch
                    checked={formData.maintenanceMode}
                    onCheckedChange={handleSwitchChange('maintenanceMode')}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable all new user registrations across the platform.
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowNewRegistrations}
                    onCheckedChange={handleSwitchChange('allowNewRegistrations')}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Allow Seller Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to register as sellers/brokers.
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowSellerRegistrations}
                    onCheckedChange={handleSwitchChange('allowSellerRegistrations')}
                    disabled={!formData.allowNewRegistrations}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Allow Buyer Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to register as buyers/investors.
                    </p>
                  </div>
                  <Switch
                    checked={formData.allowBuyerRegistrations}
                    onCheckedChange={handleSwitchChange('allowBuyerRegistrations')}
                    disabled={!formData.allowNewRegistrations}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'moderation' && (
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>Moderation & Approvals</CardTitle>
              <CardDescription>Configure rules for auto-approving content vs requiring manual admin review.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Require Seller Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      New sellers require admin approval before they can create listings.
                    </p>
                  </div>
                  <Switch
                    checked={formData.requireSellerApproval}
                    onCheckedChange={handleSwitchChange('requireSellerApproval')}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Require Listing Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      New listings require admin approval before becoming visible to buyers.
                    </p>
                  </div>
                  <Switch
                    checked={formData.requireListingApproval}
                    onCheckedChange={handleSwitchChange('requireListingApproval')}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Require Review Moderation</Label>
                    <p className="text-sm text-muted-foreground">
                      User reviews must be approved by an admin before being published.
                    </p>
                  </div>
                  <Switch
                    checked={formData.requireReviewModeration}
                    onCheckedChange={handleSwitchChange('requireReviewModeration')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage how the platform communicates with users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Master switch for all platform-generated notifications.
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableNotifications}
                    onCheckedChange={handleSwitchChange('enableNotifications')}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send transactional emails for important events.
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableEmailNotifications}
                    onCheckedChange={handleSwitchChange('enableEmailNotifications')}
                    disabled={!formData.enableNotifications}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4 bg-background">
                  <div className="space-y-0.5">
                    <Label className="text-base font-semibold">Enable SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send SMS alerts to users who have opted in.
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableSmsNotifications}
                    onCheckedChange={handleSwitchChange('enableSmsNotifications')}
                    disabled={!formData.enableNotifications}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'limits' && (
          <Card className="border-border/50 shadow-sm backdrop-blur-xl bg-background/95">
            <CardHeader>
              <CardTitle>Platform Limits</CardTitle>
              <CardDescription>Set maximum limits for various platform features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxListingImages">Max Images Per Listing</Label>
                  <Input
                    id="maxListingImages"
                    name="maxListingImages"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxListingImages}
                    onChange={handleNumberChange}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of photos a seller can upload per listing.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMessageLength">Max Message Length (Characters)</Label>
                  <Input
                    id="maxMessageLength"
                    name="maxMessageLength"
                    type="number"
                    min="100"
                    max="10000"
                    value={formData.maxMessageLength}
                    onChange={handleNumberChange}
                  />
                  <p className="text-xs text-muted-foreground">Character limit for chat messages and enquiries.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
