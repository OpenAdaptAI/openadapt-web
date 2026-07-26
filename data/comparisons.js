// Canonical content for the /compare/<slug> alternative pages.
//
// Honesty rules (enforced by tests/comparisonPages.test.js):
// - Credit each alternative for its real strengths in its own section.
// - Differentiate OpenAdapt only on what is real today: independent
//   out-of-band business-effect verification, explicit transaction outcomes,
//   the external zero-install remote execution lane, customer-controlled
//   sensitive data, deterministic zero-model-call healthy runs, the open MIT
//   local runtime, and published qualification evidence.
// - Never differentiate on recording demos, visual targeting, Citrix
//   awareness, or self-healing: those capabilities are widely available.
// - Never state competitor pricing beyond well-known published figures, and
//   phrase those as "published pricing starts around ...".

export const OPENADAPT_DIFFERENTIATORS = [
    {
        title: 'Independent business-effect verification',
        body: 'A run is judged by an out-of-band check of the system of record, such as a read-only API call, a SQL query, or re-reading the persisted record, not by the acting session declaring itself successful.',
    },
    {
        title: 'Explicit transaction outcomes',
        body: 'Every consequential run ends verified or halted with a preserved run report. There is no silent third state where the workflow looked finished but the record never changed.',
    },
    {
        title: 'Deterministic healthy runs',
        body: 'A compiled workflow replays deterministically with zero model calls on healthy runs. Model spend is reserved for compilation and reviewable repair.',
    },
    {
        title: 'External zero-install remote lane',
        body: 'For managed Citrix, RDP, and VDI estates, OpenAdapt can drive the local client window from outside the session, so nothing is installed inside the remote environment. The lane is qualified today against a deterministic stand-in and a real FreeRDP round trip; a real ICA/HDX environment is qualified per customer before consequential use.',
    },
    {
        title: 'Customer-controlled sensitive data',
        body: 'Recordings, screenshots, and compiled bundles can stay inside your boundary. Local, self-hosted, and customer-controlled deployments are first-class, not an enterprise afterthought.',
    },
    {
        title: 'Open MIT local runtime',
        body: 'The compiler and governed runtime are MIT-licensed and inspectable. You can audit exactly what runs beside your systems of record.',
    },
    {
        title: 'Published qualification evidence',
        body: 'Each execution surface ships with bounded, published acceptance evidence, counted effects, refusals, and halts, instead of an unbounded compatibility claim.',
    },
]

const QUALIFICATION_EVIDENCE_URL =
    'https://docs.openadapt.ai/get-started/what-works-today/'

