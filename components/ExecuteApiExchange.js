import styles from './ExecuteApiExchange.module.css'

function CodeLine({ children }) {
    return <code className={styles.line}>{children}</code>
}

export default function ExecuteApiExchange() {
    return (
        <section className={styles.exchange} aria-labelledby="execute-api-exchange-title">
            <div className={styles.heading}>
                <p className="eyebrow">Asynchronous by design</p>
                <h2 id="execute-api-exchange-title">One transaction. A durable terminal receipt.</h2>
                <p>Your request gets an immediate acceptance. A signed webhook then delivers the terminal result when the runner has proof or needs reconciliation.</p>
            </div>
            <ol className={styles.messages}>
                <li>
                    <p className={styles.label}>1 · Submit an authorized transaction</p>
                    <pre aria-label="Execute API request"><CodeLine><span className={styles.method}>POST</span> /v1/executions</CodeLine><CodeLine>{'{ "idempotency_key": "txn_…", "input": { … } }'}</CodeLine></pre>
                    <p className={styles.note}>Your product supplies structured input. The qualified workflow defines the permitted effect.</p>
                </li>
                <li>
                    <p className={styles.label}>2 · Keep the transaction identity</p>
                    <pre aria-label="Execute API accepted response"><CodeLine><span className={styles.status}>202 Accepted</span></CodeLine><CodeLine>{'{ "execution_id": "exec_…", "state": "queued" }'}</CodeLine></pre>
                    <p className={styles.note}>Acceptance is not a success claim. Poll this ID if your webhook endpoint is unavailable.</p>
                </li>
                <li>
                    <p className={styles.label}>3 · Verify the terminal delivery</p>
                    <pre aria-label="Signed terminal webhook"><CodeLine><span className={styles.webhook}>POST</span> https://your-product.example/hooks/openadapt</CodeLine><CodeLine>OpenAdapt-Signature: t=…, v1=…</CodeLine><CodeLine>{'{ "event_type": "execution.terminal",'}</CodeLine><CodeLine>{'  "receipt": { "outcome": "VERIFIED", … } }'}</CodeLine></pre>
                    <p className={styles.note}>Verify the signature and store the receipt. The outcome can also require reconciliation instead of a retry.</p>
                </li>
            </ol>
        </section>
    )
}
