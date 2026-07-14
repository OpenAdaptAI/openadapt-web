# OpenAdapt Hosted — Phase 0 (paid sign-up, concierge onboarding)

Phase 0 turns the Hosted pricing card from a waitlist into a real, paid
sign-up via **Stripe Checkout**. It is a **concierge** model: after a customer
subscribes, we onboard them by hand. There is no self-serve runner yet, and
the site copy says so.

Everything runs in **Stripe TEST mode** until the maintainer swaps in live
keys. No keys are hardcoded anywhere; the app reads them from the environment
at request time.

## The flow

1. On the Hosted card (`components/Pricing.js`) the user clicks **Sign up**.
2. The button POSTs to `POST /api/create-checkout-session`
   (`pages/api/create-checkout-session.js`), which creates a Stripe Checkout
   Session in `subscription` mode for `STRIPE_PRICE_ID`.
3. The user is redirected to Stripe Checkout to pay ($500/mo).
4. On success, Stripe redirects to
   `/hosted/welcome?session_id={CHECKOUT_SESSION_ID}`
   (`pages/hosted/welcome.js`), which confirms the subscription and sets the
   concierge expectation ("We'll reach out within one business day").
   On cancel, Stripe returns the user to `/#pricing`.
5. Stripe also calls `POST /api/stripe-webhook`
   (`pages/api/stripe-webhook.js`), which verifies the signature and handles
   `checkout.session.completed` and `customer.subscription.created` by logging
   and calling a stub notifier (TODO: wire to email / Slack).

If the required env vars are missing (local dev, CI, preview deploys without
secrets), the API routes return a clean **503** instead of crashing. The site
still builds and deploys, and the Sign up button surfaces a friendly fallback
pointing the user at booking a call.

## Environment variables

Copy `.env.example` to `.env.local` and fill in. Names only live in the repo.

| Variable | Where | Example (test) | Purpose |
| --- | --- | --- | --- |
| `STRIPE_SECRET_KEY` | server | `sk_test_...` | Create Checkout Sessions, verify webhooks |
| `STRIPE_PRICE_ID` | server | `price_...` | The recurring $500/mo price |
| `STRIPE_WEBHOOK_SECRET` | server | `whsec_...` | Verify webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client | `pk_test_...` | Publishable key (reserved for client use) |
| `NEXT_PUBLIC_SITE_URL` | both | `https://openadapt.ai` | Base URL for success/cancel URLs (optional; falls back to request host) |

Set these as environment variables in your host (Vercel / Netlify), not in
committed files.

## Create the $500/mo price in Stripe

1. In the Stripe dashboard, ensure the **Test mode** toggle is on.
2. **Products → Add product**. Name it e.g. "OpenAdapt Hosted".
3. Add a **recurring** price: **$500.00 USD**, billing period **Monthly**.
4. Save, then copy the price id (`price_...`) into `STRIPE_PRICE_ID`.
5. Copy your test secret key (`sk_test_...`, Developers → API keys) into
   `STRIPE_SECRET_KEY`, and the publishable key (`pk_test_...`) into
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## Set up the webhook

The webhook endpoint is `POST /api/stripe-webhook`. It requires the **raw**
request body, so Next.js body parsing is disabled in that route.

**Local testing (Stripe CLI):**

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe-webhook
# copy the printed whsec_... into STRIPE_WEBHOOK_SECRET in .env.local
stripe trigger checkout.session.completed
```

**Production:**

1. Stripe dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://openadapt.ai/api/stripe-webhook`.
3. Events: `checkout.session.completed` and `customer.subscription.created`.
4. Copy the endpoint's **Signing secret** (`whsec_...`) into
   `STRIPE_WEBHOOK_SECRET`.

## Test a real (test-mode) purchase

1. `npm run dev` with the four Stripe env vars set to test values.
2. Open the Hosted card and click **Sign up**.
3. On Stripe Checkout use test card `4242 4242 4242 4242`, any future expiry,
   any CVC and postal code.
4. Confirm you land on `/hosted/welcome` and that the webhook logs
   `checkout.session.completed`.

## Go-live checklist

- [ ] Recreate the product/price in **live** mode; update `STRIPE_PRICE_ID`.
- [ ] Swap all keys from test to **live**: `STRIPE_SECRET_KEY` (`sk_live_...`),
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_live_...`).
- [ ] Recreate the webhook endpoint in live mode; update
      `STRIPE_WEBHOOK_SECRET` (`whsec_...`).
- [ ] Add a **Terms of Service** and **refund/cancellation policy** link to
      the Checkout / Hosted flow (link `/terms-of-service`).
- [ ] Wire the webhook stub notifier to real **email and/or Slack** so the
      concierge team is alerted on every sign-up (currently a TODO).
- [ ] Do a **real card** end-to-end purchase, confirm the subscription in the
      Stripe dashboard, then refund/cancel it.
- [ ] Confirm `success_url` / `cancel_url` resolve to the production domain
      (set `NEXT_PUBLIC_SITE_URL`).

## Scope note

Phase 0 is deliberately concierge: it collects payment and sets expectations.
It does **not** provision a runner or unlock self-serve. For non-PHI /
evaluation workloads only; PHI or PII goes to **Enterprise** (on-prem, data
stays in the customer's building).
