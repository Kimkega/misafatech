// Centralized WhatsApp message builders — clean formatting, no clutter.
// Inquiries always nudge the customer to order on the website so an invoice is auto-generated.

const cleanPhone = (n: string) => n.replace(/[^0-9]/g, "");

const siteOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "";

export function openWhatsApp(whatsappNumber: string, text: string) {
  const phone = cleanPhone(whatsappNumber);
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
}

/**
 * Friendly product inquiry that always redirects the buyer to the website
 * so the order is created and an invoice/receipt is generated automatically.
 */
export function buildInquiryMessage(opts: {
  productName: string;
  price?: number;
  category?: string;
  productUrl?: string;
}) {
  const url = opts.productUrl || siteOrigin();
  const lines = [
    `Hello Misafa Technologies 👋`,
    ``,
    `I'd like to order:`,
    `• ${opts.productName}${opts.price ? `  —  KES ${opts.price.toLocaleString()}` : ""}`,
    opts.category ? `• Category: ${opts.category}` : null,
    ``,
    `Could you confirm availability? I'll place the order on your website so I receive an official invoice & receipt:`,
    url,
    ``,
    `Thank you!`,
  ].filter(Boolean);
  return lines.join("\n");
}

export function buildSolarInquiryMessage(summary: string) {
  const url = siteOrigin();
  return [
    `Hello Misafa Technologies ☀️`,
    ``,
    `I'd like a custom solar quote:`,
    summary,
    ``,
    `Please send the quote so I can place the order on your website for an official invoice & receipt:`,
    url,
    ``,
    `Thank you!`,
  ].join("\n");
}

/** Clean invoice message — no asterisks, no JSON dump. */
export function buildInvoiceMessage(opts: {
  orderNumber: string;
  invoiceUrl: string;
  customerName: string;
  customerPhone: string;
  itemsSummary: string; // e.g. "Solar Panel 250W × 2"
  total: number;
  deliverTo: string;
  carrier?: string;
  paymentMethod?: string;
}) {
  return [
    `Hello Misafa Technologies 👋`,
    ``,
    `I've just placed an order on your website.`,
    ``,
    `Order:        ${opts.orderNumber}`,
    `Item(s):      ${opts.itemsSummary}`,
    `Total:        KES ${opts.total.toLocaleString()}`,
    `Deliver to:   ${opts.deliverTo}`,
    opts.carrier ? `Carrier:      ${opts.carrier}` : null,
    opts.paymentMethod ? `Payment:      ${opts.paymentMethod}` : null,
    ``,
    `Invoice & payment link:`,
    opts.invoiceUrl,
    ``,
    `— ${opts.customerName} · ${opts.customerPhone}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildPaymentConfirmationMessage(opts: {
  orderNumber: string;
  invoiceUrl: string;
  itemName: string;
  total: number;
  customerName: string;
}) {
  return [
    `Hello Misafa Technologies 👋`,
    ``,
    `Payment confirmation for order ${opts.orderNumber}.`,
    ``,
    `Item:    ${opts.itemName}`,
    `Total:   KES ${opts.total.toLocaleString()}`,
    ``,
    `Invoice: ${opts.invoiceUrl}`,
    ``,
    `I have paid. Please confirm and proceed with delivery.`,
    ``,
    `— ${opts.customerName}`,
  ].join("\n");
}
