# OpenAdapt Commit Practices: Implementation Checklist

**Start Date:** _____________
**Target Completion:** _____________
**Owner:** _____________

---

## Phase 1: Documentation (2 hours)

### Update CLAUDE.md Files

- [ ] **openadapt-web** ✅ DONE (Jan 17, 2026)
  - Path: `/Users/abrichr/oa/src/openadapt-web/CLAUDE.md`
  - Added commit message format section

- [ ] **OpenAdapt (main)**
  - URL: https://github.com/OpenAdaptAI/OpenAdapt/blob/main/CLAUDE.md
  - Action: Add "Commit Message Format" section after "Always Use Pull Requests"
  - Template: Use `CLAUDE_MD_TEMPLATE.md` as reference
  - Test: Verify markdown renders correctly on GitHub

- [ ] **openadapt-ml**
  - URL: https://github.com/OpenAdaptAI/openadapt-ml/blob/main/CLAUDE.md
  - Action: Add "Commit Message Format" section
  - Note: CLAUDE.md is very long (2300+ lines), add section after "Important Rules"

- [ ] **openadapt-viewer**
  - URL: https://github.com/OpenAdaptAI/openadapt-viewer/blob/main/CLAUDE.md
  - Action: Add "Commit Message Format" section
  - Note: CLAUDE.md exists and has PR guidance

- [ ] **openadapt-capture**
  - URL: https://github.com/OpenAdaptAI/openadapt-capture/blob/main/CLAUDE.md
  - Action: Add "Commit Message Format" section
  - Note: CLAUDE.md exists and has PR guidance

