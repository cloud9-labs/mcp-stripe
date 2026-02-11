# Stripe Payment MCP Server

A Model Context Protocol (MCP) server that provides full access to the Stripe payment API. Manage customers, products, prices, subscriptions, invoices, and account balance directly from Claude, Cursor, or any MCP-compatible client.

## Features

- **Customer Management** - Create, read, update, delete, and list customers
- **Product Management** - Create, read, and list products
- **Price Management** - Create one-time and recurring prices
- **Subscription Management** - Create, cancel, and list subscriptions
- **Invoice Access** - Retrieve and list invoices
- **Balance Info** - Check account balance across currencies
- **Built-in Rate Limiting** - Automatic throttling (25 req/s) with 429 retry

## Available Tools (18)

| Tool | Description |
|------|-------------|
| `stripe_create_customer` | Create a new customer |
| `stripe_get_customer` | Get customer details by ID |
| `stripe_update_customer` | Update customer properties |
| `stripe_list_customers` | List customers with pagination |
| `stripe_delete_customer` | Delete a customer |
| `stripe_create_product` | Create a new product |
| `stripe_get_product` | Get product details by ID |
| `stripe_list_products` | List products |
| `stripe_create_price` | Create a price (one-time or recurring) |
| `stripe_get_price` | Get price details by ID |
| `stripe_list_prices` | List prices |
| `stripe_create_subscription` | Create a new subscription |
| `stripe_get_subscription` | Get subscription details |
| `stripe_cancel_subscription` | Cancel a subscription |
| `stripe_list_subscriptions` | List subscriptions |
| `stripe_get_invoice` | Get invoice details |
| `stripe_list_invoices` | List invoices |
| `stripe_get_balance` | Get current account balance |

## Quick Start

```bash
npx @cloud9-labs/mcp-stripe
```

## Prerequisites

- Node.js >= 20.0.0
- Stripe Secret Key from [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (test mode recommended for development)

## Installation

### Via npx (Recommended)

No installation needed - configure your MCP client to use npx.

### Via npm

```bash
npm i -g @cloud9-labs/mcp-stripe
```

### From Source

```bash
git clone https://github.com/cloud9-labs/mcp-stripe.git
cd mcp-stripe
npm ci
npm run build
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@cloud9-labs/mcp-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key_here"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@cloud9-labs/mcp-stripe"],
      "env": {
        "STRIPE_SECRET_KEY": "sk_test_your_key_here"
      }
    }
  }
}
```

## Usage Examples

- "Create a customer for john@example.com"
- "Create a product called Premium Plan"
- "Create a monthly price of .99 for product prod_xxx"
- "Subscribe customer cus_xxx to price price_xxx"
- "List all active subscriptions"
- "Show me the current account balance"
- "Get invoice details for in_xxx"

## Building an AI Sales Automation System?

This MCP server is part of an open-source toolkit for AI-powered sales automation. We are building MCP servers that connect your entire sales stack.

Follow our progress and get updates:

- **X (Twitter)**: [@cloud9_ai_labs](https://x.com/cloud9_ai_labs)
- **GitHub**: [cloud9-labs](https://github.com/cloud9-labs)

## License

MIT
