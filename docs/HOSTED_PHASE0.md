# Hosted launch runbook

The website launches the configured Hosted subscription through Stripe
Checkout. `STRIPE_PRICE_ID` must select the exact live launch offer: the stable
`OpenAdapt Cloud` Product, licensed USD $500 monthly Price, 10,000-run allowance,
Beta browser lifecycle, and canonical launch lookup key. The pricing page still
retrieves the amount server-side for display, but it refuses a Price that differs
from that launch contract. Checkout verifies the same Price and Product again
before the customer pays. If verification is unavailable, the page says that
the offer is unavailable and disables checkout rather than presenting a stale
fallback amount.

The website retrieves the Price with its Product expanded. The Product must use
id `prod_openadapt_cloud`, name `OpenAdapt Cloud`, and metadata
`monthly_run_cap=10000`, `substrate=browser`, and `lifecycle=beta`. The Price
must use lookup key `openadapt_cloud_usd_monthly_500_10000_v1`, have no trial or
alternate currency amounts, and otherwise match the fixed offer above. Missing,
malformed, or different fields make the offer unavailable; there is no display
fallback. The checkout endpoint retrieves and verifies the same active recurring
Price and expanded Product immediately before creating a Session, so a stale
page, post-deploy Stripe edit, or direct POST cannot bypass the offer gate.
Cloud's `STRIPE_PRICE_ID` must select this same Price and
`PLAN_MONTHLY_RUN_CAP` must be `10000`.

## Customer flow

1. The Hosted card calls `POST /api/create-checkout-session`.
2. The server creates a subscription Checkout Session for `STRIPE_PRICE_ID`.
3. Success routes to `NEXT_PUBLIC_CLOUD_APP_URL/login` with only the opaque
   `checkout_session_id`.
4. The cloud app links the subscription during sign-in and organization
   onboarding.
5. The Cloud control plane's single Stripe webhook updates subscription state
   and entitlements with signature verification, event idempotency, and
   ordering checks. The marketing site does not maintain a second billing
   state machine.

Missing Stripe or cloud-app configuration returns HTTP 503 and the pricing
component offers a direct contact fallback. Checkout cannot begin without a
valid post-payment onboarding destination.

## Website environment

| Variable | Scope | Purpose |
|---|---|---|
| `STRIPE_SECRET_KEY` | Server | Read the configured Price/Product and create Checkout Sessions. Prefer a dedicated restricted `rk_live_` key with Price/Product read and Checkout Session write; full `sk_live_` keys remain compatible. |
| `STRIPE_PRICE_ID` | Server | Select the recurring offer from the same Stripe account and mode as the key. |
| `STRIPE_EXPECTED_MODE` | Server | Operator guard: set `live` in production and `test` in test or preview. A mismatched key is refused. |
| `NEXT_PUBLIC_CLOUD_APP_URL` | Public | Exact HTTPS Cloud origin for post-payment sign-in/onboarding. |
| `NEXT_PUBLIC_SITE_URL` | Public | Exact HTTPS site origin for Checkout cancellation. |

Secrets belong in the deployment environment, never committed files. Web and
Cloud must use the same Stripe account and mode so Cloud can retrieve and claim
the Session created by Web. The configured recurring price must also belong to
that account and mode. In production, set `STRIPE_EXPECTED_MODE=live` with an
`rk_live_` restricted key (preferred) or `sk_live_` key and live price. In test
or preview, set `STRIPE_EXPECTED_MODE=test` with an `rk_test_` or `sk_test_` key
and test price. Set exact
environment-specific site and Cloud origins in both cases. Web and Cloud do not
need to share a credential: give each deployment a separate restricted key, with
Cloud's key limited to the additional subscription and billing-portal operations
its control plane performs.

### Netlify production scopes

Set these variables in the Web Netlify site for the `Production` deploy context
only. Deploy Previews and branch deploys should either omit them (checkout stays
disabled) or use a complete, isolated test-mode set.

| Variable | Netlify scopes | Secret | Value class |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Builds + Functions | Yes | Dedicated `rk_live_` preferred; `sk_live_` compatible |
| `STRIPE_PRICE_ID` | Builds + Functions | No | Live recurring `price_...` |
| `STRIPE_EXPECTED_MODE` | Builds + Functions | No | `live` |
| `NEXT_PUBLIC_CLOUD_APP_URL` | Builds + Functions | No; browser-visible | `https://app.openadapt.ai` |
| `NEXT_PUBLIC_SITE_URL` | Builds + Functions | No; browser-visible | `https://openadapt.ai` |

Build scope is required because the home and pricing pages generate the verified
offer during build. Functions scope is also required for ISR regeneration and
the checkout API route. Do not add Cloud-only `STRIPE_WEBHOOK_SECRET` or
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to the Web site.

The website has no implicit request-host or concierge checkout fallback. If a
required value is absent, invalid, mode-mismatched, inactive, or outside the
exact Product and Price contract above, offer lookup is unavailable, the
checkout button is disabled, and `POST /api/create-checkout-session` returns
HTTP 503.
The standalone `/hosted/welcome` support page is not a payment-verification
path.

