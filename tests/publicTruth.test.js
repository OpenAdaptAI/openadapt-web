const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.join(__dirname, '..')
const read = (relativePath) =>
    fs.readFileSync(path.join(root, relativePath), 'utf8')

test('about and contact pages use the canonical product truth', () => {
    const about = read('pages/about.js')
    const contact = read('pages/contact.js')

    assert.match(
        about,
        /OpenAdapt compiles demonstrated GUI workflows into[\s\S]*deterministic, locally executable programs/
    )
    assert.match(about, /https:\/\/github\.com\/OpenAdaptAI\/openadapt-flow\/issues/)
    assert.doesNotMatch(about, /split into focused packages/)
    assert.doesNotMatch(about, /Everything is MIT-licensed/)
    assert.doesNotMatch(contact, /AI-powered automation/)
})

test('footer email is a real keyboard-accessible link', () => {
    assert.match(
        read('components/Footer.js'),
        /href="mailto:hello@openadapt\.ai"/
    )
})

test('GitHub proof uses the canonical repository and a verified fallback', () => {
    const home = read('pages/index.js')
    const masthead = read('components/MastHead.js')
    const footer = read('components/Footer.js')

    assert.match(home, /GITHUB_REPOSITORY = 'OpenAdaptAI\/OpenAdapt'/)
    assert.match(home, /GITHUB_STATS_FALLBACK = \{ stars: 1646, forks: 258 \}/)
    assert.match(masthead, /https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt"/)
    assert.match(footer, /href="https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt\/fork"/)
    assert.doesNotMatch(masthead, /on openadapt-flow/)
})

test('launch surfaces lead with capabilities instead of temporary gap labels', () => {
    const product = read('components/ProductStatus.js')
    const pricing = read('components/Pricing.js')
    const llms = read('public/llms.txt')
    const readme = read('README.md')

    for (const label of [
        'Research spike',
        'macOS native workflows',
        'Product maturity',
    ]) {
        assert.doesNotMatch(product, new RegExp(label, 'i'))
    }
    assert.match(product, /One governed workflow, end to end/)
    assert.match(product, /Customer-controlled deployment/)
    assert.match(product, /Execution substrate evidence/)
    for (const substrate of [
        'Browser / Playwright',
        'Windows UIA',
        'Native macOS',
        'RDP',
        'Citrix',
    ]) {
        assert.match(product, new RegExp(substrate.replace('/', '\\/')))
    }
    for (const label of [
        'Public beta',
        'Partner qualification',
        'Design partner needed',
        'Reference lifecycle accepted',
        'Scoped acceptance passed',
        'Scoped TextEdit evidence accepted',
        'Scoped RDP evidence accepted',
        'No ICA/HDX evidence',
    ]) {
        assert.match(product, new RegExp(label))
    }
    assert.doesNotMatch(product, /RDP \/ Citrix/)
    assert.match(product, /RDP evidence is not treated as Citrix evidence/)
    assert.match(product, /Evidence state/)
    assert.match(product, /not in the hosted browser launch candidate/)
    assert.match(product, /20260717-candidate-56759c8-v2 in-tree WinForms matrix completed 3\/3 trials/)
    assert.match(product, /independent SQLite oracle confirmed 3\/3 effects/)
    assert.match(product, /stale-target and ambiguous-target controls each refused 3\/3/)
    assert.match(product, /not arbitrary Windows applications or hosted desktop/)
    assert.match(product, /preserves earlier rejected diagnostic runs/)
    assert.match(product, /candidate b1b61a5 completed 3\/3 exact-byte TextEdit trials/)
    assert.match(product, /immutable batch report remains failed/)
    assert.match(product, /SHA-256-bound adjudication verified actual process and temporary-file cleanup/)
    assert.match(product, /not clean-machine, design-partner, production, or broad macOS evidence/)
    assert.match(product, /0 silent incorrect successes and 0 over-halts/)
    assert.match(product, /candidate 82a658a completed 3\/3 trials/)
    assert.match(product, /unique file through the Windows Run dialog over network RDP/)
    assert.match(product, /Independent guest-tools readback confirmed the exact file contents/)
    assert.match(product, /51\.845s, 10\.467s, and 7\.477s/)
    assert.match(product, /0 failures, 0 silent incorrect successes, 0 over-halts, and 0 model calls/)
    assert.match(product, /restored the exact eight-snapshot inventory/)
    assert.match(product, /returned the current pointer without resume to the unchanged original base/)
    assert.match(product, /not arbitrary RDP applications, record-level identity, clean-machine or production support, hosted RDP, or Citrix ICA\/HDX/)
    assert.match(
        product,
        /blob\/defafbae758a75c8e149d9693f2cffe1f2264b8c\/benchmark\/windows_uia\/results\.json/
    )
    assert.match(
        product,
        /blob\/ca1b522cad215875f7471782283f8f8bb8e6c998\/benchmark\/macos_native\/textedit_counted_3plus1_b1b61a5_20260717\.adjudication\.json/
    )
    assert.match(
        product,
        /blob\/6610d24cebba27918b8ea507b2f05a094057ac85\/benchmark\/rdp\/results_82a658a_20260718\.sanitized\.json/
    )
    assert.doesNotMatch(pricing, /Offer unavailable|Hosted checkout unavailable/)
    assert.match(pricing, /Start with our team/)
    assert.doesNotMatch(llms, /Product Maturity|launching now|not implied/i)
    assert.match(llms, /How It Runs/)
    assert.doesNotMatch(readme, /Maturity matrix/i)
})

test('public slogans scope demonstrated workflows and governed repair', () => {
    const sources = [
        'pages/_app.js',
        'pages/index.js',
        'components/MastHead.js',
        'components/ReplayHero.js',
        'public/llms.txt',
        'utils/packageDiscovery.js',
        'public/how-it-works/MANIFEST.json',
    ].map(read).join('\n')

    assert.doesNotMatch(sources, /record once|runs? forever|self[- ]heal|milliseconds/i)
    assert.match(sources, /bounded demonstration|bounded workflow/i)
    assert.match(sources, /governed repair/i)
})

test('buyer-fit section leads with infrastructure operators, not vertical claims', () => {
    const industries = read('components/IndustriesGrid.js')

    for (const buyer of [
        'Automation teams & BPO operators',
        'RCM & vertical-software vendors',
        'Regulated enterprise operations',
    ]) {
        assert.match(industries, new RegExp(buyer.replace('&', '\\&')))
    }
    assert.match(industries, /structured inputs/)
    assert.match(industries, /existing\s+business logic/)
    assert.match(industries, /high repeated volume/)
    assert.match(industries, /UI-only last-mile gap/)
    assert.match(industries, /independent (effect )?source of truth/)
    assert.match(industries, /Healthcare workflow reference/)
    assert.match(industries, /Lending operations reference/)
    assert.doesNotMatch(industries, /title: 'Healthcare clinics'/)
    assert.doesNotMatch(industries, /title: 'Mortgage & lending ops'/)
})

test('top-level calls to action qualify a workflow instead of implying hosted activation', () => {
    const sources = [
        read('components/AudiencePaths.js'),
        read('components/MastHead.js'),
        read('components/NavHeader.js'),
        read('pages/compare.js'),
    ].join('\n')

    assert.doesNotMatch(sources, /Start hosted|start_hosted/)
    assert.match(sources, /Qualify a workflow/)
    assert.match(sources, /Plan a pilot/)
})

test('healthcare page sells verified last-mile infrastructure, not a clinic vertical product', () => {
    const healthcare = read('pages/solutions/healthcare.js')

    for (const buyer of [
        'RCM vendors',
        'healthcare BPOs',
        'automation teams',
        'vertical-software companies',
    ]) {
        assert.match(healthcare, new RegExp(buyer))
    }
    assert.match(healthcare, /structured\s+input and business logic/)
    assert.match(healthcare, /independent source of truth/)
    assert.match(healthcare, /does not parse referrals/)
    assert.match(healthcare, /remaining UI-only gap/)
    assert.doesNotMatch(healthcare, /OpenAdapt for healthcare clinics|What a clinic can compile/)
})

test('machine-readable use cases do not claim mortgage, LOS, or a healthcare vertical product', () => {
    const llms = read('public/llms.txt')

    assert.match(llms, /Healthcare Execution Infrastructure/)
    assert.match(llms, /RCM vendors, healthcare BPOs, automation teams, and vertical-software companies/)
    assert.match(llms, /Lending Operations Reference/)
    assert.match(llms, /not evidence of a production lending integration/)
    assert.doesNotMatch(llms, /Healthcare Clinics|Mortgage|\bLOS\b/)
})

test('public repository declares its lifecycle state', () => {
    assert.match(read('README.md'), /Lifecycle: Beta/)
})

test('lending page shows a real Frappe workflow demo without reusing healthcare media', () => {
    const lending = read('pages/solutions/lending.js')
    const demo = read('components/LendingWorkflowDemo.js')

    assert.doesNotMatch(lending, /import HowItWorks/)
    assert.match(lending, /import LendingWorkflowDemo/)
    assert.match(lending, /Lending Operations Reference/)
    assert.match(lending, /Prefer supported APIs/)
    assert.match(lending, /remaining UI-only browser gap/)
    assert.match(lending, /not evidence of[\s\S]*production lending integration/)
    assert.doesNotMatch(`${lending}\n${demo}`, /OpenEMR|mortgage|Encompass/i)
    assert.match(demo, /frappe-lending-workflow-demo/)
    assert.match(demo, /From demonstration to verified Frappe write/)
    assert.match(demo, /synthetic local fixture/i)
    assert.match(demo, /separately authenticated read-only REST session/)
    assert.match(demo, /direct SQL delta audit/)
    assert.match(demo, /6\/6 compiled trials correct/)
    assert.match(demo, /0 silent incorrect successes/)
    assert.match(demo, /0 over-halts/)
    assert.match(demo, /0 model calls/)
    assert.match(demo, /\/lending-demo\/record-frappe\.gif/)
    assert.match(demo, /\/lending-demo\/replay-frappe\.gif/)
    assert.match(demo, /import Clip from '\.\/Clip'/)
    assert.match(demo, /<Clip clip=\{clips\.record\}/)
    assert.match(demo, /<Clip clip=\{clips\.replay\}/)
    assert.doesNotMatch(demo, /<picture>|prefers-reduced-motion/)
    assert.doesNotMatch(demo, /Pause animation|Play animation/)
    assert.match(demo, /\/lending-demo\/provenance\.json/)
    assert.match(demo, /Inspect evidence manifest/)
    assert.match(demo, /not establish production lending reliability/)
    assert.match(demo, /Frappe Lending v16\.2\.0/)
    assert.doesNotMatch(demo, /lending-evidence-placeholder|awaiting oracle verification/i)
})

test('lending demo media has durable synthetic evidence provenance', () => {
    const provenance = JSON.parse(read('public/lending-demo/provenance.json'))

    assert.equal(provenance.synthetic_fixture, true)
    assert.equal(provenance.source.recording_id, 'recording-live-valid11')
    assert.equal(provenance.source.benchmark_commit.length, 40)
    assert.equal(provenance.evidence.compiled_trials, 6)
    assert.equal(provenance.evidence.compiled_correct, 6)
    assert.equal(provenance.evidence.compiled_silent_incorrect_successes, 0)
    assert.equal(provenance.evidence.compiled_over_halts, 0)
    assert.equal(provenance.evidence.compiled_model_calls, 0)
    assert.equal(provenance.evidence.publication_ready_comparative_matrix, false)
    assert.equal(provenance.software.lending.commit.length, 40)
    assert.equal(provenance.software.frappe.commit.length, 40)
    assert.equal(provenance.software.erpnext.commit.length, 40)
    assert.match(provenance.evidence.oracle, /read-only Frappe REST.*direct SQL.*table-delta/i)
    assert.match(provenance.limitations, /not.*reliability.*Windows.*Citrix/i)
    assert.match(provenance.trademark_notice, /registered trademark/i)

    for (const [filename, metadata] of Object.entries(provenance.media)) {
        const digest = crypto
            .createHash('sha256')
            .update(fs.readFileSync(path.join(root, 'public/lending-demo', filename)))
            .digest('hex')
        assert.equal(metadata.sha256, digest)
    }
})

test('sitemap includes launch, download, and trust surfaces', () => {
    const sitemap = read('public/sitemap.xml')
    for (const route of ['pricing', 'download', 'security', 'safety']) {
        assert.match(sitemap, new RegExp(`https://openadapt\\.ai/${route}`))
    }
})