- [ ] **openadapt-evals**
  - URL: https://github.com/OpenAdaptAI/openadapt-evals
  - Action: CREATE CLAUDE.md file (doesn't exist)
  - Template: Use `CLAUDE_MD_TEMPLATE.md` as base
  - Customize: Add evals-specific setup instructions

- [ ] **openadapt-tray**
  - URL: https://github.com/OpenAdaptAI/openadapt-tray
  - Action: CREATE CLAUDE.md file (doesn't exist)
  - Template: Use `CLAUDE_MD_TEMPLATE.md` as base
  - Customize: Add tray-specific setup instructions

**Completion Criteria:**
- All 7 repos have CLAUDE.md with commit format section
- Examples are repo-specific (not generic)
- Markdown formatting is correct

---

## Phase 2: Branch Protection (1 hour)

### Enable Protection on Unprotected Repos

Use GitHub API or UI to apply these settings:

**Repositories to protect:**
- [ ] openadapt-ml
- [ ] openadapt-viewer
- [ ] openadapt-capture
- [ ] openadapt-evals
- [ ] openadapt-tray

**Settings (apply to all):**
```yaml
Branch: main

Pull Request Requirements:
  ✅ Require pull request reviews before merging
  - Required approving reviews: 1
  - Dismiss stale reviews: false
  - Require review from Code Owners: true

Status Checks:
  ✅ Require status checks to pass before merging
  - Require branches to be up to date: true
  - Status checks: (add CI workflow names if they exist)

History Requirements:
  ✅ Require linear history: true
  ✅ Require signed commits: false (optional)

Restrictions:
  ❌ Allow force pushes: false
  ❌ Allow deletions: false
  ⚠️ Do not enforce for administrators: false (recommended)
```

**Implementation Method:**

**Option A: GitHub UI**
1. Go to repo Settings → Branches
2. Add rule for `main` branch
3. Configure settings above
4. Save changes

**Option B: GitHub CLI**
```bash
# Template command (customize per repo)
gh api repos/OpenAdaptAI/REPO_NAME/branches/main/protection -X PUT \
  --input protection-config.json
```

**Option C: GitHub API**
```bash
curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OpenAdaptAI/REPO_NAME/branches/main/protection \
  -d @protection-config.json
```

**protection-config.json:**
```json
{
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "require_code_owner_reviews": true,
    "dismiss_stale_reviews": false
  },
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "enforce_admins": false
}
```

**Completion Criteria:**
- All 7 repos have branch protection
- Direct pushes to main are blocked
- Admin bypass disabled (if possible)
- Test: Try to push directly to main (should fail)

---

## Phase 3: Commit Enforcement (4 hours)

### Add Commitlint GitHub Actions

**For each Python repository:**

- [ ] **OpenAdapt (main)**
- [ ] **openadapt-ml**
- [ ] **openadapt-viewer**
- [ ] **openadapt-capture**
- [ ] **openadapt-evals**
- [ ] **openadapt-tray**

**Steps per repository:**

1. **Add commitizen to dev dependencies:**
   ```toml
   # pyproject.toml
   [project.optional-dependencies]
   dev = [
       "pytest>=8.0.0",
       "ruff>=0.1.0",
       "commitizen>=3.13.0",  # ADD THIS
   ]
   ```

2. **Add commitizen config to pyproject.toml:**
   ```toml
   [tool.commitizen]
   name = "cz_conventional_commits"
   version_files = ["pyproject.toml:version"]
   ```

3. **Create workflow file:**
   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/commitlint.yml
   ```

4. **Add workflow content:**
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

         - name: Check all commits in PR
           run: |
             BASE_SHA=${{ github.event.pull_request.base.sha }}
             HEAD_SHA=${{ github.event.pull_request.head.sha }}
             echo "Checking commits from $BASE_SHA to $HEAD_SHA"
             git log --format=%s $BASE_SHA..$HEAD_SHA | while read msg; do
               echo "Validating: $msg"
               echo "$msg" | cz check --commit-msg-file - || exit 1
             done

         - name: Check PR title format
           run: |
             echo "Validating PR title: ${{ github.event.pull_request.title }}"
             echo "${{ github.event.pull_request.title }}" | cz check --commit-msg-file - || {
               echo "❌ PR title must follow Angular commit format"
               echo "Examples: 'feat: add feature', 'fix: resolve bug'"
               exit 1
             }
   ```

5. **Test the workflow:**
   - Create test branch with bad commit: `git commit -m "bad commit message"`
   - Open PR
   - Verify workflow fails with clear error
   - Fix commit: `git commit --amend -m "feat: add test"`
   - Verify workflow passes

**For openadapt-web (Node.js):**

- [ ] **openadapt-web**

**Steps:**

1. **Install commitlint:**
   ```bash
   npm install --save-dev @commitlint/cli @commitlint/config-conventional
   ```

2. **Create config:**
   ```bash
   echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
   ```

3. **Add workflow:**
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
         - uses: wagoid/commitlint-github-action@v5
   ```

**Completion Criteria:**
- Workflow file exists in all repos
- Test PR with bad commit fails validation
- Test PR with good commit passes
- Error messages are clear and helpful

---

## Phase 4: Automated Versioning (8 hours)

### Set Up python-semantic-release

**Target repositories:**
- [ ] **openadapt-ml**
- [ ] **openadapt-viewer**
- [ ] **openadapt-capture**
- [ ] **openadapt-evals**
- [ ] **openadapt-tray**

**Note:** OpenAdapt (main) already has this configured.

**Steps per repository:**

1. **Verify GitHub secrets exist:**
   ```bash
   gh secret list --repo OpenAdaptAI/REPO_NAME
   ```

   Required secrets:
   - `ADMIN_TOKEN`: GitHub PAT with repo write access
   - `PYPI_TOKEN`: PyPI API token for publishing

   If missing:
   ```bash
   gh secret set ADMIN_TOKEN --repo OpenAdaptAI/REPO_NAME
   gh secret set PYPI_TOKEN --repo OpenAdaptAI/REPO_NAME
   ```

2. **Create workflow file:**
   ```bash
   touch .github/workflows/release-and-publish.yml
   ```

3. **Add workflow content:**
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

4. **Add semantic-release config to pyproject.toml:**
   ```toml
   [tool.semantic_release]
   version_variable = "pyproject.toml:version"
   branch = "main"
   upload_to_pypi = false  # Handled by separate step
   build_command = "pip install poetry && poetry build"
   commit_parser = "angular"
   ```

5. **Test the workflow:**
   - Create test branch: `git checkout -b test/semantic-release`
   - Make a feat commit: `git commit -m "feat: test automated versioning"`
   - Open and merge PR
   - Watch workflow run
   - Verify:
     - Version bumped in pyproject.toml
     - Git tag created
     - CHANGELOG.md updated
     - Package published to PyPI

**Completion Criteria:**
- Workflow runs on merge to main
- Version automatically bumped based on commits
- CHANGELOG auto-generated
- Package published to PyPI
- Bot commits don't trigger infinite loops

---

## Phase 5: Contributor Guidelines (2 hours)

### Create CONTRIBUTING.md

- [ ] **OpenAdapt (main)**
- [ ] **openadapt-web**
- [ ] **openadapt-ml**
- [ ] **openadapt-viewer**
- [ ] **openadapt-capture**
- [ ] **openadapt-evals**
- [ ] **openadapt-tray**

**Template:**

```markdown
# Contributing to [REPO_NAME]

Thank you for your interest in contributing to OpenAdapt!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies
4. Create a feature branch

## Commit Message Format

We use Angular commit conventions for automated versioning.

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: New feature (→ MINOR version bump)
- `fix`: Bug fix (→ PATCH version bump)
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance
- `test`: Testing
- `chore`: Maintenance
- `ci`: CI/CD
- `build`: Build system

**Examples:**
```bash
git commit -m "feat: add voice transcription"
git commit -m "fix(api): handle null responses"
git commit -m "docs: update README"
```

## Pull Request Process

1. Create feature branch (never commit to main)
2. Write clear commits following Angular conventions
3. Update tests if adding features
4. Update docs if changing APIs
5. Open PR with descriptive title (also Angular format)
6. Request review
7. Address feedback
8. Squash merge to keep history clean

## Code Style

- Python: Follow PEP 8, use `ruff`
- JavaScript: Use Prettier and ESLint
- Run tests: `uv run pytest` or `npm test`

## Questions?

- Open an issue with `question` label
- Email: support@openadapt.ai

## License

By contributing, you agree your contributions will be licensed under MIT License.
```

**Completion Criteria:**
- All repos have CONTRIBUTING.md
- Linked automatically in GitHub PR/issue flows
- Customized per repository (not generic)

---

## Phase 6: PR/Issue Templates (2 hours)

### Add GitHub Templates

**For each repository:**

- [ ] **OpenAdapt (main)**
- [ ] **openadapt-web**
- [ ] **openadapt-ml**
- [ ] **openadapt-viewer**
- [ ] **openadapt-capture**
- [ ] **openadapt-evals**
- [ ] **openadapt-tray**

**1. Pull Request Template:**

```bash
mkdir -p .github
touch .github/PULL_REQUEST_TEMPLATE.md
```

```markdown
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] 🐛 Bug fix (fix:)
- [ ] ✨ New feature (feat:)
- [ ] 📚 Documentation (docs:)
- [ ] 🎨 Code style/refactor
- [ ] ⚡ Performance (perf:)
- [ ] ✅ Test (test:)
- [ ] 🔧 Maintenance (chore:)
- [ ] 💥 Breaking change (add `!`)

## Commit Format
PR title: `<type>(<scope>): <subject>`

Example: `feat(capture): add audio transcription`

## Related Issues
Closes #

## Testing
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] CI checks pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added
- [ ] Commits follow Angular conventions
- [ ] PR title follows Angular conventions
```

**2. Issue Templates:**

```bash
mkdir -p .github/ISSUE_TEMPLATE
touch .github/ISSUE_TEMPLATE/bug_report.md
touch .github/ISSUE_TEMPLATE/feature_request.md
```

**bug_report.md:**
```markdown
---
name: Bug report
about: Create a report to help us improve
title: 'bug: '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., macOS 14]
- Python version: [e.g., 3.10]
- Package version: [e.g., 0.2.0]

