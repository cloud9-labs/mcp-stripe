const BASE_URL = "https://api.stripe.com/v1";

/**
 * Stripe API Client
 *
 * Reads secret key from the STRIPE_SECRET_KEY environment variable.
 * Uses form-encoded bodies (application/x-www-form-urlencoded) for POST.
 * Rate limiting: 25 req/sec with sliding window and 429 retry.
 */
export class StripeClient {
  private readonly secretKey: string;
  private requestTimestamps: number[] = [];

  constructor() {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY environment variable is not set. " +
          "Get your secret key from https://dashboard.stripe.com/apikeys"
      );
    }
    this.secretKey = key;
  }

  private async throttle(): Promise<void> {
    const now = Date.now();
    const windowMs = 1_000;
    const maxRequests = 25;

    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => now - ts < windowMs
    );

    if (this.requestTimestamps.length >= maxRequests) {
      const oldest = this.requestTimestamps[0];
      const waitMs = windowMs - (now - oldest) + 50;
      if (waitMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }

    this.requestTimestamps.push(Date.now());
  }

  private async request<T>(
    method: string,
    path: string,
    params?: Record<string, string | undefined>
  ): Promise<T> {
    await this.throttle();

    let url = `${BASE_URL}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    const options: RequestInit = { method, headers };

    if (params) {
      const filtered = Object.entries(params).filter(
        ([, v]) => v !== undefined
      ) as [string, string][];

      if (method === "GET" || method === "DELETE") {
        if (filtered.length > 0) {
          url += `?${new URLSearchParams(filtered).toString()}`;
        }
      } else {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        options.body = new URLSearchParams(filtered).toString();
      }
    }

    const res = await fetch(url, options);

    if (res.status === 429) {
      const retryAfter = res.headers.get("Retry-After");
      const waitSec = retryAfter ? Number(retryAfter) : 2;
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      return this.request<T>(method, path, params);
    }

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(
        `Stripe API error (${res.status} ${res.statusText}): ${errorBody}`
      );
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  }

  // ----------------------------------------------------------
  // Customer Operations
  // ----------------------------------------------------------

  async createCustomer(
    email?: string,
    name?: string,
    phone?: string,
    description?: string
  ): Promise<StripeCustomer> {
    return this.request<StripeCustomer>("POST", "/customers", {
      email, name, phone, description,
    });
  }

  async getCustomer(customerId: string): Promise<StripeCustomer> {
    return this.request<StripeCustomer>("GET", `/customers/${customerId}`);
  }

  async updateCustomer(
    customerId: string,
    email?: string,
    name?: string,
    phone?: string,
    description?: string
  ): Promise<StripeCustomer> {
    return this.request<StripeCustomer>("POST", `/customers/${customerId}`, {
      email, name, phone, description,
    });
  }

  async listCustomers(
    limit?: number,
    startingAfter?: string,
    email?: string
  ): Promise<StripeList<StripeCustomer>> {
    return this.request<StripeList<StripeCustomer>>("GET", "/customers", {
      limit: limit ? String(limit) : undefined,
      starting_after: startingAfter,
      email,
    });
  }

  async deleteCustomer(customerId: string): Promise<StripeDeleteResult> {
    return this.request<StripeDeleteResult>("DELETE", `/customers/${customerId}`);
  }

  // ----------------------------------------------------------
  // Product Operations
  // ----------------------------------------------------------

  async createProduct(
    name: string,
    description?: string,
    active?: boolean
  ): Promise<StripeProduct> {
    return this.request<StripeProduct>("POST", "/products", {
      name,
      description,
      active: active !== undefined ? String(active) : undefined,
    });
  }

  async getProduct(productId: string): Promise<StripeProduct> {
    return this.request<StripeProduct>("GET", `/products/${productId}`);
  }

  async listProducts(
    limit?: number,
    active?: boolean
  ): Promise<StripeList<StripeProduct>> {
    return this.request<StripeList<StripeProduct>>("GET", "/products", {
      limit: limit ? String(limit) : undefined,
      active: active !== undefined ? String(active) : undefined,
    });
  }

  // ----------------------------------------------------------
  // Price Operations
  // ----------------------------------------------------------

  async createPrice(
    productId: string,
    unitAmount: number,
    currency: string,
    recurringInterval?: string
  ): Promise<StripePrice> {
    const params: Record<string, string | undefined> = {
      product: productId,
      unit_amount: String(unitAmount),
      currency,
    };
    if (recurringInterval) {
      params["recurring[interval]"] = recurringInterval;
    }
    return this.request<StripePrice>("POST", "/prices", params);
  }

  async getPrice(priceId: string): Promise<StripePrice> {
    return this.request<StripePrice>("GET", `/prices/${priceId}`);
  }

  async listPrices(
    productId?: string,
    active?: boolean,
    limit?: number
  ): Promise<StripeList<StripePrice>> {
    return this.request<StripeList<StripePrice>>("GET", "/prices", {
      product: productId,
      active: active !== undefined ? String(active) : undefined,
      limit: limit ? String(limit) : undefined,
    });
  }

  // ----------------------------------------------------------
  // Subscription Operations
  // ----------------------------------------------------------

  async createSubscription(
    customerId: string,
    priceId: string
  ): Promise<StripeSubscription> {
    return this.request<StripeSubscription>("POST", "/subscriptions", {
      customer: customerId,
      "items[0][price]": priceId,
    });
  }

  async getSubscription(subscriptionId: string): Promise<StripeSubscription> {
    return this.request<StripeSubscription>("GET", `/subscriptions/${subscriptionId}`);
  }

  async cancelSubscription(subscriptionId: string): Promise<StripeSubscription> {
    return this.request<StripeSubscription>("DELETE", `/subscriptions/${subscriptionId}`);
  }

  async listSubscriptions(
    customerId?: string,
    status?: string,
    limit?: number
  ): Promise<StripeList<StripeSubscription>> {
    return this.request<StripeList<StripeSubscription>>("GET", "/subscriptions", {
      customer: customerId,
      status,
      limit: limit ? String(limit) : undefined,
    });
  }

  // ----------------------------------------------------------
  // Invoice Operations
  // ----------------------------------------------------------

  async getInvoice(invoiceId: string): Promise<StripeInvoice> {
    return this.request<StripeInvoice>("GET", `/invoices/${invoiceId}`);
  }

  async listInvoices(
    customerId?: string,
    status?: string,
    limit?: number
  ): Promise<StripeList<StripeInvoice>> {
    return this.request<StripeList<StripeInvoice>>("GET", "/invoices", {
      customer: customerId,
      status,
      limit: limit ? String(limit) : undefined,
    });
  }

  // ----------------------------------------------------------
  // Balance
  // ----------------------------------------------------------

  async getBalance(): Promise<StripeBalance> {
    return this.request<StripeBalance>("GET", "/balance");
  }
}

// ============================================================
// Response Types
// ============================================================

export interface StripeCustomer {
  id: string;
  object: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  description: string | null;
  created: number;
  metadata: Record<string, string>;
}

export interface StripeProduct {
  id: string;
  object: string;
  name: string;
  description: string | null;
  active: boolean;
  created: number;
  metadata: Record<string, string>;
}

export interface StripePrice {
  id: string;
  object: string;
  product: string;
  unit_amount: number | null;
  currency: string;
  active: boolean;
  recurring: { interval: string; interval_count: number } | null;
  created: number;
}

export interface StripeSubscription {
  id: string;
  object: string;
  customer: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  created: number;
  items: { data: Array<{ id: string; price: StripePrice }> };
}

export interface StripeInvoice {
  id: string;
  object: string;
  customer: string;
  status: string;
  amount_due: number;
  amount_paid: number;
  currency: string;
  created: number;
}

export interface StripeBalance {
  object: string;
  available: Array<{ amount: number; currency: string }>;
  pending: Array<{ amount: number; currency: string }>;
}

export interface StripeDeleteResult {
  id: string;
  object: string;
  deleted: boolean;
}

export interface StripeList<T> {
  object: string;
  data: T[];
  has_more: boolean;
  url: string;
}
