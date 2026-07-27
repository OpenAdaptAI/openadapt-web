/**
 * Canonical public inventory for OpenAdapt data-flow lanes and service
 * providers. Security and Privacy render this same data so a provider or
 * boundary cannot be updated on one trust surface while silently drifting on
 * the other.
 */

export const trustDataFlows = Object.freeze([
    Object.freeze({
        id: 'customer-controlled-execution',
        title: 'Customer-controlled execution',
        summary:
            'Browser, native, RDP, and Citrix recordings, screenshots, input events, live observations, bundles, and machine evidence stay in infrastructure controlled by the customer. OpenAdapt Cloud receives only an explicitly admitted sanitized derivative or schema-minimized control-plane metadata unless the deployment authorizes another destination.',
        dataClasses: Object.freeze([
            'raw recordings and input events',
            'live runtime frames and identity evidence',
            'compiled bundles, reports, and checkpoints',
        ]),
    }),
    Object.freeze({
        id: 'managed-authoring',
        title: 'Managed browser authoring and execution',
        summary:
            'This is a separate hosted lane. During an approved managed browser session, raw frames and input events are processed by the managed runner and may be stored in private service storage for compilation. Capture and compilation do not sanitize that recording. Workloads whose live screens necessarily expose restricted data use a qualified customer-controlled boundary.',
        dataClasses: Object.freeze([
            'raw managed-browser frames and input events',
            'managed compilation inputs and outputs',
            'live observations and run evidence for approved workloads',
        ]),
    }),
    Object.freeze({
        id: 'hosted-control-plane',
        title: 'Hosted control plane',
        summary:
            'The control plane operates accounts, organizations, access, billing, approved artifacts, workflow configuration, run status, usage, audit records, transactional invitations, product analytics, and bounded operational error reporting. Customer-controlled runtime screenshots and report bodies are not deliberately attached to analytics or error events; error messages and stacks are pattern-scrubbed and truncated but must still be treated as potentially sensitive.',
        dataClasses: Object.freeze([
            'account, organization, access, and billing records',
            'approved artifacts, run status, usage, and audit metadata',
            'bounded product events and scrubbed operational errors',
        ]),
    }),
    Object.freeze({
        id: 'marketing-site',
        title: 'Public website and sales journey',
        summary:
            'The public site handles page visits, site-wide interaction autocapture when configured, bounded CTA and conversion events, contact forms, booking, checkout entry, and public repository metadata. It is not a workflow-runtime or customer-evidence surface.',
        dataClasses: Object.freeze([
            'page paths, interaction autocapture, bounded CTA events, and campaign attribution',
            'contact and qualification form submissions',
            'booking, checkout entry, and public repository metadata',
        ]),
    }),
])

