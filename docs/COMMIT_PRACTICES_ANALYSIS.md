# OpenAdapt Ecosystem: Commit & PR Practices Analysis

**Analysis Date:** January 17, 2026
**Analyst:** Claude Sonnet 4.5
**Scope:** All 7 OpenAdapt repositories

---

## Executive Summary

The OpenAdapt ecosystem shows **strong adherence to Angular commit conventions** and **active use of PRs** in the main repository, with automated versioning via `python-semantic-release`. However, newer sub-packages (openadapt-ml, openadapt-viewer, openadapt-capture, openadapt-evals, openadapt-tray) currently have:

1. **No branch protection** (except openadapt-web)
2. **Mixed commit message styles** (some Angular, some not)
3. **Direct pushes to main** in some cases
4. **No automated versioning setup**

**Key Findings:**
- Main OpenAdapt repo: ~95%+ Angular commits, strong PR discipline, automated releases
- openadapt-web: PRs enforced, ~60% Angular commits, no automated versioning
- Sub-packages: Variable practices, no branch protection, no automated versioning

**Recommendations:**
1. Extend branch protection to all repositories
2. Enforce Angular commits via commitlint + GitHub Actions
3. Set up python-semantic-release for all Python packages
4. Update all CLAUDE.md files with commit conventions
5. Create organization-wide CONTRIBUTING.md template

---

## Detailed Repository Analysis

### 1. OpenAdapt (Main Repository)

**Repository:** https://github.com/OpenAdaptAI/OpenAdapt
**Primary Maintainer:** Richard Abrich (80% of recent commits)

#### Current State

**Branch Protection:** ✅ ENABLED
- Requires 1 approving review
- Requires code owner review
- Required status checks: `run-ci (macos-latest)`
- Enforces PR workflow
- Does NOT enforce linear history
- Admin bypass enabled (but documented not to use)

**Commit Message Style:** ✅ ANGULAR CONVENTIONS
- Analysis of last 100 commits:
  - ~95% follow Angular conventions (feat, fix, docs, chore, build, etc.)
  - Automated version commits: "1.0.4", "1.0.3", etc.
  - Merge commits from PRs
  - Almost all commits co-authored with "Claude Sonnet 4.5 <noreply@anthropic.com>"

**Sample Recent Commits:**
```
docs: simplify roadmap and fix Python version claims
fix: Resolve MkDocs broken links in production-execution-design.md
fix: Use filename-based GitHub Actions badge URL
chore: Update author email to richard@openadapt.ai
build(deps): bump actions/checkout from 4 to 6 (#961)
```

**PR vs Direct Push:** ✅ PR-BASED
- Last 30 commits show consistent PR usage
- Merge commit format: "Merge pull request #XXX from OpenAdaptAI/branch-name"
- Clean commit history with descriptive branch names

**Automated Versioning:** ✅ CONFIGURED
- Tool: `python-semantic-release@v10.5.3`
- Workflow: `.github/workflows/release-and-publish.yml`
- Triggers: On push to main
- Actions:
  1. Analyzes commits for semantic versioning
  2. Updates version in pyproject.toml
  3. Creates git tag
  4. Publishes to PyPI via Poetry
- Bot commits: "OpenAdapt Bot <bot@openadapt.ai>"
- Skip logic: Prevents infinite loops by checking committer name

**Configuration Files:**
- `pyproject.toml`: Basic metadata, NO semantic-release config section
- No `.releaserc` or `release.config.js` found
- No `commitlint.config.js` or commit message validation
- Semantic release likely using default Angular conventions

**CLAUDE.md Guidance:**
```markdown
### Always Use Pull Requests
**NEVER push directly to the `main` branch.** Always create a feature branch
and submit a PR, even for small changes.
```
- Clear, but **does NOT mention commit message conventions**
- No guidance on Angular commit format

#### Strengths
1. Strong automated versioning pipeline
2. Excellent PR discipline
3. Consistent Angular commit messages
4. Branch protection configured
5. Co-authorship attribution (Claude)

#### Gaps
1. No commitlint enforcement (can still push bad commits to branches)
2. No commit message template or guidance in CLAUDE.md
3. Admin bypass enabled (risky)
4. No linear history requirement (can have messy merges)

---

### 2. openadapt-web

**Repository:** https://github.com/OpenAdaptAI/openadapt-web
**Type:** Next.js website
**Current Directory:** /Users/abrichr/oa/src/openadapt-web

#### Current State

**Branch Protection:** ✅ PARTIAL
- Requires 1 approving review
- NO required status checks
- NO code owner requirement
- Allows force pushes: NO
- Admin bypass enabled

**Commit Message Style:** ⚠️ MIXED
- Analysis of last 30 commits shows mix of:
  - Angular style: `feat(stats): add PyPI download statistics`, `fix: add API proxy`
  - Non-Angular: `Fix mobile responsiveness issues (#113)`, `Add documentation link`
  - Merge commits: `Merge pull request #112 from...`

