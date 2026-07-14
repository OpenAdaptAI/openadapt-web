export const faqItems = [
    {
        question: 'What is OpenAdapt?',
        answer: 'OpenAdapt is an open-source tool for automating desktop work. You do a task once while it records you, and it turns that recording into a script that runs on your own machines and repairs itself when the screen changes. A healthy run makes no cloud AI calls, so it costs nothing to run.',
    },
    {
        question: 'How is OpenAdapt different from RPA tools like UiPath?',
        answer: 'With traditional RPA, someone hand-builds the automation, and it breaks when the screen changes. With OpenAdapt you just record the task once. When the screen changes, it fixes itself and shows you the change to approve. And it runs entirely on your own machines.',
    },
    {
        question: 'How is OpenAdapt different from AI computer-use agents?',
        answer: 'An AI agent works out your task from scratch on every run, so it is slow, unpredictable, and charges you each time. OpenAdapt learns the task once and replays it locally for free. It only calls an AI model when the screen changes and the script needs a repair.',
    },
    {
        question: 'Does my data leave my machines?',
        answer: 'No. It stays inside your network. Recordings, scripts, and replays all live on your own machines, and a healthy run makes no cloud calls at all. When the screen changes and the script needs a repair, that runs an AI model, but you can run that model on your own hardware inside your network, so your data never goes to a third party. Tools for scrubbing PII and PHI are included, so you can clean captured data before anyone or anything sees it.',
    },
    {
        question: 'Is OpenAdapt free?',
        answer: 'Yes. OpenAdapt is MIT-licensed open source, free to use and modify. For regulated teams in healthcare and lending, we also run paid pilots with hands-on support: we help build your first workflows, set up review, and keep the automations running. Book a demo to talk about a pilot.',
    },
    {
        question: 'What software does OpenAdapt work with?',
        answer: "OpenAdapt works from what is on the screen, not from an API or browser internals. Today it handles web apps, including web EMRs. Because it works from the screen, the same approach can reach desktop apps and software delivered over Citrix or remote desktop. Those adapters are in progress. The goal is to automate the desktop EMRs and loan systems that cloud tools can't touch, with no API integration project.",
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
