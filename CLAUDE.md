# Claude Code Guidelines for openadapt-web

## Repository Overview
This is the marketing website for OpenAdapt at https://openadapt.ai/

Built with Next.js and deployed via **Netlify** (`netlify.toml`; responses carry
a `server: Netlify` header).

This matters more than a hosting trivia detail: **lead capture runs on Netlify
Forms**, which has no Vercel equivalent. Anyone who believes this site is on
Vercel will reason incorrectly about the entire lead path — form registration,
spam filtering, and the `submission_created` email notification that delivers
inbound leads to a human. This file said "Vercel" until 2026-07-27.

## Important Rules

### Always Use Pull Requests
**NEVER push directly to the `main` branch.** Always create a feature branch and submit a PR, even for small changes.

```bash
# Create a new branch
git checkout -b feature/my-change

# Make changes and commit
git add .
git commit -m "Description of change"

# Push branch and create PR
git push -u origin feature/my-change
gh pr create --title "Title" --body "Description"
```

This allows:
- Changes to be reviewed before deployment
- Netlify deploy previews for testing
- Proper CI checks to run

### Development
```bash
npm install
npm run dev
```

### Key Files
- `utils/pypiStats.js` - PyPI download statistics fetching
- `app/` - Next.js app router pages
- `components/` - React components

## Related Repositories
- Main meta-package: https://github.com/OpenAdaptAI/OpenAdapt
- Sub-packages: openadapt-capture, openadapt-ml, openadapt-evals, etc.