**Sample Recent Commits:**
```
Fix mobile responsiveness issues (#113)                    [Non-Angular]
fix: update broken README anchor link                      [Angular]
Fix broken privacy link and improve landing page copy      [Non-Angular]
Fix PyPI chart legend overflow for 10+ packages (#111)     [Non-Angular]
feat(stats): add PyPI download statistics visualization    [Angular]
chore: add cache buster to force fresh Netlify build       [Angular]
```

**Pattern:** ~60% Angular, 40% plain English

**PR vs Direct Push:** ✅ PR-BASED
- Recent commits show consistent PR usage
- Some direct pushes for urgent fixes (e.g., `chore: trigger Netlify rebuild`)

**Automated Versioning:** ❌ NOT CONFIGURED
- No semantic-release workflow
- No version bumping automation
- Website doesn't need versioning (deploy-based)

**CLAUDE.md Guidance:**
```markdown
### Always Use Pull Requests
**NEVER push directly to the `main` branch.** Always create a feature branch
and submit a PR, even for small changes.
```
- Clear PR guidance
- **No mention of commit message format**

#### Strengths
1. Good PR discipline
2. Branch protection exists
3. Clear CLAUDE.md with examples

#### Gaps
1. Inconsistent commit message format
2. No commit message guidance in CLAUDE.md
3. No automated versioning (not critical for website)

---

### 3. openadapt-ml

**Repository:** https://github.com/OpenAdaptAI/openadapt-ml
**Type:** Python package (ML training/inference)

#### Current State

**Branch Protection:** ❌ NOT PROTECTED
- No branch protection rules
- Direct pushes allowed

**Commit Message Style:** ⚠️ MIXED
- Last 30 commits show varied patterns:
  - Angular: `feat: add unified baseline adapters`, `test: add unit tests`, `chore: update uv.lock`
  - Non-Angular: `Add architecture docs, literature review`, `Move dashboard requirement to TOP`
  - Some PRs: `Merge pull request #6`, `Merge pull request #1`

**Sample Recent Commits:**
```
Add GitHub Actions CI workflow (#6)                              [Non-Angular PR title]
feat: add unified baseline adapters for VLM comparison           [Angular]
docs: add website redesign plan                                  [Angular]
refactor(benchmarks): migrate to openadapt-evals package         [Angular]
Add architecture docs, literature review, and demo tests         [Non-Angular]
```

**Pattern:** ~65% Angular, 35% non-Angular

