# openadapt-web

The official website for [OpenAdapt.AI](https://openadapt.ai), the governed
compiler for repeated GUI workflows.

## Overview

This is the Next.js-based landing page for OpenAdapt, featuring:

- **Canonical product truth** centred on deterministic compiled replay
- **Audience paths** for developers, automation teams, and regulated enterprises
- **Maturity matrix** separating the browser launch path from experimental and research backends
- **Industries grid** showing use cases across different sectors
- **Developer resources** and contribution information
- **Email signup** for product and launch updates
- **Single-page contact + booking flow** on landing (`#book`)
- **Booking page** for intro calls (`/book`)
- **Contact intake form** for sales workflows (`/contact`)

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Netlify](https://www.netlify.com/) - Hosting and forms

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Booking configuration

Set Calendly for inline booking in `.env.local`:

```bash
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-org/intro-call
```

Optional backward-compatible fallback:

```bash
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/your-org/intro-call
```

Clockwise links are supported as link-only fallback and are not iframed.

## Deployment

The site is automatically deployed to Netlify on push to the main branch.

- **Production**: [openadapt.ai](https://openadapt.ai)

## Product Repositories

| Repository | Description |
|------------|-------------|
| [openadapt-flow](https://github.com/OpenAdaptAI/openadapt-flow) | Canonical engine: compiler, governed runtime, validation, and limits |
| [OpenAdapt](https://github.com/OpenAdaptAI/OpenAdapt) | Installer and unified CLI that routes `openadapt flow` to the engine |
| [openadapt-desktop](https://github.com/OpenAdaptAI/openadapt-desktop) | Desktop authoring and operator surface, in development |
| [openadapt-evals](https://github.com/OpenAdaptAI/openadapt-evals) | Evaluation and benchmark research |
| [openadapt-privacy](https://github.com/OpenAdaptAI/openadapt-privacy) | Optional PII/PHI scrubbing library |

The public product story must not treat repository count as product breadth.
Research and internal tools belong in reference material, not top-level
positioning.

## License

MIT - see [LICENSE](LICENSE) for details.
