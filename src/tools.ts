import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StripeClient } from "./client.js";
import {
  CreateCustomerSchema, GetCustomerSchema, UpdateCustomerSchema, ListCustomersSchema, DeleteCustomerSchema,
  CreateProductSchema, GetProductSchema, ListProductsSchema,
  CreatePriceSchema, GetPriceSchema, ListPricesSchema,
  CreateSubscriptionSchema, GetSubscriptionSchema, CancelSubscriptionSchema, ListSubscriptionsSchema,
  GetInvoiceSchema, ListInvoicesSchema,
  GetBalanceSchema,
} from "./schemas.js";

export function registerTools(server: McpServer): void {
  let _client: StripeClient | null = null;
  const getClient = () => {
    if (!_client) _client = new StripeClient();
    return _client;
  };

  // ============================================================
  // Customer Tools
  // ============================================================

  server.tool("stripe_create_customer", "Create a new Stripe customer.", CreateCustomerSchema.shape, async ({ email, name, phone, description }) => {
    try {
      const result = await getClient().createCustomer(email, name, phone, description);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, customer: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_get_customer", "Get customer details by ID.", GetCustomerSchema.shape, async ({ customerId }) => {
    try {
      const result = await getClient().getCustomer(customerId);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_update_customer", "Update customer properties.", UpdateCustomerSchema.shape, async ({ customerId, email, name, phone, description }) => {
    try {
      const result = await getClient().updateCustomer(customerId, email, name, phone, description);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, customer: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_list_customers", "List customers with optional filters.", ListCustomersSchema.shape, async ({ limit, startingAfter, email }) => {
    try {
      const result = await getClient().listCustomers(limit, startingAfter, email);
      return { content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, hasMore: result.has_more, customers: result.data }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_delete_customer", "Delete a customer.", DeleteCustomerSchema.shape, async ({ customerId }) => {
    try {
      const result = await getClient().deleteCustomer(customerId);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, deleted: result.deleted, id: result.id }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  // ============================================================
  // Product Tools
  // ============================================================

  server.tool("stripe_create_product", "Create a new product.", CreateProductSchema.shape, async ({ name, description, active }) => {
    try {
      const result = await getClient().createProduct(name, description, active);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, product: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_get_product", "Get product details by ID.", GetProductSchema.shape, async ({ productId }) => {
    try {
      const result = await getClient().getProduct(productId);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_list_products", "List products with optional filters.", ListProductsSchema.shape, async ({ limit, active }) => {
    try {
      const result = await getClient().listProducts(limit, active);
      return { content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, hasMore: result.has_more, products: result.data }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  // ============================================================
  // Price Tools
  // ============================================================

  server.tool("stripe_create_price", "Create a new price for a product.", CreatePriceSchema.shape, async ({ productId, unitAmount, currency, recurringInterval }) => {
    try {
      const result = await getClient().createPrice(productId, unitAmount, currency, recurringInterval);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, price: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_get_price", "Get price details by ID.", GetPriceSchema.shape, async ({ priceId }) => {
    try {
      const result = await getClient().getPrice(priceId);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_list_prices", "List prices with optional filters.", ListPricesSchema.shape, async ({ productId, active, limit }) => {
    try {
      const result = await getClient().listPrices(productId, active, limit);
      return { content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, hasMore: result.has_more, prices: result.data }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  // ============================================================
  // Subscription Tools
  // ============================================================

  server.tool("stripe_create_subscription", "Create a new subscription.", CreateSubscriptionSchema.shape, async ({ customerId, priceId }) => {
    try {
      const result = await getClient().createSubscription(customerId, priceId);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, subscription: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_get_subscription", "Get subscription details by ID.", GetSubscriptionSchema.shape, async ({ subscriptionId }) => {
    try {
      const result = await getClient().getSubscription(subscriptionId);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_cancel_subscription", "Cancel a subscription.", CancelSubscriptionSchema.shape, async ({ subscriptionId }) => {
    try {
      const result = await getClient().cancelSubscription(subscriptionId);
      return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, status: result.status, subscription: result }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_list_subscriptions", "List subscriptions with optional filters.", ListSubscriptionsSchema.shape, async ({ customerId, status, limit }) => {
    try {
      const result = await getClient().listSubscriptions(customerId, status, limit);
      return { content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, hasMore: result.has_more, subscriptions: result.data }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  // ============================================================
  // Invoice Tools
  // ============================================================

  server.tool("stripe_get_invoice", "Get invoice details by ID.", GetInvoiceSchema.shape, async ({ invoiceId }) => {
    try {
      const result = await getClient().getInvoice(invoiceId);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  server.tool("stripe_list_invoices", "List invoices with optional filters.", ListInvoicesSchema.shape, async ({ customerId, status, limit }) => {
    try {
      const result = await getClient().listInvoices(customerId, status, limit);
      return { content: [{ type: "text" as const, text: JSON.stringify({ total: result.data.length, hasMore: result.has_more, invoices: result.data }, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });

  // ============================================================
  // Balance Tool
  // ============================================================

  server.tool("stripe_get_balance", "Get current account balance.", GetBalanceSchema.shape, async () => {
    try {
      const result = await getClient().getBalance();
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    } catch (error) { return errorResult(error); }
  });
}

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : "An unknown error occurred";
  return { content: [{ type: "text" as const, text: `Error: ${message}` }], isError: true };
}
