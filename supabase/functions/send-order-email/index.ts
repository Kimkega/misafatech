import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  orderId: string;
  type: "admin_notification" | "customer_confirmation";
  email: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { orderId, type, email }: EmailRequest = await req.json();

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // Get email settings
    const { data: emailSettings, error: emailSettingsError } = await supabase
      .from("email_settings")
      .select("*")
      .limit(1)
      .single();

    if (emailSettingsError || !emailSettings) {
      throw new Error("Email settings not configured");
    }

    if (!emailSettings.smtp_host || !emailSettings.smtp_user || !emailSettings.smtp_password) {
      console.log("SMTP not configured, skipping email");
      return new Response(
        JSON.stringify({ success: false, message: "SMTP not configured" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get site settings for branding
    const { data: siteSettings } = await supabase
      .from("site_settings")
      .select("site_name")
      .limit(1)
      .single();

    const siteName = siteSettings?.site_name || "Store";
    const fromEmail = emailSettings.from_email || emailSettings.smtp_user;
    const fromName = emailSettings.from_name || siteName;

    let subject = "";
    let htmlContent = "";

    if (type === "admin_notification") {
      subject = `New Order Received - ${order.order_number}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .total { font-size: 1.25rem; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛒 New Order Received!</h1>
              <p>Order: ${order.order_number}</p>
            </div>
            <div class="content">
              <div class="order-details">
                <div class="detail-row"><span>Customer:</span> <strong>${order.customer_name}</strong></div>
                <div class="detail-row"><span>Phone:</span> <strong>${order.customer_phone}</strong></div>
                ${order.customer_email ? `<div class="detail-row"><span>Email:</span> <strong>${order.customer_email}</strong></div>` : ""}
                <div class="detail-row"><span>Product:</span> <strong>${order.product_name}</strong></div>
                <div class="detail-row"><span>Quantity:</span> <strong>${order.quantity}</strong></div>
                <div class="detail-row"><span>Payment Method:</span> <strong>${order.payment_method}</strong></div>
                <div class="detail-row"><span>Payment Status:</span> <strong>${order.payment_status}</strong></div>
                ${order.mpesa_receipt ? `<div class="detail-row"><span>M-Pesa Receipt:</span> <strong>${order.mpesa_receipt}</strong></div>` : ""}
                ${order.shipping_address ? `<div class="detail-row"><span>Shipping:</span> <strong>${order.shipping_address}</strong></div>` : ""}
                ${order.notes ? `<div class="detail-row"><span>Notes:</span> <strong>${order.notes}</strong></div>` : ""}
                <div class="detail-row total"><span>Total Amount:</span> <strong>KES ${order.total_amount.toLocaleString()}</strong></div>
              </div>
              <p>Please process this order promptly.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      subject = `Order Confirmation - ${order.order_number}`;
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
            .total { font-size: 1.25rem; font-weight: bold; color: #059669; margin-top: 15px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 0.875rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmed!</h1>
              <p>Thank you for your order, ${order.customer_name}!</p>
            </div>
            <div class="content">
              <p>Your order has been received and is being processed.</p>
              <div class="order-details">
                <div class="detail-row"><strong>Order Number:</strong> ${order.order_number}</div>
                <div class="detail-row"><strong>Product:</strong> ${order.product_name}</div>
                <div class="detail-row"><strong>Quantity:</strong> ${order.quantity}</div>
                ${order.shipping_address ? `<div class="detail-row"><strong>Delivery Address:</strong> ${order.shipping_address}</div>` : ""}
                <div class="total">Total: KES ${order.total_amount.toLocaleString()}</div>
              </div>
              <p>We will notify you once your order is shipped.</p>
              <p>If you have any questions, please contact us.</p>
            </div>
            <div class="footer">
              <p>Thank you for shopping with ${siteName}!</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send email using SMTP
    // Using a simple SMTP approach with Deno
    const smtpConfig = {
      host: emailSettings.smtp_host,
      port: emailSettings.smtp_port || 587,
      user: emailSettings.smtp_user,
      password: emailSettings.smtp_password,
    };

    // For now, log the email that would be sent
    // In production, you'd integrate with an email service like Resend, SendGrid, or SMTP
    console.log("Email would be sent:", {
      from: `${fromName} <${fromEmail}>`,
      to: email,
      subject,
      html: htmlContent.substring(0, 200) + "...",
    });

    // You can integrate with Resend or other email providers here
    // For demonstration, we'll return success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email notification logged",
        to: email,
        subject,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Send order email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
