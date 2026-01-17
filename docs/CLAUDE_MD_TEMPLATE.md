# Claude Code Guidelines for [REPO_NAME]

## Repository Overview
[Brief description of what this repository does and its role in the OpenAdapt ecosystem]

## Important Rules

### Always Use Pull Requests
**NEVER push directly to the `main` branch.** Always create a feature branch and submit a PR, even for small changes.

```bash
# Create a new branch
git checkout -b feature/my-change

# Make changes and commit
git add .
git commit -m "feat: description of change"

# Push branch and create PR
git push -u origin feature/my-change
gh pr create --title "feat: PR title" --body "Description"
```

Branch protection is configured to enforce this, but admins can bypass it - please don't.

### Commit Message Format

**All commits MUST follow Angular commit conventions for automated versioning.**

#### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Required Types
- `feat`: New feature → MINOR version bump (0.1.0 → 0.2.0)
- `fix`: Bug fix → PATCH version bump (0.1.0 → 0.1.1)
- `docs`: Documentation changes (no version bump)
- `style`: Code style/formatting, no logic change (no version bump)
- `refactor`: Code refactoring, no behavior change (no version bump)
- `perf`: Performance improvements (no version bump)
- `test`: Adding or updating tests (no version bump)
- `chore`: Maintenance tasks like deps, config (no version bump)
- `ci`: CI/CD pipeline changes (no version bump)
- `build`: Build system changes (no version bump)

#### Optional Scope
Add context in parentheses to clarify which module/area is affected:
```bash
feat(auth): add OAuth2 support
fix(api): handle null responses
docs(readme): update installation instructions
```

For small repos, scope is often omitted:
```bash
feat: add feature
fix: resolve bug
```

#### Breaking Changes
Breaking changes trigger a MAJOR version bump (0.1.0 → 1.0.0).

**Method 1:** Add `!` after type:
```bash
feat!: remove deprecated Record API
fix!: change return type of process_data()
```

**Method 2:** Add `BREAKING CHANGE:` in footer:
```bash
feat: redesign capture API

BREAKING CHANGE: Record class renamed to Recorder, old API removed
```

#### Subject Line Rules
- Use imperative mood: "add feature" not "added feature" or "adds feature"
- Lowercase first letter (after colon)
- No period at the end
- Max 50 characters (enforced by CI)

#### Body (Optional)
- Explain **what** and **why**, not **how**
- Wrap at 72 characters per line
- Separate from subject with blank line

#### Footer (Optional)
- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authorship: `Co-Authored-By: Name <email>`

#### Examples

**Simple commits:**
```bash
git commit -m "feat: add voice transcription support"
git commit -m "fix: escape JSON in HTML attributes"
git commit -m "docs: update installation instructions"
git commit -m "chore: bump pytest to 8.0.0"
```

**With scope:**
```bash
git commit -m "feat(capture): add audio transcription"
git commit -m "fix(api): handle null responses gracefully"
git commit -m "test(viewer): add integration tests"
```

**With body and footer:**
```bash
git commit -m "feat: add demo library for retrieval

The new demo library enables automatic demo selection based on
task similarity using CLIP embeddings. This improves accuracy
by 20% on the WAA benchmark.

Closes #123

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Breaking change:**
```bash
git commit -m "feat!: redesign Recorder API

BREAKING CHANGE: Record class renamed to Recorder. Update imports:
- Old: from openadapt_capture import Record
- New: from openadapt_capture import Recorder

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

#### Why Angular Commits?

1. **Automated Versioning:** `python-semantic-release` reads commits and auto-bumps versions
2. **Auto-Generated CHANGELOGs:** Features and fixes grouped automatically
3. **Scannable History:** Easy to filter: `git log --grep="^feat"`
4. **Clear Intent:** Know at a glance what each commit does
5. **CI/CD Integration:** Triggers releases only for `feat`/`fix` commits
6. **Community Standard:** Used by Angular, Electron, VSCode, and many major projects

#### Enforcement

- **CI Check:** Commitlint validates all commits in PRs and rejects bad formats
- **PR Titles:** Must also follow Angular format (used for squash merges)
- **Local Hooks:** Optional pre-commit hooks available (see CONTRIBUTING.md)