export const trustProviders = Object.freeze([
    Object.freeze({
        id: 'netlify',
        name: 'Netlify',
        purpose: 'Hosts the public website and Cloud web application and processes public website form submissions.',
        data: 'Network and request data; form fields a visitor intentionally submits; application delivery logs.',
        lanes: Object.freeze(['hosted-control-plane', 'marketing-site']),
        configured: 'Current hosting path',
    }),
    Object.freeze({
        id: 'supabase',
        name: 'Supabase',
        purpose: 'Provides hosted authentication, the tenant-scoped database, and private object storage.',
        data: 'Account and organization records, approved artifacts, reports, and private managed-authoring recordings. Customer-controlled live runtime frames are outside this lane.',
        lanes: Object.freeze(['managed-authoring', 'hosted-control-plane']),
        configured: 'Current hosted-service path',
    }),
    Object.freeze({
        id: 'modal',
        name: 'Modal',
        purpose: 'Runs approved managed browser recording and execution compute, and hosted compilation when that path is explicitly enabled.',
        data: 'Managed-session frames and input events, compilation inputs, live observations, and bounded execution outputs for the selected managed workflow.',
        lanes: Object.freeze(['managed-authoring']),
        configured: 'Selected managed workflows',
    }),
    Object.freeze({
        id: 'stripe',
        name: 'Stripe',
        purpose: 'Provides Checkout, payment processing, billing, and subscription state.',
        data: 'Payment and billing details entered in Stripe plus customer, subscription, price, and entitlement references used by OpenAdapt Cloud.',
        lanes: Object.freeze(['hosted-control-plane', 'marketing-site']),
        configured: 'Paid hosted-service path',
    }),
    Object.freeze({
        id: 'resend',
        name: 'Resend',
        purpose: 'Delivers transactional organization-invitation email when configured.',
        data: 'Invitee email, organization name, role, inviter display identity, and the non-secret sign-in link. No workflow payload or runtime evidence.',
        lanes: Object.freeze(['hosted-control-plane']),
        configured: 'Environment-gated',
    }),
    Object.freeze({
        id: 'posthog',
        name: 'PostHog',
        purpose: 'Measures the public acquisition funnel and privacy-bounded Cloud activation outcomes when configured.',
        data: 'The website sends public-page views, site-wide click/interaction autocapture, and named CTA/conversion events; optional website replay is off by default and masks inputs when enabled. Cloud disables autocapture and replay and sends scrubbed paths, opaque user/organization IDs, organization business name, role/admin flags, enums, counts, and durations. Cloud does not identify users by email or deliberately attach screenshots, record contents, or report bodies.',
        lanes: Object.freeze(['hosted-control-plane', 'marketing-site']),
        configured: 'Environment-gated; Do-Not-Track respected',
    }),
    Object.freeze({
        id: 'ga4',
        name: 'Google Analytics 4',
        purpose: 'Measures route page views across the public site and Cloud, plus selected public-site conversions, when configured.',
        data: 'Route/page and bounded campaign or conversion metadata. Google signals and ad-personalization signals are disabled; no workflow payload or runtime evidence.',
        lanes: Object.freeze(['hosted-control-plane', 'marketing-site']),
        configured: 'Optional; Do-Not-Track respected',
    }),
    Object.freeze({
        id: 'meta',
        name: 'Meta Pixel',
        purpose: 'Measures public-site page views and lead, contact, or booking conversions during an explicitly configured campaign.',
        data: 'Public marketing page and bounded conversion events; never product runtime or customer evidence data.',
        lanes: Object.freeze(['marketing-site']),
        configured: 'Optional campaign path; Do-Not-Track respected',
    }),
    Object.freeze({
        id: 'sentry-compatible',
        name: 'Sentry-compatible error service (GlitchTip)',
        purpose: 'Receives bounded server error and operational anomaly events from OpenAdapt Cloud when configured.',
        data: 'Route name, pattern-scrubbed and truncated error message/stack text, opaque run/organization/workflow IDs, and numeric counts. Callers are required not to attach request or response bodies, headers, cookies, query strings, screenshots, or report bodies. Pattern scrubbing is defense in depth, not proof that arbitrary error text is de-identified.',
        lanes: Object.freeze(['hosted-control-plane']),
        configured: 'Environment-gated',
    }),
    Object.freeze({
        id: 'calcom',
        name: 'Cal.com',
        purpose: 'Provides the public booking flow.',
        data: 'Booking details entered by the visitor and optional name/email prefill the visitor already supplied.',
        lanes: Object.freeze(['marketing-site']),
        configured: 'Current booking path',
    }),
    Object.freeze({
        id: 'github',
        name: 'GitHub',
        purpose: 'Hosts public source, releases, advisories, and repository metadata used by the website.',
        data: 'Public repository and release data plus ordinary network/request data when a visitor follows a GitHub link.',
        lanes: Object.freeze(['marketing-site']),
        configured: 'Current open-source path',
    }),
])

export const trustDataFlowById = Object.freeze(
    Object.fromEntries(trustDataFlows.map((lane) => [lane.id, lane]))
)

export function providersForLane(laneId) {
    return trustProviders.filter((provider) => provider.lanes.includes(laneId))
}
