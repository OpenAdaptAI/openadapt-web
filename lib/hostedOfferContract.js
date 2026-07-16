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
    const validRecurring =
        recurring &&
        ['day', 'week', 'month', 'year'].includes(recurring.interval) &&
        Number.isSafeInteger(recurring.interval_count) &&
        recurring.interval_count > 0

    if (
        !price?.active ||
        price.type !== 'recurring' ||
        !Number.isSafeInteger(price.unit_amount) ||
        price.unit_amount <= 0 ||
        typeof price.currency !== 'string' ||
        !/^[a-z]{3}$/i.test(price.currency) ||
        typeof price.livemode !== 'boolean' ||
        (typeof expectedLive === 'boolean' && price.livemode !== expectedLive) ||
        !validRecurring
    ) {
        return null
    }

    const product =
        price.product &&
        typeof price.product === 'object' &&
        !price.product.deleted &&
        price.product.active === true
            ? price.product
            : null
    const productName = typeof product?.name === 'string' ? product.name.trim() : ''
    const monthlyRunCap = parseMonthlyRunCap(product?.metadata)

    // Price, product, cadence, and allowance form one launch offer. If any part
    // cannot be verified, callers must not advertise or initiate checkout.
    if (!productName || !monthlyRunCap) return null

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
    hostedOfferFromPrice,
    monthlyRunCapLabel,
    parseMonthlyRunCap,
}
