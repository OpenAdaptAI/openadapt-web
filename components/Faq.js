export const faqItems = [
    {
        question: 'What is OpenAdapt?',
        answer: 'OpenAdapt is an open-source governed workflow compiler for repeated GUI work. You demonstrate a task; it compiles the trace into a deterministic local program. Configured verification decides whether UI drift is re-resolved, needs a proposed repair, or must halt. A healthy replay makes no model calls.',
    },
    {
        question: 'How is OpenAdapt different from RPA tools like UiPath?',
        answer: 'Conventional RPA is broad and mature, especially on Windows, but workflows are usually built around selectors and integrations. OpenAdapt targets the narrower case where work is repetitive and consequential but the interface is visual, variable, or integration-hostile. It compiles a demonstration and uses a resolution ladder under drift instead of asking a model to re-plan every run.',
    },
    {
        question: 'How is OpenAdapt different from AI computer-use agents?',
        answer: 'A computer-use agent is appropriate for novel work because it can re-plan each run. OpenAdapt is for repeated work: healthy replay follows the compiled program locally with zero model calls. Under drift, deterministic structure, template, OCR, and geometry evidence run first. An optional model can propose a repair, but it does not make unsupported drift safe and stays subject to configured verification and policy.',
    },
    {
        question: 'Does “repair” mean every UI change is handled automatically?',
        answer: 'No. A target may be re-resolved deterministically, an optional model may propose a repair, an operator may teach a correction, or the run may halt as unsupported. Available evidence, identity coverage, postconditions, policy, and verifier configuration determine which outcome is allowed. OpenAdapt does not claim general adaptation to arbitrary application changes.',
    },
    {
        question: 'Does my data leave my machines?',
        answer: 'Self-hosted runs remain local by default. Hosted upload accepts an approved sanitized copy, not the original recording and not an assumption that compilation removed sensitive data. Live screenshots can contain sensitive data again, so they stay inside the declared managed, customer-controlled, or on-prem runtime boundary. See the security page for the exact admission and review controls.',
    },
    {
        question: 'Is OpenAdapt free?',
        answer: 'The engine is MIT-licensed and free to use or modify. OpenAdapt Cloud is a $500/month subscription for the managed browser runner, run history, evidence, usage, and governed updates; Stripe confirms the price and billing period again at checkout. Customer-controlled desktop and remote execution is offered as an enterprise deployment.',
    },
    {
        question: 'Is managed hosted execution available?',
        answer: 'Yes. OpenAdapt Cloud provides managed browser execution plus run history, reports, usage, and governed workflow updates. Desktop, RDP, and Citrix connect through self-hosted or customer-controlled runtimes under the same governance model. Start from the pricing section, then qualify the first workflow and its verification boundary during onboarding.',
    },
    {
        question: 'What software does OpenAdapt work with?',
        answer: 'OpenAdapt targets repeated workflows across browser applications, Windows UI Automation, native macOS Accessibility, Linux AT-SPI, RDP, Citrix, and other remote desktop environments. Choose managed browser execution or connect a local, self-hosted, or customer-controlled runtime for desktop, remote, private-system, and regulated workflows.',
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
