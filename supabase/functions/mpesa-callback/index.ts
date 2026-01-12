import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const callbackData = await req.json();
    console.log("M-Pesa Callback received:", JSON.stringify(callbackData, null, 2));

    const { Body } = callbackData;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    // Find the order by checkout request ID
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("mpesa_receipt", checkoutRequestId)
      .single();

    if (orderError || !order) {
      console.error("Order not found for checkout request:", checkoutRequestId);
      return new Response(JSON.stringify({ success: false }), { status: 200 });
    }

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      
      let mpesaReceiptNumber = "";
      let transactionDate = "";
      let phoneNumber = "";
      let amount = 0;

      callbackMetadata.forEach((item: any) => {
        switch (item.Name) {
          case "MpesaReceiptNumber":
            mpesaReceiptNumber = item.Value;
            break;
          case "TransactionDate":
            transactionDate = item.Value?.toString();
            break;
          case "PhoneNumber":
            phoneNumber = item.Value?.toString();
            break;
          case "Amount":
            amount = item.Value;
            break;
        }
      });

      console.log("Payment successful:", { mpesaReceiptNumber, amount, phoneNumber });

      // Update order status
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          order_status: "confirmed",
          mpesa_receipt: mpesaReceiptNumber,
        })
        .eq("id", order.id);

      // Send email notification if enabled
      const { data: emailSettings } = await supabase
        .from("email_settings")
        .select("*")
        .limit(1)
        .single();

      if (emailSettings?.order_notification_enabled && emailSettings?.admin_email) {
        try {
          await supabase.functions.invoke("send-order-email", {
            body: {
              orderId: order.id,
              type: "admin_notification",
              email: emailSettings.admin_email,
            },
          });
        } catch (emailError) {
          console.error("Failed to send admin email:", emailError);
        }
      }

      if (emailSettings?.customer_notification_enabled && order.customer_email) {
        try {
          await supabase.functions.invoke("send-order-email", {
            body: {
              orderId: order.id,
              type: "customer_confirmation",
              email: order.customer_email,
            },
          });
        } catch (emailError) {
          console.error("Failed to send customer email:", emailError);
        }
      }
    } else {
      // Payment failed
      console.log("Payment failed:", resultDesc);
      
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
          notes: `Payment failed: ${resultDesc}`,
        })
        .eq("id", order.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("M-Pesa callback error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
