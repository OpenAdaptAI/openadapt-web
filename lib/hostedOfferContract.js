const LAUNCH_MONTHLY_RUN_CAP = 10000
const LAUNCH_PRODUCT_ID = 'prod_openadapt_cloud'
const LAUNCH_PRODUCT_NAME = 'OpenAdapt Cloud'
const LAUNCH_LOOKUP_KEY = 'openadapt_cloud_usd_monthly_500_10000_v1'

function formatMinorUnits(unitAmount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    })
    const digits = formatter.resolvedOptions().maximumFractionDigits
    return formatter.format(unitAmount / 10 ** digits)
}

function cadence(recurring) {
    if (!recurring?.interval) return ''
    const count = recurring.interval_count
    const interval = count === 1 ? recurring.interval : `${count} ${recurring.interval}s`
    return `/${interval}`
}

function parseMonthlyRunCap(metadata) {
    const value = metadata?.monthly_run_cap
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null

    const cap = Number(value)
    return Number.isSafeInteger(cap) ? cap : null
}

function hostedOfferFromPrice(price, { expectedLive } = {}) {
    const recurring = price?.recurring
    const hasAlternateCurrencies =
        price?.currency_options && Object.keys(price.currency_options).length > 0

    if (
        !price?.active ||
        price.type !== 'recurring' ||
        price.currency !== 'usd' ||
        price.unit_amount !== 50000 ||
        price.billing_scheme !== 'per_unit' ||
        price.transform_quantity !== null ||
        price.custom_unit_amount !== null ||
        price.tiers_mode !== null ||
        hasAlternateCurrencies ||
        price.lookup_key !== LAUNCH_LOOKUP_KEY ||
        typeof price.livemode !== 'boolean' ||
        (typeof expectedLive === 'boolean' && price.livemode !== expectedLive) ||
        recurring?.interval !== 'month' ||
        recurring?.interval_count !== 1 ||
        recurring?.usage_type !== 'licensed' ||
        recurring?.trial_period_days !== null
    ) {
        return null
    }

    const product =
        price.product &&
        typeof price.product === 'object' &&
        !price.product.deleted &&
        price.product.active === true &&
        price.product.livemode === price.livemode
            ? price.product
            : null
    const productName = typeof product?.name === 'string' ? product.name.trim() : ''
    const monthlyRunCap = parseMonthlyRunCap(product?.metadata)

    // Price, product, cadence, and allowance form one launch offer. If any part
    // cannot be verified, callers must not advertise or initiate checkout.
    if (
        product?.id !== LAUNCH_PRODUCT_ID ||
        productName !== LAUNCH_PRODUCT_NAME ||
        product.metadata?.substrate !== 'browser' ||
        product.metadata?.lifecycle !== 'beta' ||
        monthlyRunCap !== LAUNCH_MONTHLY_RUN_CAP
    ) {
        return null
    }

    return {
        amount: formatMinorUnits(price.unit_amount, price.currency),
        cadence: cadence(recurring),
        product: productName,
        monthlyRunCap,
    }
}

function monthlyRunCapLabel(value) {
    if (!Number.isSafeInteger(value) || value <= 0) return ''
    return `Up to ${new Intl.NumberFormat('en-US').format(value)} workflow runs/month`
}

module.exports = {
    LAUNCH_LOOKUP_KEY,
    LAUNCH_MONTHLY_RUN_CAP,
    LAUNCH_PRODUCT_ID,
    LAUNCH_PRODUCT_NAME,
    hostedOfferFromPrice,
    monthlyRunCapLabel,
    parseMonthlyRunCap,
}
