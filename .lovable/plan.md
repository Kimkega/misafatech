# Implementation Plan

## 1. WhatsApp inquiry → website purchase funnel
- Rewrite all WhatsApp inquiry buttons (ProductCard, ProductDetails, EnergyCalculator, Contact, Hero "Talk to expert") so the message politely directs the customer to **buy on the website** so an invoice is auto-generated.
- Example tone: "Hi! I'm interested in [Product]. Could you share availability? I'll place the order on your website so I get an invoice & receipt."
- The "Send Invoice via WhatsApp" flow stays as-is (post-order), but the message body is cleaned up.

## 2. Clean invoice WhatsApp message
Current message uses `*bold*`, brackets and a raw JSON dump that looks noisy. New format:

```
Hello Misafa Technologies 👋

I've just placed an order on your website.

Order: ORD-20260118-XXXX
Item:  Solar Panel 250W × 2
Total: KES 45,000
Deliver to: Westlands, Nairobi
Carrier: G4S Courier

Invoice & payment link:
https://misafatech.com/invoice/ORD-20260118-XXXX

— John Doe · 0712 345 678
```

Drop the raw JSON block from the user-facing message (keep it only in DB/email for admin). Use clean line breaks, emoji sparingly, no `***` clutter.

## 3. Supplier Portal (biggest piece)
**DB migration:**
- New enum value `'supplier'` on `app_role`
- `products.supplier_email TEXT` (nullable)
- `suppliers` table: `id, user_id, email, full_name, phone, company, created_at` + RLS (admin manage, supplier reads own)
- Update orders RLS so suppliers can read orders whose `product_id` belongs to a product with their email
- Security-definer fn `is_supplier_of_product(_uid, _product_id)` to avoid recursion

**Admin:**
- New `AdminSuppliers` tab: list/create supplier (email + temp password via edge function using service role to `auth.admin.createUser`, then insert into `suppliers` + assign `supplier` role)
- Product form: add "Supplier Email" dropdown (populated from suppliers table)

**Supplier UI:**
- `/supplier` route — auth-guarded, only `supplier` role
- Shows only orders for their products; can mark `order_status` = processing / shipped / delivered
- Auth.tsx redirect: admin→/admin, supplier→/supplier, user→/

**Edge function:** `create-supplier` (service role) to provision auth user + role + record.

## 4. Layout: sidebar instead of top nav
- Build `AppSidebar` (shadcn sidebar) for the **storefront**: Home, Deals, Products, Solar & Energy, Contact, Cart, My Orders, Auth. Keep a thin top bar with logo + `SidebarTrigger` + cart icon. Collapsible to icon-only on mobile.
- Refactor `Admin.tsx` from top `Tabs` to a `SidebarProvider` + sidebar with the same sections (Stats, Orders, Products, Suppliers, Users, Shipping, SMS, Settings).

## 5. Energy Calculator placement
Move `<EnergyCalculator>` to render **inside / directly under** the "Solar & Energy" products section in `Index.tsx` (and in `ProductsSection` when that category is active), instead of as a standalone section between Products and Features.

## 6. Performance / caching / bandwidth
- Route-level **lazy loading** in `App.tsx` (`React.lazy` + `Suspense`) for Admin, Invoice, MyOrders, ProductDetails, Auth.
- `QueryClient` defaults: `staleTime: 5min`, `gcTime: 30min`, `refetchOnWindowFocus: false` to cut redundant requests.
- Wrap product/contact fetches in `useQuery` with stable keys so they're cached across pages instead of re-fetched on every mount.
- Image: add `loading="lazy"` and `decoding="async"` to all product `<img>` tags; add explicit width/height to reduce CLS.
- `vite.config.ts`: enable `build.cssCodeSplit`, manual chunk split for `react`, `@radix-ui`, `@supabase`, `recharts` to improve cache hit-rate on redeploys.
- `index.html`: preconnect to Supabase URL.
- Add `Cache-Control` headers via `vercel.json` for `/assets/*` (immutable, 1y) — already partially configured, verify.

---

## Order of execution
1. DB migration (suppliers, role enum, RLS, product column) — needs approval
2. `create-supplier` edge function + AdminSuppliers + product form update
3. `/supplier` page + Auth redirect
4. WhatsApp message rewrites + invoice format cleanup
5. Sidebar layouts (storefront + admin)
6. EnergyCalculator repositioning
7. Perf pass (lazy routes, QueryClient, vite chunks, image attrs)

Step 1 will prompt you for migration approval; everything else runs in sequence after.

## Notes / decisions to confirm
- Supplier passwords: admin sets a temp password in the create form, supplier changes it after first login. OK?
- Supplier permissions: read-only on orders + update `order_status` only (not delete). OK?
- Storefront sidebar: collapsed by default on mobile, expanded on desktop. OK?