export const COMPARISONS = [
    {
        slug: 'uipath',
        name: 'UiPath',
        title: 'OpenAdapt vs UiPath',
        metaDescription:
            'When UiPath is the right choice, when OpenAdapt is, and how independent effect verification, explicit outcomes, and an open MIT runtime differ from platform RPA.',
        intro: 'UiPath is the most mature enterprise RPA platform. OpenAdapt is a governed workflow compiler with independent effect verification. They solve overlapping problems from different starting points, and for many teams the honest answer is one, the other, or both.',
        theirStrengths: {
            heading: 'Where UiPath is strong',
            items: [
                'A mature, widely deployed enterprise platform with a long production track record and deep institutional knowledge in the market.',
                'Orchestrator provides scheduling, work queues, credential vaults, role-based access, and centralized audit across large robot fleets.',
                'Mature, long-standing support for automating Citrix and other virtual desktop environments, including dedicated remote-runtime integrations.',
                'A large marketplace, extensive training through UiPath Academy, and a broad certified-partner and developer ecosystem.',
                'Attended and unattended robots, a very large activity library, and adjacent products for document understanding and process mining.',
            ],
        },
        chooseThem:
            'Choose UiPath when you are standardizing hundreds of automations on one enterprise platform, need mature fleet orchestration today, or already have UiPath licenses, developers, and a center of excellence.',
        chooseUs:
            'Choose OpenAdapt when the workflows that matter are consequential transactions where you need the system of record independently confirmed after every run, when sensitive data must stay in your boundary on an inspectable MIT runtime, or when you want a zero-install lane into managed remote estates.',
        honestNote:
            'Recording a demonstration, visual targeting, and repairing broken selectors are not differentiators in either direction: modern RPA platforms and OpenAdapt all do these. The difference is how a run is judged and what a failure is allowed to look like.',
    },
    {
        slug: 'power-automate',
        name: 'Microsoft Power Automate',
        title: 'OpenAdapt vs Microsoft Power Automate',
        metaDescription:
            'When Power Automate is the right choice, when OpenAdapt is, and how independent verification and customer-controlled execution differ from ecosystem RPA.',
        intro: 'Power Automate is the default automation layer of the Microsoft ecosystem, and for Microsoft-centric work it is very hard to beat on integration and price. OpenAdapt is a governed workflow compiler focused on consequential GUI transactions with independent verification.',
        theirStrengths: {
            heading: 'Where Power Automate is strong',
            items: [
                'Deep, native integration with Microsoft 365, Teams, Excel, SharePoint, Dataverse, and Azure identity.',
                'Hundreds of prebuilt connectors for cloud flows, so API-first automation often needs no custom code at all.',
                'Power Automate for desktop is included with Windows 11 for attended local flows, which makes experimentation essentially free.',
                'Aggressive published pricing for an enterprise suite: premium per-user plans start around $15 per user per month, and hosted RPA bots are in the roughly $215 per bot per month class.',
                'Centralized administration and governance through the Power Platform admin center for organizations already run on Microsoft tooling.',
            ],
        },
        chooseThem:
            'Choose Power Automate when the work lives inside the Microsoft ecosystem, when a supported connector already reaches the system you need, or when low per-seat cost across many light automations matters more than transaction-level verification.',
        chooseUs:
            'Choose OpenAdapt when the last mile is a non-Microsoft or legacy GUI, when a wrong write is expensive enough that you need the business effect independently verified out of band, when runs must end in an explicit verified-or-halted outcome, or when the runtime must be open, local, and customer-controlled.',
        honestNote:
            'If a supported connector or API completes the workflow reliably, use it. OpenAdapt exists for the UI-only remainder where no practical API exists and correctness has to be proved, not assumed.',
    },
    {
        slug: 'computer-use-agents',
        name: 'computer-use agents',
        title: 'OpenAdapt vs computer-use agents',
        metaDescription:
            'When Claude or OpenAI computer use is the right choice, when OpenAdapt is, and why deterministic replay with independent verification fits repeated consequential work.',
        intro: 'Computer-use agents from Anthropic and OpenAI point a frontier model at the screen and let it reason its way through a task. That flexibility is real and improving fast. OpenAdapt compiles a demonstration once and replays it deterministically, reserving models for compilation and repair.',
        theirStrengths: {
            heading: 'Where computer-use agents are strong',
            items: [
                'Genuine flexibility on novel, one-off, or loosely specified tasks, with no per-workflow setup or authoring step.',
                'They generalize across unfamiliar interfaces and recover from situations no one anticipated in advance.',
                'Capability improves with every model generation, without any change to your workflow definitions.',
                'A plain-language instruction is the whole interface, which makes them accessible to anyone who can describe the task.',
            ],
        },
        chooseThem:
            'Choose a computer-use agent for exploratory, novel, or constantly changing work, for research and triage, or for tasks you will run a handful of times and never again.',
        chooseUs:
            'Choose OpenAdapt when the same consequential workflow repeats: healthy runs are deterministic with zero model calls and zero per-run token cost, every run ends verified or halted against an independent check of the system of record, and the runtime is MIT-licensed and can execute entirely inside your boundary.',
        honestNote:
            'These approaches are complementary rather than rivals: agent providers themselves recommend human oversight for consequential actions, and OpenAdapt uses models too, at compile and repair time rather than on every healthy run. The question is whether each run should re-reason the task or replay a verified program.',
    },
    {
        slug: 'record-and-replay',
        name: 'record-and-replay tools',
        title: 'OpenAdapt vs record-and-replay tools',
        metaDescription:
            'When record-and-replay tools, including OpenAI Record & Replay, are the right choice, and what independent verification and explicit outcomes add for consequential work.',
        intro: 'Recording a demonstration and replaying it is now a mainstream authoring model, from classic macro recorders to OpenAI shipping Record & Replay for repeated tasks. OpenAdapt shares the authoring model, so the real comparison is what happens after the recording, not the recording itself.',
        theirStrengths: {
            heading: 'Where record-and-replay tools are strong',
            items: [
                'The fastest possible authoring: demonstrate the task once and it becomes repeatable, with no selectors or code.',
                'Accessible to non-developers, so the people who actually do the work can automate it themselves.',
                'Replay avoids re-reasoning the task from scratch on every run, which keeps repeat runs fast and cheap.',
                "OpenAI's Record & Replay brings demonstration-based authoring to a mainstream audience, which validates the model for everyone building on it.",
            ],
        },
        chooseThem:
            'Choose a lightweight record-and-replay tool for personal productivity, low-stakes repetitive tasks, and workflows where an occasional silent miss costs little.',
        chooseUs:
            'Choose OpenAdapt when a replayed action writes to a system of record that matters: the compiled program is reviewable, healthy runs are deterministic with zero model calls, the business effect is verified out of band after the run, ambiguity halts instead of guessing, and the MIT runtime plus your data can stay entirely inside your boundary.',
        honestNote:
            'Recording is the commodity; OpenAdapt does not claim to record better. The difference is governance: an independent verifier, an explicit verified-or-halted outcome for every run, and published qualification evidence per execution surface.',
    },
    {
        slug: 'browser-agents',
        name: 'browser-agent platforms',
        title: 'OpenAdapt vs browser-agent platforms',
        metaDescription:
            'When browser-agent platforms are the right choice, when OpenAdapt is, and how independent verification and customer-controlled execution differ for consequential web work.',
        intro: 'Browser-agent platforms combine web automation frameworks, language models, and often managed cloud browsers into a fast way to automate web tasks. For prototyping and web-only work they are excellent. OpenAdapt targets repeated, consequential workflows across browser, desktop, and remote surfaces with verification at the center.',
        theirStrengths: {
            heading: 'Where browser-agent platforms are strong',
            items: [
                'Very fast setup for web tasks: point an agent at a URL and useful behavior often emerges in minutes.',
                'Managed cloud-browser infrastructure removes the burden of running and scaling browsers yourself.',
                'Strong fit for scraping, research, monitoring, and other read-heavy web work where a retry is cheap.',
                'Active open-source and commercial ecosystems iterating quickly on web-agent capability.',
            ],
        },
        chooseThem:
            'Choose a browser-agent platform for web-only, read-heavy, or exploratory automation, for prototypes, and for workloads where a failed or repeated attempt has little cost.',
        chooseUs:
            'Choose OpenAdapt when the workflow also crosses desktop or remote surfaces, when the acting session must not be the judge of its own success, when every consequential run needs an explicit verified-or-halted outcome, or when sensitive data cannot transit a vendor cloud and must run on a customer-controlled MIT runtime.',
        honestNote:
            'Most browser-agent stacks judge success in-band: the same session that acted decides whether it worked. OpenAdapt verifies the business effect out of band, against the system of record, after the run.',
    },
    {
        slug: 'hand-rolled-scripts',
        name: 'hand-rolled scripts',
        title: 'OpenAdapt vs hand-rolled scripts',
        metaDescription:
            'When Playwright, Selenium, or AutoHotkey scripts are the right choice, when OpenAdapt is, and what governance adds beyond a working script.',
        intro: 'A script written with Playwright, Selenium, AutoHotkey, or PyAutoGUI is free, precise, and completely under your control. Plenty of production automation runs this way for good reasons. OpenAdapt is also open and local; what it adds is the governance around the script you would otherwise build yourself.',
        theirStrengths: {
            heading: 'Where hand-rolled scripts are strong',
            items: [
                'Zero license cost and no vendor relationship: the whole stack is open source and yours.',
                'Exact control over every step, wait, and assertion, with the full power of a general-purpose language.',
                'Mature frameworks, huge communities, and years of accumulated answers for almost any situation.',
                'For a developer who owns the workflow, a small script is often the fastest and simplest correct answer.',
            ],
        },
        chooseThem:
            'Keep a hand-rolled script when it already works, a developer owns and maintains it, and its failure modes are understood and affordable.',
        chooseUs:
            'Choose OpenAdapt when scripts have become an unowned maintenance burden, when non-developers need to author workflows by demonstration, or when you need what scripts rarely include: independent out-of-band verification of the business effect, an explicit verified-or-halted outcome with a preserved run report, and halts on ambiguity instead of best-effort clicks. The runtime is MIT-licensed, so you trade none of the openness.',
        honestNote:
            'OpenAdapt does not claim your script cannot work. It packages the verification, outcome discipline, and audit trail that consequential scripts eventually grow by hand, and it publishes qualification evidence per surface instead of assuming coverage.',
    },
]

export const COMPARISON_LINKS = COMPARISONS.map(({ slug, name, title }) => ({
    slug,
    name,
    title,
    href: `/compare/${slug}`,
}))

export { QUALIFICATION_EVIDENCE_URL }
