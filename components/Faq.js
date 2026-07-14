export const faqItems = [
    {
        question: 'What is OpenAdapt?',
        answer: 'OpenAdapt is an open-source tool for automating desktop work. You do a task once while it records you, and it turns that recording into a script that runs on your own machines and repairs itself when the screen changes. A healthy run makes no cloud AI calls, so it costs nothing to run.',
    },
    {
        question: 'How is OpenAdapt different from RPA tools like UiPath?',
        answer: 'With traditional RPA, someone hand-builds the automation, and it breaks when the screen changes. With OpenAdapt you just record the task once. When the screen changes, it halts, a reviewer teaches the fix, and it is promoted into the workflow as a change you approve. You choose where it runs: our cloud, your own VPC, or fully self-hosted.',
    },
    {
        question: 'How is OpenAdapt different from AI computer-use agents?',
        answer: 'An AI agent works out your task from scratch on every run, so it is slow, unpredictable, and charges you each time. OpenAdapt learns the task once and replays it locally for free. It only calls an AI model when the screen changes and the script needs a repair.',
    },
    {
        question: 'Does my data leave my machines?',
        answer: 'That depends on the deployment you choose, and it is your choice. Non-regulated teams can use our hosted cloud. Regulated teams run OpenAdapt self-hosted and air-gapped, or managed by us inside their own VPC (single-tenant BYOC); in both of those, PHI never enters our infrastructure and we see only PHI-free run metadata. A healthy run makes no cloud calls at all, and the model that heals a drifted script can run on your own hardware. Tools for scrubbing PII and PHI are included, so you can clean captured data before anyone or anything sees it.',
    },
    {
        question: 'Is OpenAdapt free?',
        answer: 'Yes. OpenAdapt is MIT-licensed open source, free to use and modify. For regulated teams in healthcare and lending, we also run paid pilots with hands-on support: we help build your first workflows, set up review, and keep the automations running. Book a demo to talk about a pilot.',
    },
    {
        question: 'What software does OpenAdapt work with?',
        answer: "OpenAdapt works from what is on the screen, not from an API or browser internals, so one runner drives web apps, Windows desktop apps, and software delivered over Citrix or remote desktop alike. That means the desktop EMRs and loan systems cloud tools can't touch, with no API integration project. If a system already has a solid API, use that instead; OpenAdapt is for everything that doesn't.",
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
