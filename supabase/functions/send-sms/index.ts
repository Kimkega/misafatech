import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SmsRequest {
  phone: string;
  message: string;
  orderId?: string;
  type?: "order_placed" | "status_update" | "payment_confirmed";
}

interface SmsSettings {
  provider: string;
  is_enabled: boolean;
  api_key: string | null;
  username: string | null;
  sender_id: string | null;
  environment: string;
  order_notification_enabled: boolean;
  status_update_enabled: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("SMS function invoked", req.method);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { phone, message, orderId, type }: SmsRequest = await req.json();

    if (!phone || !message) {
      return new Response(
        JSON.stringify({ error: "Phone and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Sending SMS to ${phone}, type: ${type}, orderId: ${orderId}`);

    // Fetch SMS settings
    const { data: smsSettings, error: settingsError } = await supabase
      .from("sms_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError || !smsSettings) {
      console.error("Failed to fetch SMS settings:", settingsError);
      return new Response(
        JSON.stringify({ error: "SMS settings not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const settings = smsSettings as SmsSettings;

    if (!settings.is_enabled) {
      console.log("SMS is disabled in settings");
      return new Response(
        JSON.stringify({ success: false, message: "SMS notifications are disabled" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Check notification type settings
    if (type === "order_placed" && !settings.order_notification_enabled) {
      console.log("Order notification SMS is disabled");
      return new Response(
        JSON.stringify({ success: false, message: "Order notification SMS disabled" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (type === "status_update" && !settings.status_update_enabled) {
      console.log("Status update SMS is disabled");
      return new Response(
        JSON.stringify({ success: false, message: "Status update SMS disabled" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Format phone number for Africa's Talking (must be in international format)
    let formattedPhone = phone.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+254" + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+" + formattedPhone;
    }

    console.log(`Formatted phone: ${formattedPhone}`);

    // Send via Africa's Talking
    if (settings.provider === "africastalking" && settings.api_key && settings.username) {
      const atEndpoint = settings.environment === "sandbox"
        ? "https://api.sandbox.africastalking.com/version1/messaging"
        : "https://api.africastalking.com/version1/messaging";

      const params = new URLSearchParams();
      params.append("username", settings.username);
      params.append("to", formattedPhone);
      params.append("message", message);
      if (settings.sender_id) {
        params.append("from", settings.sender_id);
      }

      console.log(`Sending to Africa's Talking: ${atEndpoint}`);

      const response = await fetch(atEndpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "apiKey": settings.api_key,
        },
        body: params.toString(),
      });

      const result = await response.json();
      console.log("Africa's Talking response:", JSON.stringify(result));

      if (result.SMSMessageData?.Recipients?.[0]?.status === "Success" ||
          result.SMSMessageData?.Recipients?.[0]?.statusCode === 101) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "SMS sent successfully",
            messageId: result.SMSMessageData?.Recipients?.[0]?.messageId
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } else {
        console.error("Africa's Talking error:", result);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: result.SMSMessageData?.Recipients?.[0]?.status || "Failed to send SMS",
            details: result
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    // Fallback: Log message if no provider configured
    console.log(`SMS would be sent (no provider): To: ${formattedPhone}, Message: ${message}`);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "SMS logged (provider not fully configured)",
        simulated: true
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("SMS function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
