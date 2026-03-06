# OpenAdapt.web

The official website for [OpenAdapt.AI](https://openadapt.ai) - AI-first desktop automation.

## Overview

This is the Next.js-based landing page for OpenAdapt, featuring:

- **Hero section** with demo video showcasing workflow automation
- **Industries grid** showing use cases across different sectors
- **Developer resources** and contribution information
- **Email signup** for updates and early access
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

Set a public booking URL in `.env.local`:

```bash
NEXT_PUBLIC_BOOKING_URL=https://calendly.com/your-org/intro-call
```

You can also point this at a Clockwise scheduling link.

## Deployment

The site is automatically deployed to Netlify on push to the main branch.

- **Production**: [openadapt.ai](https://openadapt.ai)

## Related Repositories

| Repository | Description |
|------------|-------------|
| [OpenAdapt](https://github.com/OpenAdaptAI/OpenAdapt) | Main application and meta-package |
| [openadapt-capture](https://github.com/OpenAdaptAI/openadapt-capture) | GUI interaction capture library |
| [openadapt-ml](https://github.com/OpenAdaptAI/openadapt-ml) | Machine learning models and training |
| [openadapt-evals](https://github.com/OpenAdaptAI/openadapt-evals) | Benchmark evaluation framework |
| [openadapt-consilium](https://github.com/OpenAdaptAI/openadapt-consilium) | Multi-model consensus library |
| [openadapt-herald](https://github.com/OpenAdaptAI/openadapt-herald) | Git history to social media automation |
| [openadapt-crier](https://github.com/OpenAdaptAI/openadapt-crier) | Event-driven Telegram approval bot |
| [openadapt-wright](https://github.com/OpenAdaptAI/openadapt-wright) | Dev automation worker (Ralph Loop) |
| [openadapt-grounding](https://github.com/OpenAdaptAI/openadapt-grounding) | UI grounding models |
| [openadapt-viewer](https://github.com/OpenAdaptAI/openadapt-viewer) | Recording visualization |
| [openadapt-privacy](https://github.com/OpenAdaptAI/openadapt-privacy) | PII scrubbing |
| [openadapt-retrieval](https://github.com/OpenAdaptAI/openadapt-retrieval) | Demo retrieval |
| [openadapt-tray](https://github.com/OpenAdaptAI/openadapt-tray) | System tray app |
| [openadapt-telemetry](https://github.com/OpenAdaptAI/openadapt-telemetry) | Usage telemetry |

The website automatically discovers new `openadapt-*` repos from the [OpenAdaptAI](https://github.com/OpenAdaptAI) GitHub org.

## License

MIT - see [LICENSE](LICENSE) for details.
