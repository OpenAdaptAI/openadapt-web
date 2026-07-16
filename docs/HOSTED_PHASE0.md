# Hosted launch runbook

The website launches the configured Hosted subscription through Stripe
Checkout. It does not hard-code a numeric amount: `STRIPE_PRICE_ID` selects the
offer, the pricing page retrieves that amount server-side when Stripe is
configured, and Checkout confirms the same price and billing period before the
customer pays. If price retrieval is unavailable, the page says that the offer
is configured in Stripe rather than presenting a stale fallback amount.

The website retrieves the Price with its Product expanded. Set Product metadata
`monthly_run_cap=<positive integer>` to publish the included workflow-run
allowance beside the retrieved price. The website formats that exact value and
omits the allowance when the metadata is missing or malformed; it has no
hard-coded cap fallback. Keep `monthly_run_cap` equal to Cloud's
`PLAN_MONTHLY_RUN_CAP` so the displayed offer and enforced entitlement agree.

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
| `STRIPE_SECRET_KEY` | Server | Create Checkout Sessions. Production requires an `sk_live_` key; test and preview use `sk_test_`. |
| `STRIPE_PRICE_ID` | Server | Select the recurring offer from the same Stripe account and mode as the key. |
| `STRIPE_EXPECTED_MODE` | Server | Operator guard: set `live` in production and `test` in test or preview. A mismatched key is refused. |
| `NEXT_PUBLIC_CLOUD_APP_URL` | Public | Exact HTTPS Cloud origin for post-payment sign-in/onboarding. |
| `NEXT_PUBLIC_SITE_URL` | Public | Exact HTTPS site origin for Checkout cancellation. |

Secrets belong in the deployment environment, never committed files. Web and
Cloud must use the same Stripe account and mode so Cloud can retrieve and claim
the Session created by Web. The configured recurring price must also belong to
that account and mode. In production, set `STRIPE_EXPECTED_MODE=live` with an
`sk_live_` key and live price. In test or preview, set
`STRIPE_EXPECTED_MODE=test` with an `sk_test_` key and test price. Set exact
environment-specific site and Cloud origins in both cases.

The website has no implicit request-host or concierge checkout fallback. If a
required value is absent, invalid, or mode-mismatched, offer lookup is
unavailable and `POST /api/create-checkout-session` returns HTTP 503. The
standalone `/hosted/welcome` support page is not a payment-verification path.

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

- [ ] Configure Web with the live Stripe secret, live price id,
      `STRIPE_EXPECTED_MODE=live`, and exact production site and Cloud origins.
- [ ] Configure Cloud against the same live Stripe account and mode, including
      its signed webhook endpoint and signing secret.
- [ ] Confirm Stripe displays the intended amount and billing period.
- [ ] Confirm Product metadata `monthly_run_cap` is a canonical positive integer
      equal to Cloud `PLAN_MONTHLY_RUN_CAP`, and that the website displays it.
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
