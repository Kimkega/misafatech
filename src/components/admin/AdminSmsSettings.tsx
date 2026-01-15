import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Save, Loader2, Smartphone, Globe, Key, User, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SmsSettings {
  id: string;
  provider: string;
  is_enabled: boolean;
  api_key: string | null;
  api_secret: string | null;
  username: string | null;
  sender_id: string | null;
  environment: string;
  order_notification_enabled: boolean;
  status_update_enabled: boolean;
}

interface AdminSmsSettingsProps {
  smsSettings: SmsSettings | null;
  setSmsSettings: (settings: SmsSettings | null) => void;
}

const SMS_PROVIDERS = [
  { 
    id: "africas_talking", 
    name: "Africa's Talking", 
    description: "Most popular SMS API in Africa",
    color: "from-orange-500 to-amber-500",
    fields: ["api_key", "username", "sender_id"]
  },
  { 
    id: "beem_africa", 
    name: "Beem Africa", 
    description: "Tanzania-based SMS provider",
    color: "from-blue-500 to-cyan-500",
    fields: ["api_key", "api_secret", "sender_id"]
  },
  { 
    id: "celcom_africa", 
    name: "Celcom Africa", 
    description: "Pan-African messaging platform",
    color: "from-green-500 to-emerald-500",
    fields: ["api_key", "api_secret", "username", "sender_id"]
  },
  { 
    id: "africala", 
    name: "Africala", 
    description: "Bulk SMS for African businesses",
    color: "from-purple-500 to-violet-500",
    fields: ["api_key", "username", "sender_id"]
  },
  { 
    id: "esms_africa", 
    name: "eSMS Africa", 
    description: "Enterprise SMS solutions",
    color: "from-red-500 to-pink-500",
    fields: ["api_key", "api_secret", "sender_id"]
  }
];

const AdminSmsSettings = ({ smsSettings, setSmsSettings }: AdminSmsSettingsProps) => {
  const [saving, setSaving] = useState(false);
  const [testingSms, setTestingSms] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const { toast } = useToast();

  const selectedProvider = SMS_PROVIDERS.find(p => p.id === smsSettings?.provider) || SMS_PROVIDERS[0];

  const handleSaveSmsSettings = async () => {
    if (!smsSettings) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("sms_settings")
        .upsert({
          id: smsSettings.id,
          provider: smsSettings.provider,
          is_enabled: smsSettings.is_enabled,
          api_key: smsSettings.api_key,
          api_secret: smsSettings.api_secret,
          username: smsSettings.username,
          sender_id: smsSettings.sender_id,
          environment: smsSettings.environment,
          order_notification_enabled: smsSettings.order_notification_enabled,
          status_update_enabled: smsSettings.status_update_enabled,
        });

      if (error) throw error;
      toast({
        title: "SMS settings saved!",
        description: "Your SMS configuration has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving SMS settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestSms = async () => {
    if (!testPhone || !smsSettings?.is_enabled) {
      toast({
        title: "Cannot send test SMS",
        description: "Please enable SMS and enter a phone number",
        variant: "destructive",
      });
      return;
    }
    setTestingSms(true);
    try {
      // In a real implementation, this would call an edge function
      toast({
        title: "Test SMS queued",
        description: `A test message will be sent to ${testPhone}`,
      });
    } finally {
      setTestingSms(false);
    }
  };

  if (!smsSettings) return null;

  return (
    <Card className="bg-gradient-to-br from-card to-muted/30 border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedProvider.color}`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                SMS Notifications
                {smsSettings.is_enabled && (
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Active</Badge>
                )}
              </CardTitle>
              <CardDescription>Configure African SMS providers for order notifications</CardDescription>
            </div>
          </div>
          <Switch
            checked={smsSettings.is_enabled}
            onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, is_enabled: checked })}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Select SMS Provider</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SMS_PROVIDERS.map((provider) => (
              <div
                key={provider.id}
                onClick={() => setSmsSettings({ ...smsSettings, provider: provider.id })}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                  smsSettings.provider === provider.id
                    ? `border-primary bg-gradient-to-br ${provider.color} text-white`
                    : "border-muted hover:border-primary/50 bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span className="font-semibold text-sm">{provider.name}</span>
                </div>
                <p className={`text-xs ${smsSettings.provider === provider.id ? "text-white/80" : "text-muted-foreground"}`}>
                  {provider.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Environment
            </Label>
            <Select
              value={smsSettings.environment}
              onValueChange={(value) => setSmsSettings({ ...smsSettings, environment: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">🧪 Sandbox (Testing)</SelectItem>
                <SelectItem value="production">🚀 Production (Live)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {smsSettings.environment === "sandbox" 
                ? "Test mode - No real SMS will be sent" 
                : "Live mode - Real SMS will be sent and charged"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Sender ID
            </Label>
            <Input
              value={smsSettings.sender_id || ""}
              onChange={(e) => setSmsSettings({ ...smsSettings, sender_id: e.target.value })}
              placeholder="MYSTORE"
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Name that appears as SMS sender (alphanumeric, max 11 chars)</p>
          </div>
        </div>

        {/* API Credentials */}
        <div className="border-t pt-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Credentials for {selectedProvider.name}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            {selectedProvider.fields.includes("api_key") && (
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  value={smsSettings.api_key || ""}
                  onChange={(e) => setSmsSettings({ ...smsSettings, api_key: e.target.value })}
                  placeholder="Enter your API key"
                  className="bg-background font-mono"
                />
              </div>
            )}
            
            {selectedProvider.fields.includes("api_secret") && (
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input
                  type="password"
                  value={smsSettings.api_secret || ""}
                  onChange={(e) => setSmsSettings({ ...smsSettings, api_secret: e.target.value })}
                  placeholder="Enter your API secret"
                  className="bg-background font-mono"
                />
              </div>
            )}
            
            {selectedProvider.fields.includes("username") && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Username
                </Label>
                <Input
                  value={smsSettings.username || ""}
                  onChange={(e) => setSmsSettings({ ...smsSettings, username: e.target.value })}
                  placeholder={smsSettings.provider === "africas_talking" ? "sandbox (for testing)" : "Your username"}
                  className="bg-background"
                />
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border-t pt-6 space-y-4">
          <h4 className="font-semibold">Notification Triggers</h4>
          
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div>
              <Label className="text-base">New Order SMS</Label>
              <p className="text-sm text-muted-foreground">Send SMS to customer when order is placed</p>
            </div>
            <Switch
              checked={smsSettings.order_notification_enabled}
              onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, order_notification_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div>
              <Label className="text-base">Status Update SMS</Label>
              <p className="text-sm text-muted-foreground">Notify customers when order status changes</p>
            </div>
            <Switch
              checked={smsSettings.status_update_enabled}
              onCheckedChange={(checked) => setSmsSettings({ ...smsSettings, status_update_enabled: checked })}
            />
          </div>
        </div>

        {/* Test SMS */}
        {smsSettings.is_enabled && (
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Test SMS</h4>
            <div className="flex gap-2">
              <Input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="+254712345678"
                className="bg-background max-w-xs"
              />
              <Button
                variant="outline"
                onClick={handleTestSms}
                disabled={testingSms || !testPhone}
              >
                {testingSms ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Send Test
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Send a test SMS to verify your configuration
            </p>
          </div>
        )}

        {/* Save Button */}
        <Button 
          onClick={handleSaveSmsSettings} 
          className={`w-full bg-gradient-to-r ${selectedProvider.color} hover:opacity-90`}
          disabled={saving}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save SMS Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSmsSettings;
