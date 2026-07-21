# openadapt-web

**Lifecycle: Beta**

Source for the [openadapt.ai](https://openadapt.ai) marketing site.

OpenAdapt is a governed demonstration compiler for GUI workflows: record a task
once, compile it, and replay it deterministically with zero model calls on the
healthy path. When replay cannot verify what it is about to do, it halts instead
of guessing. Every execution substrate is first-class under one governed loop:
browser, Windows, macOS, Linux, RDP, and Citrix/VDI. OpenAdapt is local-first
and open-core (MIT); managed cloud is optional.

This repository is the public website only. The product itself lives in
[OpenAdaptAI/openadapt](https://github.com/OpenAdaptAI/openadapt), and product
documentation lives at [docs.openadapt.ai](https://docs.openadapt.ai).

## Substrate maturity

`public/status.json` is the canonical, machine-readable source of truth for
substrate labels and component versions. The homepage imports it directly so
rendered labels cannot drift, and `tests/statusManifest.test.js` guards it. Do
not restate substrate maturity here; read the manifest instead.

## Tech stack

- [Next.js](https://nextjs.org/) (React framework)
- [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Netlify](https://www.netlify.com/) for hosting and forms

## Development

Node 22 is pinned in `.nvmrc`.

```bash
npm install      # install dependencies
npm run dev      # start the dev server on http://localhost:3000
npm test         # run the node:test unit suite (tests/*.test.js)
npm run build    # fetch the paper PDF, run tests, then next build
```

`npm run build` runs a `prebuild` step (`fetch:paper` plus `npm test`) before
`next build`, so the unit tests gate every production build. Cypress end-to-end
tests live under `cypress/` and run in CI and during the Netlify build. Avoid
invoking the full Cypress suite locally without reason.

### Booking configuration

Booking is code-owned and always routes to the canonical Cal.com event:

`https://cal.com/richard-abrich/30min?overlayCalendar=true`

Deploy-time booking-provider overrides are intentionally ignored so stale
environment variables cannot redirect the homepage form or the `/book` embed.

## Deployment

Netlify deploys production from the `main` branch. The build command and
Next.js plugin are configured in `netlify.toml`.

- **Production**: [openadapt.ai](https://openadapt.ai)

## Related repositories

| Repository | Description |
|------------|-------------|
| [openadapt](https://github.com/OpenAdaptAI/openadapt) | Installer and unified CLI, the entry point to the product |
| [openadapt-flow](https://github.com/OpenAdaptAI/openadapt-flow) | Canonical engine: compiler, governed runtime, validation, and limits |
| [openadapt-desktop](https://github.com/OpenAdaptAI/openadapt-desktop) | Desktop authoring and operator surface, in development |
| [openadapt-evals](https://github.com/OpenAdaptAI/openadapt-evals) | Evaluation and benchmark research |
| [openadapt-privacy](https://github.com/OpenAdaptAI/openadapt-privacy) | Optional PII/PHI scrubbing library |

Repository count is not a measure of product breadth. Research and internal
tools belong in reference material, not top-level positioning.

## License

MIT. See [LICENSE](LICENSE) for details.
