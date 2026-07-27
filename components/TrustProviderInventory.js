import {
    trustDataFlowById,
    trustDataFlows,
    trustProviders,
} from '../data/trustProviderInventory.mjs'

const laneNames = (provider) =>
    provider.lanes.map((laneId) => trustDataFlowById[laneId].title).join('; ')

export default function TrustProviderInventory({ compact = false }) {
    return (
        <div className="space-y-6">
            <div className={`grid gap-4 ${compact ? '' : 'md:grid-cols-2'}`}>
                {trustDataFlows.map((lane) => (
                    <article
                        key={lane.id}
                        className="rounded-xl border border-hairline bg-panel p-5"
                    >
                        <h3 className="font-display text-base font-semibold text-ink">
                            {lane.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                            {lane.summary}
                        </p>
                        {!compact && (
                            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-2">
                                {lane.dataClasses.map((dataClass) => (
                                    <li key={dataClass}>{dataClass}</li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>

            <div className="overflow-x-auto rounded-xl border border-hairline bg-panel">
                <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                    <caption className="sr-only">
                        OpenAdapt service providers, purposes, data classes, and
                        product data-flow lanes
                    </caption>
                    <thead className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
                        <tr>
                            <th
                                scope="col"
                                className="border-b border-hairline px-4 py-3"
                            >
                                Provider
                            </th>
                            <th
                                scope="col"
                                className="border-b border-hairline px-4 py-3"
                            >
                                Purpose and data
                            </th>
                            <th
                                scope="col"
                                className="border-b border-hairline px-4 py-3"
                            >
                                Product lane
                            </th>
                            <th
                                scope="col"
                                className="border-b border-hairline px-4 py-3"
                            >
                                Activation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {trustProviders.map((provider) => (
                            <tr key={provider.id} className="align-top">
                                <th
                                    scope="row"
                                    className="border-b border-hairline px-4 py-3 font-medium text-ink"
                                >
                                    {provider.name}
                                </th>
                                <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                    <span className="text-ink">
                                        {provider.purpose}
                                    </span>{' '}
                                    {provider.data}
                                </td>
                                <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                    {laneNames(provider)}
                                </td>
                                <td className="border-b border-hairline px-4 py-3 text-ink-2">
                                    {provider.configured}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