#### Common Mistakes

**Don't:**
```bash
# ❌ Missing type
git commit -m "add new feature"

# ❌ Capitalized subject
git commit -m "feat: Add new feature"

# ❌ Period at end
git commit -m "feat: add new feature."

# ❌ Wrong mood
git commit -m "feat: added new feature"

# ❌ Multiple types in one commit
git commit -m "feat: add X and fix Y"
```

**Do:**
```bash
# ✅ Correct format
git commit -m "feat: add new feature"

# ✅ With scope
git commit -m "feat(api): add new endpoint"

# ✅ Breaking change
git commit -m "feat!: remove deprecated API"

# ✅ Split commits by type
git commit -m "feat: add new feature"
git commit -m "fix: resolve related bug"
```

#### Co-Authorship

When working with Claude Code, always add co-authorship to your commits:

```bash
git commit -m "feat: add feature

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

Or use heredoc for multi-line messages:
```bash
git commit -m "$(cat <<'EOF'
feat: add feature

This implements the new feature as discussed in #123.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### Pull Request Process

1. **Create feature branch:** `git checkout -b feature/my-feature`
2. **Make commits** following Angular conventions
3. **Push branch:** `git push -u origin feature/my-feature`
4. **Open PR** with title following Angular format:
   ```
   feat: add voice transcription support
   ```
5. **Request review** from maintainers
6. **Address feedback** and push updates
7. **Squash merge** to keep main branch history clean:
   ```bash
   gh pr merge --squash --delete-branch
   ```

**PR Title Format:** Must follow Angular conventions since it becomes the commit message on squash merge.

**Good PR titles:**
- `feat: add demo library for retrieval`
- `fix: resolve memory leak in recorder`
- `docs: update API documentation`

**Bad PR titles:**
- `Feature/add demo library` (not Angular format)
- `Fix bug` (not descriptive)
- `Updates` (meaningless)

### Development Setup
[Add repository-specific setup instructions]

```bash
# Example for Python packages
uv sync
uv run pytest tests/ -v

# Example for openadapt-web
npm install
npm run dev
```

### Key Directories/Files
[List important directories and files specific to this repo]

- `src/` - Main source code
- `tests/` - Test files
- `docs/` - Documentation
- `.github/` - CI/CD workflows, issue templates

### Release Process

Releases are **fully automated** via GitHub Actions using `python-semantic-release`.

**Workflow:**
1. Merge PR to main
2. GitHub Action runs:
   - Analyzes commits since last release
   - Determines version bump based on commit types
   - Updates version in `pyproject.toml`
   - Creates git tag (e.g., `v0.2.0`)
   - Generates CHANGELOG
   - Builds package
   - Publishes to PyPI
3. Bot commits version bump as "OpenAdapt Bot"

**Manual Intervention:** Never needed. If automation fails, check workflow logs.

**Version Bump Logic:**
- `feat:` → MINOR bump (0.1.0 → 0.2.0)
- `fix:` → PATCH bump (0.1.0 → 0.1.1)
- `BREAKING CHANGE:` → MAJOR bump (0.1.0 → 1.0.0)
- `docs:`, `chore:`, etc. → No release

### Related Repositories

- **Main meta-package:** https://github.com/OpenAdaptAI/OpenAdapt
- **Website:** https://github.com/OpenAdaptAI/openadapt-web
- **Sub-packages:**
  - openadapt-capture: GUI recording
  - openadapt-ml: ML training/inference
  - openadapt-evals: Benchmark evaluation
  - openadapt-viewer: HTML visualization
  - openadapt-grounding: UI element localization
  - openadapt-retrieval: Multimodal retrieval
  - openadapt-privacy: PII/PHI scrubbing
  - openadapt-tray: System tray app

### Additional Resources

- **CONTRIBUTING.md:** Detailed contribution guidelines
- **Documentation:** https://docs.openadapt.ai
- **Discord:** [Link to Discord]
- **PyPI:** https://pypi.org/project/[package-name]

---

**Note:** This file is maintained for Claude Code context. Human contributors should reference CONTRIBUTING.md.
