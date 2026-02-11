import { z } from "zod";

// ============================================================
// Customer Schemas
// ============================================================

export const CreateCustomerSchema = z.object({
  email: z.string().optional().describe("Customer email address"),
  name: z.string().optional().describe("Customer full name"),
  phone: z.string().optional().describe("Customer phone number"),
  description: z.string().optional().describe("Description of the customer"),
});

export const GetCustomerSchema = z.object({
  customerId: z.string().describe("Stripe customer ID (cus_xxx)"),
});

export const UpdateCustomerSchema = z.object({
  customerId: z.string().describe("Stripe customer ID to update"),
  email: z.string().optional().describe("Updated email address"),
  name: z.string().optional().describe("Updated full name"),
  phone: z.string().optional().describe("Updated phone number"),
  description: z.string().optional().describe("Updated description"),
});

export const ListCustomersSchema = z.object({
  limit: z.number().optional().describe("Maximum number of customers to return (1-100, default 10)"),
  startingAfter: z.string().optional().describe("Cursor for pagination - customer ID to start after"),
  email: z.string().optional().describe("Filter by exact email address"),
});

export const DeleteCustomerSchema = z.object({
  customerId: z.string().describe("Stripe customer ID to delete"),
});

// ============================================================
// Product Schemas
// ============================================================

export const CreateProductSchema = z.object({
  name: z.string().describe("Product name"),
  description: z.string().optional().describe("Product description"),
  active: z.boolean().optional().describe("Whether the product is available for purchase"),
});

export const GetProductSchema = z.object({
  productId: z.string().describe("Stripe product ID (prod_xxx)"),
});

export const ListProductsSchema = z.object({
  limit: z.number().optional().describe("Maximum number of products to return (1-100)"),
  active: z.boolean().optional().describe("Filter by active status"),
});

// ============================================================
// Price Schemas
// ============================================================

export const CreatePriceSchema = z.object({
  productId: z.string().describe("Product ID to create a price for"),
  unitAmount: z.number().describe("Price amount in smallest currency unit (e.g. cents). 5000 = $50.00"),
  currency: z.string().describe("Three-letter ISO currency code (e.g. usd, eur, jpy)"),
  recurringInterval: z.string().optional().describe("Billing interval for subscriptions: day, week, month, or year"),
});

export const GetPriceSchema = z.object({
  priceId: z.string().describe("Stripe price ID (price_xxx)"),
});

export const ListPricesSchema = z.object({
  productId: z.string().optional().describe("Filter prices by product ID"),
  active: z.boolean().optional().describe("Filter by active status"),
  limit: z.number().optional().describe("Maximum number of prices to return (1-100)"),
});

// ============================================================
// Subscription Schemas
// ============================================================

export const CreateSubscriptionSchema = z.object({
  customerId: z.string().describe("Customer ID for the subscription"),
  priceId: z.string().describe("Price ID for the subscription item"),
});

export const GetSubscriptionSchema = z.object({
  subscriptionId: z.string().describe("Stripe subscription ID (sub_xxx)"),
});

export const CancelSubscriptionSchema = z.object({
  subscriptionId: z.string().describe("Stripe subscription ID to cancel"),
});

export const ListSubscriptionsSchema = z.object({
  customerId: z.string().optional().describe("Filter by customer ID"),
  status: z.string().optional().describe("Filter by status: active, canceled, incomplete, past_due, trialing, unpaid"),
  limit: z.number().optional().describe("Maximum number of subscriptions to return (1-100)"),
});

// ============================================================
// Invoice Schemas
// ============================================================

export const GetInvoiceSchema = z.object({
  invoiceId: z.string().describe("Stripe invoice ID (in_xxx)"),
});

export const ListInvoicesSchema = z.object({
  customerId: z.string().optional().describe("Filter by customer ID"),
  status: z.string().optional().describe("Filter by status: draft, open, paid, uncollectible, void"),
  limit: z.number().optional().describe("Maximum number of invoices to return (1-100)"),
});

// ============================================================
// Balance Schema
// ============================================================

export const GetBalanceSchema = z.object({});