**Additional context**
Any other context about the problem.
```

**feature_request.md:**
```markdown
---
name: Feature request
about: Suggest an idea
title: 'feat: '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

**Completion Criteria:**
- Templates exist in all repos
- GitHub auto-populates them in new PRs/issues
- Markdown formatting is correct

---

## Phase 7: Testing & Validation (2 hours)

### Comprehensive Testing

**For each repository, verify:**

- [ ] **OpenAdapt (main)**
- [ ] **openadapt-web**
- [ ] **openadapt-ml**
- [ ] **openadapt-viewer**
- [ ] **openadapt-capture**
- [ ] **openadapt-evals**
- [ ] **openadapt-tray**

**Test Checklist per Repo:**

1. **Branch Protection:**
   ```bash
   # This should FAIL
   git checkout main
   echo "test" >> README.md
   git commit -m "test: direct push"
   git push
   # Expected: "remote: error: GH006: Protected branch update failed"
   ```

2. **Commitlint (Bad Commit):**
   ```bash
   git checkout -b test/bad-commit
   git commit --allow-empty -m "bad commit message"
   git push -u origin test/bad-commit
   gh pr create --title "bad commit" --body "Test"
   # Expected: CI fails with commitlint error
   ```

3. **Commitlint (Good Commit):**
   ```bash
   git checkout -b test/good-commit
   git commit --allow-empty -m "feat: test commit"
   git push -u origin test/good-commit
   gh pr create --title "feat: test commit" --body "Test"
   # Expected: CI passes
   ```

4. **Semantic Release (if applicable):**
   ```bash
   # Merge a feat commit to main
   # Expected:
   # - Version bumped (minor)
   # - CHANGELOG updated
   # - Git tag created
   # - Package published to PyPI
   ```

5. **Documentation:**
   - [ ] CLAUDE.md has commit format section
   - [ ] CONTRIBUTING.md exists and is clear
   - [ ] Templates appear in new PR/issue

**Completion Criteria:**
- All tests pass
- No false positives/negatives
- Error messages are helpful
- Automation works end-to-end

---

## Phase 8: Announcement & Education (1 hour)

### Communicate Changes

- [ ] **Update main OpenAdapt README:**
  - Add section on commit conventions
  - Link to CONTRIBUTING.md

