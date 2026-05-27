import { supabase } from "@/integrations/supabase/client";

export interface OrderLineInput {
  productId: string | null;
  productName: string;
  supplierEmail?: string | null;
  quantity: number;
  unitPrice: number;
}

export async function createOrderItems(orderId: string, lines: OrderLineInput[]) {
  if (!orderId || lines.length === 0) return;
  const rows = lines.map((line) => ({
    order_id: orderId,
    product_id: line.productId,
    product_name: line.productName,
    supplier_email: line.supplierEmail || null,
    quantity: line.quantity,
    unit_price: line.unitPrice,
    line_total: line.unitPrice * line.quantity,
  }));
  const { error } = await supabase.from("order_items" as any).insert(rows);
  if (error) throw error;
}

export async function notifySuppliersForOrder(opts: {
  orderId: string;
  orderNumber: string;
  customerName: string;
  total: number;
  origin: string;
  lines: OrderLineInput[];
}) {
  const supplierEmails = Array.from(
    new Set(opts.lines.map((line) => line.supplierEmail?.trim().toLowerCase()).filter(Boolean) as string[])
  );
  if (supplierEmails.length === 0) return;

  const quickLink = `${opts.origin}/supplier?order=${encodeURIComponent(opts.orderNumber)}`;
  const notificationRows = supplierEmails.map((email) => {
    const supplierLines = opts.lines.filter((line) => line.supplierEmail?.trim().toLowerCase() === email);
    return {
      supplier_email: email,
      order_id: opts.orderId,
      order_number: opts.orderNumber,
      product_id: supplierLines[0]?.productId || null,
      product_name: supplierLines.map((line) => `${line.productName} × ${line.quantity}`).join(", "),
      message: `New order ${opts.orderNumber} from ${opts.customerName}. Prepare: ${supplierLines.map((line) => `${line.productName} × ${line.quantity}`).join(", ")}. Total order value: KES ${opts.total.toLocaleString()}.`,
      quick_link: quickLink,
      channel: "email",
      status: "pending",
    };
  });

  await supabase.from("supplier_notifications" as any).insert(notificationRows);

  await Promise.allSettled(
    supplierEmails.map((email) =>
      supabase.functions.invoke("send-order-email", {
        body: {
          orderId: opts.orderId,
          type: "supplier_notification",
          email,
          supplierQuickLink: quickLink,
        },
      })
    )
  );
}