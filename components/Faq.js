export const faqItems = [
    {
        question: 'What is OpenAdapt?',
        answer: 'OpenAdapt is an open-source demonstration compiler for desktop automation. You record yourself doing a task once, and OpenAdapt compiles that recording into a deterministic, self-healing script that runs on your own machines. Healthy runs make no cloud model calls, so each run costs nothing.',
    },
    {
        question: 'How is OpenAdapt different from RPA tools like UiPath?',
        answer: 'Traditional RPA makes you hand-author brittle selectors and flowcharts, and the bot breaks when the UI changes. OpenAdapt compiles the automation from a demonstration instead — no selector authoring — and when the UI drifts it heals itself, proposing the fix as a reviewable diff. It also runs entirely on your machines.',
    },
    {
        question: 'How is OpenAdapt different from AI computer-use agents?',
        answer: "Computer-use agents re-reason through your task with a large model on every run, so they are slow, non-deterministic, and bill you per run. OpenAdapt compiles the task once and replays it deterministically for free. A model is only invoked to heal the script when the UI drifts.",
    },
    {
        question: 'Does my data leave my machines?',
        answer: 'No. OpenAdapt is local-first by architecture: recordings, compiled scripts, and replays all stay on your own infrastructure. Nothing is uploaded to run an automation. PII/PHI scrubbing tooling is included for teams that need to sanitize captured data before anyone — human or model — sees it.',
    },
    {
        question: 'Is OpenAdapt free?',
        answer: 'Yes — OpenAdapt is MIT-licensed open source, free to use and modify. For regulated deployments in healthcare and lending we run commercial pilots with hands-on support: we help compile your first workflows, set up review, and keep the automations healthy. Book a demo to talk about a pilot.',
    },
    {
        question: 'What software does OpenAdapt work with?',
        answer: "Anything with a screen. Because OpenAdapt watches pixels and inputs rather than APIs or browser internals, it works with desktop applications, web apps, and software delivered over VDI or RDP — including EMRs and loan origination systems that cloud automation tools can't reach.",
    },
]

export default function Faq() {
    return (
        <section id="faq" className="mx-auto max-w-3xl px-4 py-12">
            <h2 className="text-center text-xl font-medium text-white/95 mb-8 tracking-tight">
                Frequently asked questions
            </h2>
            <dl className="space-y-6">
                {faqItems.map((item) => (
                    <div
                        key={item.question}
                        className="rounded-xl border border-white/10 bg-white/5 p-5"
                    >
                        <dt className="text-base font-semibold text-white/95">
                            {item.question}
                        </dt>
                        <dd className="mt-2 text-sm font-light leading-relaxed text-white/75">
                            {item.answer}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}