- [ ] **Post announcement:**
  - GitHub Discussions (if enabled)
  - Discord (if exists)
  - Team chat

**Announcement Template:**

```markdown
# 📢 New: Standardized Commit Conventions

We've standardized commit practices across all OpenAdapt repositories!

## What Changed?

1. **All commits must follow Angular format:** `feat: description`
2. **Branch protection enabled:** No direct pushes to main
3. **Automated versioning:** Releases happen automatically
4. **Clear guidelines:** See CLAUDE.md and CONTRIBUTING.md

## Why?

- Automated version management
- Better commit history
- Easier collaboration
- Professional standards

## Examples

✅ Good:
- `feat: add voice transcription`
- `fix: resolve memory leak`
- `docs: update README`

❌ Bad:
- `add feature`
- `fixes stuff`
- `update`

## Resources

- CONTRIBUTING.md in each repo
- CLAUDE.md for commit format
- CI will validate your commits

Questions? Ask in #dev or open an issue!
```

**Completion Criteria:**
- Team is aware of new practices
- Documentation is easy to find
- Questions are answered

---

## Ongoing Maintenance

### Weekly Tasks

- [ ] Review commitlint failures
  - Educate contributors who violate format
  - Improve error messages if unclear

- [ ] Monitor semantic-release
  - Check for failed releases
  - Verify versions are correct
  - Ensure CHANGELOGs are accurate

- [ ] Update documentation
  - Add examples as needed
  - Clarify confusing points
  - Keep CLAUDE.md current

### Monthly Tasks

- [ ] Review commit quality
  - Are scopes being used consistently?
  - Are subjects descriptive?
  - Are breaking changes marked correctly?

- [ ] Audit branch protection
  - Are rules still appropriate?
  - Are there bypass attempts?

- [ ] Refine automation
  - Optimize workflow performance
  - Update dependencies (actions, tools)

---

## Troubleshooting

### Common Issues

**1. Commitlint fails on valid commit:**
- Check for trailing spaces
- Verify type is lowercase
- Ensure subject doesn't end with period
- Max subject length: 50 chars

**2. Semantic release doesn't bump version:**
- Only `feat` and `fix` trigger releases
- Check commit history since last tag
- Verify bot commits don't create loops

**3. Branch protection too strict:**
- Adjust required reviews if needed
- Temporarily disable for emergencies (document why)

**4. Contributors confused:**
- Add more examples to CONTRIBUTING.md
- Create FAQ section
- Use commitizen CLI: `cz commit` (interactive)

---

## Success Metrics

Track these over time:

**Week 1:**
- [ ] 100% of new commits follow Angular format
- [ ] 0 direct pushes to main
- [ ] Branch protection active on all repos

**Week 2:**
- [ ] Automated releases working (Python packages)
- [ ] CHANGELOGs auto-generated
- [ ] No manual version management

**Month 1:**
- [ ] External contributors follow guidelines
- [ ] Commit quality high
- [ ] Automation reliable

**Long-term:**
- [ ] Reduced onboarding time (clear docs)
- [ ] Faster releases (automation)
- [ ] Better collaboration (standards)

---

## Rollback Plan

If things go wrong:

1. **Disable branch protection temporarily:**
   ```bash
   gh api -X DELETE repos/OpenAdaptAI/REPO_NAME/branches/main/protection
   ```

2. **Disable commitlint workflow:**
   - Rename `.github/workflows/commitlint.yml` to `.commitlint.yml.disabled`

3. **Pause semantic-release:**
   - Rename workflow file to disable
   - Or add `if: false` to job

4. **Communicate:**
   - Post in team chat
   - Explain what happened
   - Timeline for fix

5. **Fix and re-enable:**
   - Debug the issue
   - Test thoroughly
   - Re-enable gradually (one repo at a time)

---

## Sign-Off

**Phase 1 (Documentation):**
- Completed: ___________
- Verified by: ___________

**Phase 2 (Branch Protection):**
- Completed: ___________
- Verified by: ___________

**Phase 3 (Commitlint):**
- Completed: ___________
- Verified by: ___________

**Phase 4 (Semantic Release):**
- Completed: ___________
- Verified by: ___________

**Phase 5 (CONTRIBUTING.md):**
- Completed: ___________
- Verified by: ___________

**Phase 6 (Templates):**
- Completed: ___________
- Verified by: ___________

**Phase 7 (Testing):**
- Completed: ___________
- Verified by: ___________

**Phase 8 (Announcement):**
- Completed: ___________
- Verified by: ___________

---

**Total Time Estimate:** ~20 hours (2-3 days)
**High Impact:** Automation, consistency, scalability
**Low Risk:** Gradual rollout, clear rollback plan

**Questions?** See `COMMIT_PRACTICES_ANALYSIS.md` for full analysis.