## Production is never implicit mock

Development may run the cloud app with visibly synthetic mock data. Production
must explicitly select live mode and validate authentication, database, object
storage, runner, callback secret, sanitizer policy, and billing dependencies.
If any required dependency is missing, the affected operation reports an error;
it must not fabricate a completed workflow or successful payment.

This rule does not disable production. It prevents a deployment configuration
mistake from presenting simulated development behavior to a paying customer.

## Artifact admission

A subscription is not an egress bypass. Compilation does not remove PHI.

1. Sanitize the recording locally, inspect it in the loopback-only viewer,
   approve its exact derivative hash, and push that approved recording.
2. Compile from the approved recording derivative locally. Strict-lint,
   certify, and successfully replay it in a named non-PHI validation
   environment.
3. Sanitize the bundle, review it locally, and approve its exact derivative
   hash. Bundle sanitation must preserve execution-bearing bytes.
4. Run `validate-hosted` with the approved recording, approved bundle, replay
   report, policy, derived `low`/`consequential` risk class, environment, exact
   non-PHI HTTPS entry URL, derived target origin, and host allowlist. The
   report's requested entry URL and actual browser origin must match. It
   acquires a 15-minute, one-time organization/token-bound challenge.
5. Immediately push the exact approved bundle with
   `--validation-attestation`. Cloud verifies exact hashes, provenance, report
   bindings, HMAC, freshness, policy/risk-class allowlists, the deployed
   compiler-version allowlist, and consumes the challenge once.
6. Cloud activates the attested target and parameter schema. Select a vault
   secret reference and optional schedule, supply non-secret values per run,
   then execute. Runtime values are not stored in bundle metadata.

The recording push registers approved source provenance; it does not create a
runnable workflow. If recording sanitation changed execution-bearing content,
ingest returns `needs_parameterization`. Parameterize before local compilation.
Privacy approval is not runtime validation, and the operator attestation is not
independent certification: it is signed by the ingest-token holder, not by an
external evaluator that witnessed the replay.

Sanitized authoring artifacts and PHI-bearing runtime observations are separate
data classes. A live application can reintroduce PHI after sanitized recording
upload. Those frames, values, and logs remain inside the declared trusted
execution boundary.

## Go-live verification

- [ ] Configure Web with the live restricted Stripe server key, live price id,
      `STRIPE_EXPECTED_MODE=live`, and exact production site and Cloud origins.
- [ ] Configure Cloud against the same live Stripe account and mode, including
      its signed webhook endpoint and signing secret.
- [ ] Confirm Web and Cloud `STRIPE_PRICE_ID` select the same exact live Price,
      and Stripe displays USD $500/month with no trial or alternate amounts.
- [ ] Confirm Product id/name, lookup key, browser/Beta metadata,
      `monthly_run_cap=10000`, and Cloud `PLAN_MONTHLY_RUN_CAP=10000`; verify the
      website displays $500/month and 10,000 runs.
- [ ] Change one launch Product/Price field and confirm both Web offer rendering
      and direct checkout refuse it; restore the exact contract.
- [ ] Confirm an unavailable or malformed offer disables Web checkout and a
      direct checkout POST returns HTTP 503 without creating a Session.
- [ ] Confirm Checkout links the current Terms and Privacy Policy, automatic
      renewal is disclosed, the Cloud portal can cancel at period end, and the
      published refund policy matches the configured Stripe behavior.
- [ ] Configure the production cloud app URL and site URL.
- [ ] Verify checkout -> sign-in -> organization/subscription linkage.
- [ ] Verify cancellation, portal, webhook replay/idempotency, and entitlement
      changes.
- [ ] Verify recording sanitize -> review -> approve -> push -> local compile ->
      strict lint -> certify -> successful replay -> bundle sanitize -> review
      -> approve -> `validate-hosted` -> attested bundle push -> configure ->
      execute -> structural report -> repair locally -> validate replacement ->
      activate -> rerun.
- [ ] Verify changed recording execution content returns
      `needs_parameterization` before compilation.
- [ ] Verify changed hashes/provenance/report, expired/reused challenge,
      mismatched derived risk class, and policies/risk classes outside the exact
      deployment allowlists are refused.
- [ ] Verify compiler versions outside the exact deployed runner allowlist are
      refused.
- [ ] Verify raw, modified, unresolved, or wrong-destination artifacts are
      refused even for a paid account.
- [ ] Verify the production runner cannot silently fall back to mock success.
- [ ] Verify usage metering, caps, logs, alerts, deletion, backup, restore, and
      incident procedures.
- [ ] Perform one real-card purchase, verify service entitlement, then cancel
      and refund according to the published terms.

Hosted browser launch does not imply Windows, RDP, or Citrix support, an SLA,
SOC 2 attestation, a BAA, or authorization for a regulated workload. Those
claims require their own contract and evidence.
