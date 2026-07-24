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
    const snapshot = read('data/repositoryStats.js')
    const loader = read('lib/openAdaptRepositoryStats.js')
    const endpoint = read('pages/api/repository-stats.js')
    const hook = read('hooks/useRepositoryStats.js')
    const paper = read('pages/paper.js')

    assert.match(snapshot, /OPENADAPT_REPOSITORY = 'OpenAdaptAI\/OpenAdapt'/)
    assert.match(snapshot, /stars: 1648/)
    assert.match(snapshot, /forks: 258/)
    assert.match(snapshot, /source: 'snapshot'/)
    assert.match(home, /const githubStats = OPENADAPT_STATS_SNAPSHOT/)
    assert.doesNotMatch(home, /getOpenAdaptRepositoryStats\(\)/)
    assert.match(
        home,
        /const currentGithubStats = useRepositoryStats\(githubStats\)/
    )
    assert.match(home, /<MastHead githubStats=\{currentGithubStats\} \/>/)
    assert.match(
        home,
        /<Developers[\s\S]*githubStats=\{currentGithubStats\}/
    )
    assert.match(
        home,
        /<Footer[\s\S]*repositoryStats=\{currentGithubStats\}[\s\S]*pollRepositoryStats=\{false\}/
    )
    assert.equal(
        (home.match(/useRepositoryStats\(/g) || []).length,
        1,
        'home owns one repository-stats polling hook'
    )
    assert.doesNotMatch(paper, /getOpenAdaptRepositoryStats/)
    assert.match(paper, /<Footer \/>/)
    assert.match(footer, /repositoryStats = OPENADAPT_STATS_SNAPSHOT/)
    assert.match(footer, /useRepositoryStats\(repositoryStats/)
    assert.match(footer, /enabled: pollRepositoryStats/)
    assert.match(hook, /fetch\('\/api\/repository-stats'/)
    // A failed/rate-limited refresh must keep the last good value, never blank.
    assert.match(hook, /preserve the last[\s\S]*good observation/i)
    assert.match(hook, /one-hour durable cache \(s-maxage=3600\)/)
    assert.doesNotMatch(hook, /s-maxage=600/)
    assert.match(loader, /const FRESH_TTL_MS = 10 \* 60 \* 1000/)
    assert.match(loader, /if \(inFlight\) return inFlight/)
    assert.match(loader, /source:[\s\S]*?'stale'[\s\S]*?'snapshot'/)
    assert.match(endpoint, /s-maxage=3600/)
    assert.match(endpoint, /stale-while-revalidate=86400/)
    assert.match(endpoint, /stale-if-error=86400/)
    assert.match(endpoint, /Netlify-CDN-Cache-Control/)
    assert.match(
        read('lib/githubApi.js'),
        /return \{ \.\.\.fallback \}/,
        'lib/githubApi.js must fall back to the verified stats on failure'
    )
    assert.match(
        read('utils/repositoryStatsSelection.js'),
        /nextTime === null \|\| nextTime < currentTime[\s\S]*nextTime > currentTime[\s\S]*sourceFreshness\(next\) > sourceFreshness\(current\)/,
        'all observations move monotonically by timestamp; source only breaks a tie'
    )
    assert.match(masthead, /https:\/\/github\.com\/OpenAdaptAI\/OpenAdapt/)
    assert.match(masthead, /stars on OpenAdapt/)
    assert.match(footer, /stars on OpenAdapt/)
    assert.match(footer, /forks of OpenAdapt/)
    assert.match(footer, /footer-star-count/)
    assert.match(footer, /footer-fork-count/)
    assert.doesNotMatch(masthead, /on openadapt-flow/)

    for (const page of [
        'pages/index.js',
        'pages/solutions/healthcare.js',
        'pages/solutions/lending.js',
        'pages/solutions/insurance.js',
    ]) {
        assert.match(read(page), /<Footer/, `${page} renders shared footer`)
    }
})

test('visitor browsers never call api.github.com', () => {
    // api.github.com allows 60 unauthenticated requests/hour per client IP.
    // Any client-side fetch therefore 403s for visitors on shared IPs
    // (offices, VPNs, CGNAT) and breaks the page. GitHub data must only be
    // fetched server-side: lib/ (dynamically imported in getStaticProps)
    // and pages/api/ routes.
    const clientSourceDirs = ['components', 'utils', 'pages']
    for (const dir of clientSourceDirs) {
        const entries = fs.readdirSync(path.join(root, dir), {
            recursive: true,
        })
        for (const entry of entries) {
            const relativePath = path.join(dir, String(entry))
            if (!relativePath.endsWith('.js')) continue
            if (relativePath.startsWith(path.join('pages', 'api'))) continue
            assert.doesNotMatch(
                read(relativePath),
                /https:\/\/api\.github\.com/,
                `${relativePath} must not construct an api.github.com URL — ` +
                    'fetch GitHub data server-side via lib/githubApi.js instead'
            )
        }
    }

    // The buttons.github.io widget fetches api.github.com from the browser
    // whenever a count bubble is requested — never reintroduce it.
    assert.doesNotMatch(
        read('components/Footer.js'),
        /data-show-count|github-button/,
        'third-party github-button widgets make visitor browsers call ' +
            'api.github.com; keep counts in shared footer markup instead'
    )
    assert.doesNotMatch(
        read('pages/_app.js'),
        /buttons\.github\.io/,
        'the GitHub buttons script must not run in visitor browsers'
    )

    // The server-side module holds every GitHub API call, works without a
    // token, and only uses an optional GITHUB_TOKEN to raise build limits.
    const githubApi = read('lib/githubApi.js')
    assert.match(githubApi, /https:\/\/api\.github\.com/)
    assert.match(githubApi, /process\.env\.GITHUB_TOKEN/)
    assert.doesNotMatch(githubApi, /NEXT_PUBLIC/)

    // The download page renders the release list from getStaticProps (ISR),
    // so the release data is in the initial HTML for every visitor.
    const download = read('pages/download.js')
    assert.match(download, /export async function getStaticProps/)
    assert.match(download, /getDesktopRelease/)
    assert.match(download, /revalidate: 180/)
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
    assert.match(product, /One execution model across your stack/)
    assert.match(product, /Built for the interfaces your work depends on/)
    assert.match(product, /Web applications/)
    assert.match(product, /Windows applications/)
    assert.match(product, /RDP, Citrix & VDI/)
    assert.match(product, /workflows stay inspectable, policy-bound/)
    assert.match(product, /Every production workflow is qualified against its target application/)
    assert.match(product, /tree\/main\/benchmark/)
    assert.match(product, /docs\/LIMITS\.md/)
    assert.doesNotMatch(product, /Execution substrate evidence/)
    assert.doesNotMatch(product, /Partner qualification/)
    assert.doesNotMatch(product, /No ICA\/HDX evidence/)
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
        'lib/packageDiscovery.js',
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
    assert.match(industries, /established\s+business logic/)
    assert.match(industries, /[Hh]igh-volume repeated/)
    assert.match(industries, /UI-only last-mile gap/)
    assert.match(industries, /independent (effect )?source of truth/)
    assert.match(industries, /Healthcare workflow reference/)
    assert.match(industries, /Lending operations reference/)
    assert.doesNotMatch(industries, /title: 'Healthcare clinics'/)
    assert.doesNotMatch(industries, /title: 'Mortgage & lending ops'/)
    assert.doesNotMatch(industries, /theresanaiforthat|TAAFT/i)
})

test('workflow and execution-environment selectors are independent and media-honest', () => {
    const howItWorks = read('components/HowItWorks.js')
    const overlay = read('components/ExecutionEnvironmentOverlay.js')

    for (const label of [
        'Healthcare',
        'Lending',
        'Insurance',
        'Browser',
        'Windows',
        'macOS',
        'Linux',
        'RDP',
        'Citrix',
    ]) {
        assert.match(howItWorks, new RegExp(`label: '${label}'`))
    }

    assert.match(
        howItWorks,
        /Choose a workflow and execution environment\s+independently/
    )
    assert.match(howItWorks, /aria-label="Execution environment"/)
    assert.match(howItWorks, /sourceKind: 'application-footage'/)
    assert.match(howItWorks, /sourceKind: 'environment-visualization'/)
    assert.match(howItWorks, /sourceKind: 'transport-visualization'/)
    assert.match(
        howItWorks,
        /Native Linux execution uses AT-SPI structural evidence/
    )
    assert.match(
        howItWorks,
        /Application footage and execution-environment\s+overlays are labeled separately/
    )
    assert.match(
        overlay,
        /data-environment-source-kind=\{environment\.sourceKind\}/
    )
})

test('top-level calls to action use one coherent evaluation funnel', () => {
    const sources = [
        read('components/AudiencePaths.js'),
        read('components/MastHead.js'),
        read('components/NavHeader.js'),
        read('pages/compare.js'),
    ].join('\n')

    assert.doesNotMatch(sources, /Start hosted|start_hosted/)
    assert.match(sources, /Evaluate a workflow/)
    assert.match(sources, /Try locally/)
    assert.match(sources, /Read docs/)
    assert.doesNotMatch(
        sources,
        /Qualify a workflow|Plan a pilot|Book a workflow review/
    )
})

test('end-user quickstarts enter through OpenAdapt while engine links stay technical', () => {
    const install = read('components/InstallSection.js')
    const pricing = read('components/Pricing.js')
    const templates = read('data/templates.js')
    const download = read('pages/download.js')
    const developerLinks = read('data/developerLinks.js')
    const publicSurfaces = [install, pricing, templates, download].join('\n')

    assert.match(publicSurfaces, /pip install openadapt/)
    assert.match(publicSurfaces, /openadapt flow/)
    assert.doesNotMatch(publicSurfaces, /pip install openadapt-flow/)
    assert.doesNotMatch(publicSurfaces, /uv tool uninstall openadapt/)
    assert.doesNotMatch(
        publicSurfaces,
        /openadapt-flow (?:demo-record|record|compile|lint|certify|replay)/
    )
    assert.match(
        developerLinks,
        /label: 'Compiler\/runtime source',\s+href: 'https:\/\/github\.com\/OpenAdaptAI\/openadapt-flow'/
    )
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
    assert.match(healthcare, /independent\s+source of[\s\S]*truth/)
    assert.match(healthcare, /document processing, eligibility, routing/)
    assert.match(healthcare, /final UI-only/)
    assert.doesNotMatch(healthcare, /OpenAdapt for healthcare clinics|What a clinic can compile/)
})

test('machine-readable use cases do not claim mortgage, LOS, or a healthcare vertical product', () => {
    const llms = read('public/llms.txt')

    assert.match(llms, /Healthcare Execution Infrastructure/)
    assert.match(llms, /RCM vendors, healthcare BPOs, automation teams, and vertical-software companies/)
    assert.match(llms, /Lending Operations/)
    assert.match(llms, /independent REST and SQL effect oracles/)
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
    assert.match(lending, /Lending operations/)
    assert.match(lending, /supported APIs and exports/)
    assert.match(lending, /final UI-only mile/)
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
    assert.match(demo, /evidence manifest records the exact software, task,[\s\S]*oracle, media hashes, and scope/i)
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
