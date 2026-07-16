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
    const count = recurring.interval_count || 1
    const interval = count === 1 ? recurring.interval : `${count} ${recurring.interval}s`
    return `/${interval}`
}

function parseMonthlyRunCap(metadata) {
    const value = metadata?.monthly_run_cap
    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null

    const cap = Number(value)
    return Number.isSafeInteger(cap) ? cap : null
}

function hostedOfferFromPrice(price) {
    if (
        !price?.active ||
        price.type !== 'recurring' ||
        !Number.isSafeInteger(price.unit_amount) ||
        typeof price.currency !== 'string' ||
        !price.currency
    ) {
        return null
    }

    const product =
        price.product && typeof price.product === 'object' && !price.product.deleted
            ? price.product
            : null

    return {
        amount: formatMinorUnits(price.unit_amount, price.currency),
        cadence: cadence(price.recurring),
        product: typeof product?.name === 'string' ? product.name : '',
        monthlyRunCap: parseMonthlyRunCap(product?.metadata),
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
