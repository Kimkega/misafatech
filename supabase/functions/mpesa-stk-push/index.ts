import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface STKPushRequest {
  phone: string;
  amount: number;
  orderId: string;
  accountReference: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get M-Pesa settings from database
    const { data: mpesaSettings, error: settingsError } = await supabase
      .from("mpesa_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError || !mpesaSettings) {
      console.error("Failed to fetch M-Pesa settings:", settingsError);
      throw new Error("M-Pesa settings not configured");
    }

    if (!mpesaSettings.is_enabled) {
      throw new Error("M-Pesa Express is not enabled");
    }

    if (!mpesaSettings.consumer_key || !mpesaSettings.consumer_secret || !mpesaSettings.shortcode || !mpesaSettings.passkey) {
      throw new Error("M-Pesa credentials incomplete. Please configure all Daraja API credentials.");
    }

    const { phone, amount, orderId, accountReference }: STKPushRequest = await req.json();

    if (!phone || !amount || !orderId) {
      throw new Error("Missing required fields: phone, amount, orderId");
    }

    // Format phone number (remove + and ensure starts with 254)
    let formattedPhone = phone.replace(/\s+/g, "").replace(/[^0-9]/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith("254")) {
      formattedPhone = "254" + formattedPhone;
    }

    console.log("Formatted phone:", formattedPhone);

    // Determine API base URL based on environment
    const isProduction = mpesaSettings.environment === "production";
    const baseUrl = isProduction 
      ? "https://api.safaricom.co.ke" 
      : "https://sandbox.safaricom.co.ke";

    // Get OAuth token
    const auth = btoa(`${mpesaSettings.consumer_key}:${mpesaSettings.consumer_secret}`);
    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${auth}`,
      },
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token error:", errorText);
      throw new Error("Failed to get M-Pesa access token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    console.log("Got access token successfully");

    // Generate timestamp (YYYYMMDDHHmmss)
    const now = new Date();
    const timestamp = now.toISOString()
      .replace(/[-:T]/g, "")
      .replace(/\.\d{3}Z$/, "")
      .substring(0, 14);

    // Generate password
    const password = btoa(`${mpesaSettings.shortcode}${mpesaSettings.passkey}${timestamp}`);

    // Get callback URL from settings or use default
    const callbackUrl = mpesaSettings.callback_url || 
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/mpesa-callback`;

    // Determine transaction type based on payment type
    // For Paybill: CustomerPayBillOnline
    // For Till (Buy Goods): CustomerBuyGoodsOnline
    const commandID = mpesaSettings.payment_type === "till" 
      ? "CustomerBuyGoodsOnline" 
      : "CustomerPayBillOnline";

    const stkPayload = {
      BusinessShortCode: mpesaSettings.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: commandID,
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: mpesaSettings.shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference || orderId.substring(0, 12),
      TransactionDesc: `Payment for order ${orderId}`,
    };

    console.log("STK Push payload:", JSON.stringify(stkPayload, null, 2));

    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkResult = await stkResponse.json();
    console.log("STK Push response:", JSON.stringify(stkResult, null, 2));

    if (stkResult.ResponseCode === "0") {
      // Update order with checkout request ID
      await supabase
        .from("orders")
        .update({ 
          payment_status: "processing",
          mpesa_receipt: stkResult.CheckoutRequestID 
        })
        .eq("id", orderId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "STK push sent successfully. Check your phone for the M-Pesa prompt.",
          checkoutRequestId: stkResult.CheckoutRequestID,
          merchantRequestId: stkResult.MerchantRequestID,
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    } else {
      console.error("STK Push failed:", stkResult);
      throw new Error(stkResult.errorMessage || stkResult.ResponseDescription || "STK push failed");
    }
  } catch (error: any) {
    console.error("M-Pesa STK Push error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