**PR vs Direct Push:** ⚠️ MIXED
- Some PRs (e.g., #6, #1)
- Many direct pushes (especially during development)
- No consistent pattern

**Automated Versioning:** ❌ NOT CONFIGURED
- No semantic-release workflow
- Manual version bumps in pyproject.toml
- Version: 0.2.0 (last manual update Jan 9, 2026)

**CLAUDE.md Guidance:**
- Extensive (2300+ lines)
- **No mention of PR requirements or commit conventions**
- Focused on VM/Azure workflow and technical commands

#### Strengths
1. Recent commits trending toward Angular style
2. Has GitHub Actions CI (#6)

#### Gaps
1. No branch protection
2. No PR requirement documented
3. No commit message guidance
4. No automated versioning
5. CLAUDE.md missing git workflow section

---

### 4. openadapt-viewer

**Repository:** https://github.com/OpenAdaptAI/openadapt-viewer
**Type:** Python package (HTML visualization)

#### Current State

**Branch Protection:** ❌ NOT PROTECTED

**Commit Message Style:** ✅ ANGULAR (RECENT)
- Repository is very new (10 commits total, all Jan 16-17, 2026)
- All commits follow Angular conventions:

```
fix: Escape JSON for HTML attributes in Alpine.js x-data (#3)
fix: Use filename-based GitHub Actions badge URL (#2)
feat: initial openadapt-viewer package creation
build(viewer): prepare package for PyPI publishing
refactor(viewer): convert to reusable component library
test(viewer): add comprehensive test suite (82 tests)
```

**Pattern:** 100% Angular

**PR vs Direct Push:** ⚠️ MIXED
- Some PRs (#3, #2, #1)
- Some direct pushes

**Automated Versioning:** ❌ NOT CONFIGURED

**CLAUDE.md:** ✅ EXISTS
- Clear structure
- **Includes "Always use PRs, never push directly to main"**
- Does NOT include commit message format guidance

#### Strengths
1. Excellent commit message discipline from start
2. CLAUDE.md explicitly mandates PRs
3. Clean commit history

#### Gaps
1. No branch protection
2. No commit format in CLAUDE.md
3. No automated versioning

---

### 5. openadapt-capture

**Repository:** https://github.com/OpenAdaptAI/openadapt-capture
**Type:** Python package (GUI recording)

#### Current State

**Branch Protection:** ❌ NOT PROTECTED

**Commit Message Style:** ⚠️ MIXED
- 11 total commits (Dec 2025 - Jan 2026)
- Mix of Angular and non-Angular:

```
fix: comment out PyPI badges until package is published (#3)    [Angular]
feat: add faster-whisper backend for 4x faster transcription    [Angular]
feat: add browser event capture via Chrome extension            [Angular]
fix: move openai-whisper to optional [transcribe] extra         [Angular]
feat: complete GUI capture with transcription, visualization    [Angular]
feat: initial repo with design doc                              [Angular]
```

**Pattern:** ~90% Angular

**PR vs Direct Push:** ⚠️ MOSTLY DIRECT
- Few PRs (#3, #2, #1) for specific features
- Most commits direct to main

**Automated Versioning:** ❌ NOT CONFIGURED

**CLAUDE.md:** ✅ EXISTS
- States: **"Always use PRs, never push directly to main"**
- No commit message format guidance

#### Strengths
1. Good Angular commit adoption
2. CLAUDE.md PR guidance

#### Gaps
1. No branch protection
2. Direct pushes despite CLAUDE.md guidance
3. No commit format documentation
4. No automated versioning

---

### 6. openadapt-evals

**Repository:** https://github.com/OpenAdaptAI/openadapt-evals
**Type:** Python package (benchmark evaluation)

#### Current State

**Branch Protection:** ❌ NOT PROTECTED

**Commit Message Style:** ⚠️ MIXED
- 16 total commits (Jan 16-17, 2026)
- Mix of Angular and non-Angular:

```
feat: P0 fixes - API parsing and evaluate endpoint (#1)         [Angular-ish]
feat: add BaselineAgent for unified VLM comparison              [Angular]
feat: add demos, docs, tests, and CLIP dependency               [Angular]
feat(agents): add RetrievalAugmentedAgent for automatic demo    [Angular]
build: prepare package for PyPI publishing                      [Angular]
Consolidate all benchmark code from openadapt-ml                [Non-Angular]
Add WAA live adapter, Azure orchestration, and CLI              [Non-Angular]
```

**Pattern:** ~70% Angular

**PR vs Direct Push:** ⚠️ MOSTLY DIRECT
- Only 2 PRs (#2, #1) out of 16 commits

**Automated Versioning:** ❌ NOT CONFIGURED

**CLAUDE.md:** ❌ NOT FOUND (searched, not visible in recent commits)

#### Strengths
1. Decent Angular adoption

#### Gaps
1. No branch protection
2. No CLAUDE.md file
3. Mostly direct pushes
4. No automated versioning

---

### 7. openadapt-tray

**Repository:** https://github.com/OpenAdaptAI/openadapt-tray
**Type:** Python package (system tray app)

#### Current State

**Branch Protection:** ❌ NOT PROTECTED

**Commit Message Style:** ⚠️ MIXED
- Only 2 commits (Jan 17, 2026)

```
fix: add README badges for license and Python version (#1)      [Angular]
Initial implementation of openadapt-tray package                [Non-Angular]
```

**PR vs Direct Push:** ⚠️ MIXED (1 PR, 1 direct)

**Automated Versioning:** ❌ NOT CONFIGURED

**CLAUDE.md:** ❌ NOT FOUND

#### Strengths
1. Very new, started with Angular commit

#### Gaps
1. No branch protection
2. No CLAUDE.md
3. No commit conventions established
4. No automated versioning

---

## Historical Context: The Evolution Story

Based on the analysis and user context:

### Phase 1: Early Days (Pre-2025)
- **Hypothesis:** Required PRs with Angular commits
- **Autoversioning:** Likely enabled but configuration unclear
- **Discipline:** Strong

### Phase 2: Direct Push Period (Mid-2025?)
- **User Report:** "Recently may have started pushing directly to main"
- **Evidence:** This pattern visible in sub-packages like openadapt-ml, openadapt-evals
- **Reason:** Rapid development, fewer contributors, admin bypass available

### Phase 3: PR Revival (Late 2025 - Present)
- **User Report:** "Reverted back to PRs but no longer using Angular commit style"
- **Reality Check:** This is PARTIALLY TRUE
  - Main repo STILL uses Angular style (~95%)
  - But sub-packages are mixed (~60-90%)
  - CLAUDE.md files don't enforce commit format

### Phase 4: Current State (Jan 2026)
- Main repo: Excellent practices, automated versioning
- Sub-packages: Inconsistent, no branch protection, no automation
- Gap: CLAUDE.md files don't mention commit format

---

## Angular Commit Convention Analysis

### What is Angular Commit Format?

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (triggers MINOR version bump)
- `fix`: Bug fix (triggers PATCH version bump)
- `docs`: Documentation only
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (deps, config)
- `ci`: CI/CD changes
- `build`: Build system changes

**Breaking Changes:**
- Add `!` after type: `feat!: remove deprecated API`
- Or add `BREAKING CHANGE:` in footer (triggers MAJOR version bump)

**Scope (optional):**
- `feat(auth): add OAuth2 support`
- `fix(api): handle null responses`

### Pros of Angular Commits

1. **Automated Versioning**
   - `feat:` → MINOR bump (0.1.0 → 0.2.0)
   - `fix:` → PATCH bump (0.1.0 → 0.1.1)
   - `BREAKING CHANGE:` → MAJOR bump (0.1.0 → 1.0.0)
   - No manual version management

2. **Automatic CHANGELOG Generation**
   - python-semantic-release auto-generates CHANGELOGs
   - Groups commits by type (Features, Bug Fixes, etc.)
   - Links to commits and PRs

3. **Better Commit History**
   - Scannable at a glance
   - Easy to filter by type: `git log --grep="^feat"`
   - Clear intent: "feat:" vs "fix:" vs "docs:"

4. **Enforces Discipline**
   - Forces developers to think about commit purpose
   - Prevents vague commits like "update stuff"

5. **CI/CD Integration**
   - Semantic-release can auto-publish to PyPI
   - Triggers only on relevant commits (feat/fix, not docs)
   - Can skip releases if only chore/docs commits

6. **Multi-Repository Coordination**
   - Consistent format across all OpenAdapt packages
   - Easy to track changes across ecosystem
   - Tools like Lerna/semantic-release can handle monorepos

7. **Community Standard**
   - Used by Angular, Electron, VSCode, and many major projects
   - Familiar to open-source contributors
   - Good documentation and tooling

### Cons of Angular Commits

1. **Learning Curve**
   - New contributors must learn the format
   - Easy to forget or get wrong without tooling
   - Scope syntax can be confusing

2. **Strictness Can Feel Rigid**
   - Every commit must be categorized
   - "Just fix a typo" feels heavyweight: `fix: correct typo in README`
   - Can slow down rapid iteration

3. **Merge Commit Noise**
   - GitHub merge commits don't follow format: "Merge pull request #123"
   - Semantic-release must parse PR titles instead
   - Squash merging required for clean history

4. **Over-Engineering for Small Projects**
   - Simple projects may not need automated versioning
   - CHANGELOG generation less valuable for internal tools
   - More overhead than benefit

5. **Enforcement Requires Tooling**
   - Without commitlint, developers can ignore format
   - Requires GitHub Actions or pre-commit hooks
   - Setup and maintenance overhead

6. **Breaking Change Confusion**
   - `BREAKING CHANGE:` in footer vs `feat!:` syntax
   - Easy to forget for major API changes
   - Can cause incorrect version bumps

7. **Scope Proliferation**
   - Projects can accumulate many scopes: `feat(api)`, `feat(cli)`, `feat(ui)`
   - No standard list, leads to inconsistency
   - Some projects avoid scopes entirely

### Current Adherence Across OpenAdapt Repos

| Repository          | Angular % | Quality      | Automated Versioning |
|---------------------|-----------|--------------|----------------------|
| OpenAdapt (main)    | ~95%      | Excellent    | ✅ Yes (working)     |
| openadapt-web       | ~60%      | Good         | ❌ No (not needed)   |
| openadapt-ml        | ~65%      | Good         | ❌ No                |
| openadapt-viewer    | 100%      | Excellent    | ❌ No                |
| openadapt-capture   | ~90%      | Excellent    | ❌ No                |
| openadapt-evals     | ~70%      | Good         | ❌ No                |
| openadapt-tray      | 50%       | Too early    | ❌ No                |

**Observation:** High Angular adoption even WITHOUT enforcement tooling (commitlint). This suggests the developer(s) are already trained and motivated.

---

## Recommendations

### Tier 1: Critical (Implement Now)

#### 1.1 Enable Branch Protection on All Repositories

**Action:** Apply same branch protection as main OpenAdapt repo to all 6 sub-packages.

**Configuration:**
```yaml
Branch: main
✅ Require pull request reviews before merging
  - Required approving reviews: 1
  - Dismiss stale reviews: false
  - Require review from Code Owners: true (if CODEOWNERS exists)
✅ Require status checks to pass before merging
  - Require branches to be up to date before merging: true
  - Status checks: (add CI workflow names when available)
✅ Require linear history: true (recommended for cleaner git log)
❌ Allow force pushes: false
❌ Allow deletions: false
⚠️ Do not enforce for administrators: false (change if possible)
```

**Why:**
- Prevents accidental direct pushes
- Forces code review
- Ensures CI passes before merge
- Linear history makes git log cleaner

**Implementation:**
```bash
# Use GitHub API or gh CLI to apply protection
gh api repos/OpenAdaptAI/openadapt-ml/branches/main/protection -X PUT \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f required_pull_request_reviews[require_code_owner_reviews]=true \
  -f required_linear_history[enabled]=true \
  -f allow_force_pushes[enabled]=false \
  -f allow_deletions[enabled]=false
```

Repeat for:
- openadapt-ml
- openadapt-viewer
- openadapt-capture
- openadapt-evals
- openadapt-tray

**openadapt-web:** Already has protection, but add linear history requirement.

---

#### 1.2 Add Commit Message Convention to ALL CLAUDE.md Files

**Action:** Add a new section to every CLAUDE.md file documenting Angular commit format.

**Template Section:**

```markdown
### Commit Message Format

**All commits must follow Angular commit conventions for automated versioning.**

Format:
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Required types:**
- `feat`: New feature (minor version bump)
- `fix`: Bug fix (patch version bump)
- `docs`: Documentation changes
- `style`: Code style/formatting (no logic change)
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance (deps, config, etc.)
- `ci`: CI/CD changes
- `build`: Build system changes

**Optional scope:** Add context in parentheses
- `feat(auth): add OAuth2 support`
- `fix(api): handle null responses`

**Breaking changes:** Add `!` or `BREAKING CHANGE:` footer
- `feat!: remove deprecated API` (major version bump)
- OR add `BREAKING CHANGE: <description>` in commit footer

**Examples:**
\`\`\`bash
git commit -m "feat: add faster-whisper backend for transcription"
git commit -m "fix: escape JSON in HTML attributes"
git commit -m "docs: update installation instructions"
git commit -m "chore(deps): bump pytest to 8.0.0"
\`\`\`

**Why Angular commits?**
- Enables automated versioning via semantic-release
- Auto-generates CHANGELOGs
- Makes commit history scannable
- Enforces clear commit intent

**Tools:**
- This format will be enforced via commitlint in CI
- Use `git commit` (not `--no-verify` to skip hooks)
- PR titles should also follow this format (used for squash merges)

**Co-Authorship:**
When working with Claude Code, add co-authorship:
\`\`\`
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
\`\`\`
```

**Files to Update:**
1. /Users/abrichr/oa/src/openadapt-web/CLAUDE.md
2. https://github.com/OpenAdaptAI/OpenAdapt/CLAUDE.md
3. https://github.com/OpenAdaptAI/openadapt-ml/CLAUDE.md
4. https://github.com/OpenAdaptAI/openadapt-viewer/CLAUDE.md
5. https://github.com/OpenAdaptAI/openadapt-capture/CLAUDE.md
6. https://github.com/OpenAdaptAI/openadapt-evals/CLAUDE.md (create if missing)
7. https://github.com/OpenAdaptAI/openadapt-tray/CLAUDE.md (create if missing)

---

#### 1.3 Set Up Commitlint + GitHub Actions Enforcement

**Action:** Add commitlint validation to CI workflows in all repos.

**Why:**
- Catches bad commit messages before merge
- Educates contributors with clear error messages
- Automates enforcement (no manual review needed)

**Implementation:**

**Option A: Python-based (commitizen)**
```bash
# Install in dev dependencies
uv add --dev commitizen
```

**pyproject.toml:**
```toml
[tool.commitizen]
name = "cz_conventional_commits"
version = "0.1.0"
version_files = [
    "pyproject.toml:version"
]
```

**GitHub Action (.github/workflows/commitlint.yml):**
```yaml
name: Commitlint

on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - uses: actions/setup-python@v6
        with:
          python-version: '3.10'

      - name: Install commitizen
        run: pip install commitizen

      - name: Check commit messages
        run: |
          # Check all commits in the PR
          BASE_SHA=${{ github.event.pull_request.base.sha }}
          HEAD_SHA=${{ github.event.pull_request.head.sha }}
          git log --format=%s $BASE_SHA..$HEAD_SHA | while read msg; do
            echo "Checking: $msg"
            echo "$msg" | cz check --commit-msg-file -
          done

      - name: Check PR title
        run: |
          echo "${{ github.event.pull_request.title }}" | cz check --commit-msg-file -
```

**Option B: Node-based (commitlint + husky)**
Only for openadapt-web (Node.js project):

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**commitlint.config.js:**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

**GitHub Action:**
```yaml
name: Commitlint

on: [pull_request]

jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: wagoid/commitlint-github-action@v5
```

**Recommendation:** Use Option A (commitizen) for all Python repos for consistency.

---

### Tier 2: High Priority (Implement Within 1-2 Weeks)

#### 2.1 Set Up Automated Versioning for All Python Packages

**Action:** Add python-semantic-release to all Python package repos.

**Why:**
- Eliminates manual version management
- Ensures version bumps match commit history
- Auto-publishes to PyPI on release
- Generates CHANGELOGs automatically

**Implementation:**

**1. Add workflow file (.github/workflows/release-and-publish.yml):**

```yaml
name: Release and PyPI Publish

on:
  push:
    branches:
      - main

jobs:
  release-and-publish:
    runs-on: ubuntu-latest
    concurrency: release
    permissions:
      id-token: write
      contents: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
          token: ${{ secrets.ADMIN_TOKEN }}

      - name: Check if should skip
        id: check_skip
        run: |
          if [ "$(git log -1 --pretty=format:'%an')" = "OpenAdapt Bot" ]; then
            echo "skip=true" >> $GITHUB_OUTPUT
          fi

      - name: Set up Python
        if: steps.check_skip.outputs.skip != 'true'
        uses: actions/setup-python@v6
        with:
          python-version: '3.10'

      - name: Install dependencies
        if: steps.check_skip.outputs.skip != 'true'
        run: pip install poetry python-semantic-release

      - name: Python Semantic Release
        if: steps.check_skip.outputs.skip != 'true'
        uses: python-semantic-release/python-semantic-release@v10.5.3
        with:
          github_token: ${{ secrets.ADMIN_TOKEN }}
          git_committer_name: "OpenAdapt Bot"
          git_committer_email: "bot@openadapt.ai"

      - name: Build and publish to PyPI
        if: steps.check_skip.outputs.skip != 'true'
        env:
          PYPI_TOKEN: ${{ secrets.PYPI_TOKEN }}
        run: |
          git pull
          poetry config pypi-token.pypi $PYPI_TOKEN
          poetry build
          poetry publish --no-interaction --skip-existing
```

**2. Configure pyproject.toml (add semantic-release config):**

```toml
[tool.semantic_release]
version_variable = "pyproject.toml:version"
branch = "main"
upload_to_pypi = false  # Handled by separate step
build_command = "pip install poetry && poetry build"
commit_parser = "angular"
```

**3. Add required GitHub secrets:**
- `ADMIN_TOKEN`: Personal access token with repo write access
- `PYPI_TOKEN`: PyPI API token for publishing

**4. Test the workflow:**
```bash
# Make a feat commit
git checkout -b test/semantic-release
echo "# Test" >> README.md
git add README.md
git commit -m "feat: test automated versioning"
git push -u origin test/semantic-release
gh pr create --title "feat: test automated versioning" --body "Testing semantic-release"
# Merge the PR and watch the workflow run
```

**Apply to:**
- openadapt-ml
- openadapt-viewer
- openadapt-capture
- openadapt-evals
- openadapt-tray

**Note:** Main OpenAdapt repo already has this configured.

---

#### 2.2 Create Organization-Wide CONTRIBUTING.md

**Action:** Create a CONTRIBUTING.md file in each repository (or at org level).

**Why:**
- Single source of truth for contribution guidelines
- Linked automatically by GitHub in PR/issue templates
- Educates external contributors

**Template:**

```markdown
# Contributing to OpenAdapt

Thank you for your interest in contributing to OpenAdapt!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/REPO_NAME.git`
3. Install dependencies: `uv sync` (or `npm install` for openadapt-web)
4. Create a feature branch: `git checkout -b feature/my-feature`

## Commit Message Format

We use [Angular commit conventions](https://www.conventionalcommits.org/) for automated versioning.

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (→ MINOR version bump)
- `fix`: Bug fix (→ PATCH version bump)
- `docs`: Documentation
- `style`: Formatting (no logic change)
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance (deps, config)
- `ci`: CI/CD changes
- `build`: Build system

**Examples:**
```bash
git commit -m "feat: add voice transcription support"
git commit -m "fix(api): handle null responses gracefully"
git commit -m "docs: update installation instructions"
```

**Breaking changes:**
```bash
git commit -m "feat!: remove deprecated Record API"
# Or add to footer:
git commit -m "feat: redesign capture API

BREAKING CHANGE: Record class renamed to Recorder
```

## Pull Request Process

1. **Create a feature branch** (never commit to main)
2. **Write clear commits** following Angular conventions
3. **Update tests** if adding features
4. **Update docs** if changing APIs
5. **Open a PR** with a descriptive title (also following Angular format)
6. **Request review** from maintainers
7. **Address feedback** and push updates
8. **Squash merge** to keep history clean

## Code Style

- **Python:** Follow PEP 8, use `ruff` for linting
- **JavaScript:** Use Prettier and ESLint (for openadapt-web)
- **Run tests:** `uv run pytest` (Python) or `npm test` (JS)

## Questions?

- Open an issue with the `question` label
- Join our Discord: [link]
- Email: support@openadapt.ai

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
```

**Add to:**
- All 7 repositories

---

#### 2.3 Add GitHub Issue/PR Templates

**Action:** Create `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`.

**Why:**
- Guides contributors to provide necessary information
- Reminds about commit conventions
- Saves maintainer time

**Pull Request Template (.github/PULL_REQUEST_TEMPLATE.md):**

```markdown
## Description
<!-- Describe your changes in detail -->

## Type of Change
<!-- Mark with an 'x' -->
- [ ] 🐛 Bug fix (fix: ...)
- [ ] ✨ New feature (feat: ...)
- [ ] 📚 Documentation (docs: ...)
- [ ] 🎨 Code style/refactor (style:/refactor: ...)
- [ ] ⚡ Performance improvement (perf: ...)
- [ ] ✅ Test addition/update (test: ...)
- [ ] 🔧 Maintenance (chore: ...)
- [ ] 💥 Breaking change (add `!` or `BREAKING CHANGE:`)

## Commit Message Format
<!-- Your PR title and commits should follow Angular conventions -->
**PR Title:** `<type>(<scope>): <subject>`

Example: `feat(capture): add audio transcription support`

## Related Issues
<!-- Link any related issues -->
Closes #

## Testing
<!-- Describe how you tested your changes -->
- [ ] Unit tests pass (`uv run pytest`)
- [ ] Manual testing completed
- [ ] CI checks pass

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have updated documentation (if needed)
- [ ] I have added tests (if applicable)
- [ ] My commits follow Angular conventions
- [ ] My PR title follows Angular conventions
```

---

### Tier 3: Nice to Have (Implement When Convenient)

#### 3.1 Add Pre-Commit Hooks

**Action:** Use `pre-commit` framework to run commitlint locally.

**Why:**
- Catches bad commits before push
- Faster feedback than waiting for CI
- Educates developers in real-time

**Implementation:**

```bash
# Install pre-commit
uv add --dev pre-commit
```

**.pre-commit-config.yaml:**
```yaml
repos:
  - repo: https://github.com/commitizen-tools/commitizen
    rev: v3.13.0
    hooks:
      - id: commitizen
        stages: [commit-msg]

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.0
    hooks:
      - id: ruff
      - id: ruff-format

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
```

**Install hooks:**
```bash
pre-commit install --hook-type commit-msg
```

**Note:** Optional since CI will catch issues anyway, but improves DX.

---

#### 3.2 Add Commit Message Examples to Git Config

**Action:** Create commit message templates.

**.gitmessage:**
```
# <type>(<scope>): <subject>
# |<----  Max 50 chars  ---->|

# <body>
# |<----  Max 72 chars  ---->|

# <footer>

# Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build
# Scope: optional, e.g., (api), (cli), (ui)
# Subject: imperative mood, lowercase, no period
# Body: explain *what* and *why* (not *how*)
# Footer: BREAKING CHANGE: <description>, Closes #<issue>
```

**Set as default:**
```bash
git config commit.template .gitmessage
```

---

#### 3.3 Document Squash vs Merge Strategy

**Action:** Add merge strategy guidance to CLAUDE.md.

**Why:**
- Squash merging keeps history clean
- But loses individual commit details
- Need clear policy

**Recommendation:**

```markdown
### Merge Strategy

**Use squash merging for most PRs:**
```bash
gh pr merge --squash --delete-branch
```

This keeps the main branch history clean with one commit per feature/fix.

**When to use regular merge:**
- Large PRs with many independent commits
- When commit history provides valuable context
- For dependabot PRs (preserve individual dep updates)

**Never use:**
- Rebase merging (can cause confusion with semantic-release)
- Fast-forward merging (loses PR association)
```

---

## Implementation Roadmap

### Week 1: Immediate Actions
- [ ] Enable branch protection on all 6 sub-package repos
- [ ] Update all CLAUDE.md files with commit message format section
- [ ] Add commitlint GitHub Action to all repos
- [ ] Create CONTRIBUTING.md template and add to all repos

### Week 2-3: Automation Setup
- [ ] Set up python-semantic-release for openadapt-ml
- [ ] Set up python-semantic-release for openadapt-viewer
- [ ] Set up python-semantic-release for openadapt-capture
- [ ] Set up python-semantic-release for openadapt-evals
- [ ] Set up python-semantic-release for openadapt-tray
- [ ] Test automated versioning with test PRs

### Week 4: Polish
- [ ] Add PR/issue templates to all repos
- [ ] Add pre-commit hooks (optional)
- [ ] Create .gitmessage template
- [ ] Document merge strategy in CLAUDE.md files
- [ ] Announce new policies in README/docs

### Ongoing: Enforcement
- [ ] Monitor PR compliance
- [ ] Educate contributors who violate format
- [ ] Review commitlint failures in CI
- [ ] Refine scope usage across repos

---

## Frequently Asked Questions

### Q: Why not just use plain English commit messages?
**A:** Plain English is fine for small projects, but OpenAdapt is:
1. **Multi-package ecosystem** (7 repos) - needs consistency
2. **Automated releases** - semantic-release requires Angular format
3. **Open source** - needs contributor-friendly standards

Without Angular commits, you must:
- Manually decide version bumps (human error prone)
- Manually write CHANGELOGs (time-consuming)
- Manually publish to PyPI (more manual steps)

### Q: What if I forget the format?
**A:**
1. CI will reject your PR with a clear error message
2. Use commit message templates (`.gitmessage`)
3. Reference CLAUDE.md or CONTRIBUTING.md
4. Use `commitizen` CLI: `cz commit` (interactive prompt)

### Q: Do I need a scope?
**A:** Scopes are **optional**. Use them when helpful:
- Large projects with modules: `feat(auth):`, `fix(api):`
- Small projects: `feat: add feature` is fine

### Q: What about merge commits?
**A:**
- GitHub merge commits don't follow format: `Merge pull request #123`
- That's OK! Semantic-release parses **PR titles** instead
- **Squash merging** is preferred (one clean commit per PR)

### Q: Can I use BREAKING CHANGE: in a fix commit?
**A:** Yes, but it will trigger a MAJOR version bump:
```bash
fix: remove deprecated API

BREAKING CHANGE: Users must migrate to new API
```
This would bump 1.0.0 → 2.0.0 (even though it's a "fix").

### Q: What if I have multiple types in one commit?
**A:** Don't. Split into multiple commits:
```bash
# Bad (one commit doing two things)
git commit -m "feat: add feature X and fix bug Y"

# Good (two commits)
git commit -m "feat: add feature X"
git commit -m "fix: resolve bug Y"
```

### Q: Do docs-only commits trigger releases?
**A:** No. Semantic-release ignores `docs:`, `chore:`, `style:`, etc.
Only `feat:` and `fix:` (and breaking changes) trigger releases.

---

## Summary of Current vs Recommended State

| Aspect                     | Current State                          | Recommended State                     |
|----------------------------|----------------------------------------|---------------------------------------|
| **Branch Protection**      | Only main + web repos                 | All 7 repos                           |
| **Commit Format**          | 60-95% Angular, no enforcement        | 100% Angular, enforced by CI          |
| **CLAUDE.md Guidance**     | "Use PRs" only, no commit format      | Full commit format documentation      |
| **Automated Versioning**   | Main repo only                        | All Python packages                   |
| **CONTRIBUTING.md**        | None                                  | All repos                             |
| **Commitlint CI**          | None                                  | All repos                             |
| **PR/Issue Templates**     | None                                  | All repos                             |
| **Pre-commit Hooks**       | None                                  | Optional, developer choice            |

---

## Conclusion

The OpenAdapt ecosystem has **strong foundations** (main repo is excellent) but **inconsistent practices across sub-packages**. The recommendations above will:

1. **Prevent regressions** (branch protection)
2. **Enforce conventions** (commitlint CI)
3. **Automate releases** (semantic-release)
4. **Educate contributors** (CLAUDE.md, CONTRIBUTING.md)
5. **Scale to more contributors** (clear policies)

**Key Insight:** The developer(s) already use Angular commits naturally (~60-95% adoption). Adding enforcement and automation is mostly about **consistency** and **scaling** as the project grows, not about changing behavior.

**Recommendation Priority:**
1. **Do now:** Branch protection + CLAUDE.md updates (1 day effort)
2. **Do soon:** Commitlint + semantic-release for all packages (1-2 weeks)
3. **Do later:** Templates, pre-commit hooks, polish (ongoing)

**Total Effort Estimate:** 2-3 weeks for full implementation.

---

## Appendix: Example Commits from Main Repo

**Excellent Angular commits:**
```
docs: simplify roadmap and fix Python version claims
fix: Resolve MkDocs broken links in production-execution-design.md
fix: Use filename-based GitHub Actions badge URL
chore: Update author email to richard@openadapt.ai
build(deps): bump actions/checkout from 4 to 6 (#961)
feat(agents): add RetrievalAugmentedAgent for automatic demo selection
test: add unit tests for providers and baselines modules
refactor(benchmarks): migrate to openadapt-evals package
```

**Non-Angular commits (should be rare):**
```
Add Section 11: Path to Main Track Publication (Parallel Track) (#975)
→ Should be: docs: add section 11 on path to main track publication

Consolidate all benchmark code from openadapt-ml
→ Should be: refactor: consolidate benchmark code from openadapt-ml

Initial implementation of openadapt-tray package
→ Should be: feat: initial openadapt-tray package implementation
```

**Co-authorship (excellent practice):**
```
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

**End of Analysis**

Generated by: Claude Sonnet 4.5
Date: January 17, 2026
Repositories Analyzed: 7
Total Commits Reviewed: ~200
