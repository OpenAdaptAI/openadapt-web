export const faqItems = [
    {
        question: 'What is OpenAdapt?',
        answer: 'OpenAdapt is an open-source demonstration compiler for desktop automation. You record yourself doing a task once, and OpenAdapt compiles that recording into a self-healing script that runs on your own machines. Healthy runs make no cloud model calls, so each run costs nothing.',
    },
    {
        question: 'How is OpenAdapt different from RPA tools like UiPath?',
        answer: 'Traditional RPA makes you hand-author brittle selectors and flowcharts, and the bot breaks when the UI changes. OpenAdapt compiles the automation from a demonstration instead, with no selector authoring, and when the UI drifts it heals itself and proposes the fix as a reviewable diff. It also runs entirely on your machines.',
    },
    {
        question: 'How is OpenAdapt different from AI computer-use agents?',
        answer: "Computer-use agents re-reason through your task with a large model on every run, so they're slow, non-deterministic, and bill you per run. OpenAdapt compiles the task once and replays it locally for free, with no per-run model calls. A model is only invoked to heal the script when the UI drifts.",
    },
    {
        question: 'Does my data leave my machines?',
        answer: 'It stays inside your network. OpenAdapt is local-first by architecture: recordings, compiled scripts, and replays live on your own infrastructure, and on the default path a healthy run makes no cloud calls at all, so nothing leaves your machine. When the UI drifts, healing calls a model; you can run that model on your own hardware or an appliance inside your network, so the data stays within your perimeter rather than going to a third party. PII/PHI scrubbing tooling is included for teams that need to sanitize captured data before anyone (human or model) sees it.',
    },
    {
        question: 'Is OpenAdapt free?',
        answer: 'Yes — OpenAdapt is MIT-licensed open source, free to use and modify. For regulated deployments in healthcare and lending we run commercial pilots with hands-on support: we help compile your first workflows, set up review, and keep the automations healthy. Book a demo to talk about a pilot.',
    },
    {
        question: 'What software does OpenAdapt work with?',
        answer: "OpenAdapt works from pixels and inputs rather than APIs or browser internals. Today it runs web apps, including web EMRs. Because the runtime is vision-based, the same approach extends to desktop applications and software delivered over VDI or RDP as adapters, not rewrites — and those adapters are in progress. The aim is to reach the desktop EMRs and loan origination systems that cloud automation tools can't, without an API integration project.",
    },
]

export default function Faq() {
    return (
        <section id="faq" className="mx-auto max-w-3xl px-4 py-12">
            <p className="eyebrow text-center mb-2">FAQ</p>
            <h2 className="font-display text-center text-xl font-semibold text-ink mb-8 tracking-tight">
                Frequently asked questions
            </h2>
            <dl className="space-y-6">
                {faqItems.map((item) => (
                    <div
                        key={item.question}
                        className="rounded-xl border border-hairline bg-panel p-5"
                    >
                        <dt className="font-display text-base font-semibold text-ink">
                            {item.question}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed text-ink-2">
                            {item.answer}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}
