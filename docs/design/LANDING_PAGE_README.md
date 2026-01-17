# Next-Generation Landing Page Documentation

**Auto-Generated Recording Showcase for OpenAdapt.AI**

---

## 📖 Documentation Overview

This folder contains comprehensive design and implementation documentation for the next-generation OpenAdapt landing page featuring auto-generated recording showcases.

### Quick Links

| Document | Description | For... |
|----------|-------------|--------|
| **[START HERE: Summary](LANDING_PAGE_SUMMARY.md)** | Executive overview, key decisions | Everyone |
| **[Implementation Guide](LANDING_PAGE_QUICK_START.md)** | Step-by-step code walkthrough | Developers |
| **[Complete Design](LANDING_PAGE_DESIGN.md)** | Strategic design, all phases | Tech leads, architects |
| **[Visual Mockups](LANDING_PAGE_MOCKUPS.md)** | UI/UX wireframes and specs | Designers, frontend |

---

## 🎯 What This Is

A system to **automatically generate landing page showcases** from real OpenAdapt recordings, replacing the static demo video with a dynamic, rotating carousel that updates weekly.

**Vision:**
```
Static Video (Manual)  →  Auto-Generated Carousel (Weekly Updates)
─────────────────────      ────────────────────────────────────────
 demo.mp4 (85MB)            • turn-off-nightshift (500KB)
 Updated: ???               • notepad-automation (500KB)
 One workflow               • browser-navigation (500KB)
                            • 10+ more recordings
                            Updated: Automatically every Sunday
```

---

## 🚀 Quick Start

**For Implementers (Developers):**

1. **Read:** [LANDING_PAGE_QUICK_START.md](LANDING_PAGE_QUICK_START.md)
2. **Run:**
   ```bash
   cd /Users/abrichr/oa/src/openadapt-web
   npm run generate-recordings  # Step 1: Generate assets
   # Then follow steps 2-5 in quick start guide
   ```
3. **Deploy:** Create PR, test, merge to main

**For Decision Makers:**

1. **Read:** [LANDING_PAGE_SUMMARY.md](LANDING_PAGE_SUMMARY.md)
2. **Decide:** Approve MVP implementation (20 hours, $0 cost)
3. **Assign:** Assign developer to Week 1 tasks

**For Designers:**

1. **Read:** [LANDING_PAGE_MOCKUPS.md](LANDING_PAGE_MOCKUPS.md)
2. **Review:** Visual mockups, color scheme, typography
3. **Feedback:** Provide design feedback before implementation

---

## 📚 Document Details

### 1. Executive Summary
**File:** [LANDING_PAGE_SUMMARY.md](LANDING_PAGE_SUMMARY.md)
**Size:** 10 KB
**Read Time:** 15 minutes

**What's Inside:**
- Vision and key innovation
- Implementation phases (MVP → Scale)
- Expected impact and metrics
- Investment summary (time/cost)
- Decision points and next actions
- Q&A section

**Best For:**
- Project managers
- Stakeholders
- Anyone deciding whether to proceed

---

### 2. Quick Start Implementation Guide
**File:** [LANDING_PAGE_QUICK_START.md](LANDING_PAGE_QUICK_START.md)
**Size:** 15 KB
**Read Time:** 20 minutes

**What's Inside:**
- Copy-paste code examples
- 5-step implementation process
- Troubleshooting guide
- Time estimates per task
- Weekly update process

**Best For:**
- Frontend developers
- Full-stack developers
- Anyone implementing the MVP

**Includes:**
- ✅ Complete `generate-recordings.js` script
- ✅ Full `RecordingShowcase.js` component
- ✅ Complete CSS styling
- ✅ Landing page integration code

---

### 3. Complete Strategic Design
**File:** [LANDING_PAGE_DESIGN.md](LANDING_PAGE_DESIGN.md)
**Size:** 38 KB
**Read Time:** 60 minutes

**What's Inside:**
- Current state analysis
- Long-term vision (1000+ users)
- MVP design (2-5 users)
- Auto-generation pipeline
- Storage strategy comparison
- User flow diagrams
- Technical architecture
- Migration path (MVP → Scale)
- Success metrics
- Cost/effort analysis
- 10-week implementation roadmap

**Best For:**
- Technical leads
- System architects
- Product managers
- Anyone planning long-term strategy

**Sections:**
1. Current State Analysis
2. Long-Term Vision (Many Users)
3. MVP Design (Few Users, Now)
4. Landing Page Experience Design
5. Auto-Generation Pipeline
6. Storage Strategy
7. User Flow Design
8. Technical Implementation
9. Migration Path
10. Success Metrics
11. Cost/Effort Analysis
12. Implementation Roadmap

---

### 4. Visual Mockups & Specifications
**File:** [LANDING_PAGE_MOCKUPS.md](LANDING_PAGE_MOCKUPS.md)
**Size:** 20 KB
**Read Time:** 30 minutes

**What's Inside:**
- ASCII art wireframes
- Before/after comparisons
- Component wireframes
- Color scheme (hex codes)
- Typography specs
- Responsive breakpoints
- Animation timings
- Accessibility guidelines
- Performance targets

**Best For:**
- UI/UX designers
- Frontend developers
- Anyone implementing the visual design

**Includes:**
- Current landing page layout
- Proposed MVP layout
- Full-width hero alternate
- Interactive viewer concept
- Gallery page layout
- Individual recording page
- Mobile view (375px)
- Component structure diagrams

---

## 🏗 Architecture Overview

### MVP Architecture (Phase 1)

```
┌───────────────────────────────────────────────────────────┐
│ Local Generation (Developer's Machine)                     │
│                                                             │
│ openadapt-capture/     →  npm run generate-recordings  →  │
│   ├── recording1/          (5 minutes)                     │
│   └── recording2/                                          │
│                                 ↓                          │
│                          public/recordings/                │
│                            ├── index.json                  │
│                            ├── recording1/                 │
│                            │   ├── thumbnail.jpg           │
│                            │   ├── preview.mp4             │
│                            │   └── screenshots/            │
│                            └── recording2/                 │
│                                                             │
│                                 ↓                          │
│                            git commit + push               │
│                                                             │
└───────────────────────────────────────────────────────────┘
                                 ↓
┌───────────────────────────────────────────────────────────┐
│ Netlify Auto-Deploy                                        │
│                                                             │
│ openadapt.ai  ←  [Static Site Generated]  ←  [Git Push]  │
│                                                             │
│ Landing Page:                                              │
│   RecordingShowcase component                              │
│     ↓ fetches                                              │
│   /recordings/index.json                                   │
│     ↓ loads                                                │
│   Video previews + thumbnails                              │
│     ↓ displays                                             │
│   Auto-rotating carousel                                   │
│                                                             │
└───────────────────────────────────────────────────────────┘
```

### Future Architecture (Phase 3-4)

```
┌─────────────────┐
│ User's Machine  │
│ openadapt CLI   │
└────────┬────────┘
         │ share
         ↓
┌─────────────────────────────────────┐
│ Cloud Backend                       │
│                                     │
│ S3 Bucket  ←─────→  API             │
│   ↓                   ↓             │
│ Quality Score    PostgreSQL         │
│   ↓                   ↓             │
│ Featured?        User Profiles      │
│                                     │
└──────────┬──────────────────────────┘
           │
           ↓
┌─────────────────────────────────────┐
│ Landing Page (openadapt.ai)         │
│                                     │
│ React App                           │
│   ↓ fetches                         │
│ /api/recordings/featured            │
│   ↓ displays                        │
│ Dynamic Carousel                    │
│   ↓ links to                        │
│ Recording Gallery                   │
│   ↓ individual pages                │
│ Full Viewer Experience              │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Implementation Phases

### Phase 1: MVP (Week 1-2) - **Start Here**
- **Goal:** Replace static video with recording carousel
- **Effort:** 20 hours
- **Cost:** $0
- **Deliverables:**
  - RecordingShowcase component
  - Generation script
  - 2-3 featured recordings
  - Deployed to production

### Phase 2: Automation (Week 3-4)
- **Goal:** Weekly auto-updates + gallery page
- **Effort:** 18 hours
- **Cost:** $0
- **Deliverables:**
  - GitHub Action (weekly updates)
  - `/recordings` gallery page
  - Search and filters

### Phase 3: S3 Migration (Month 2)
- **Goal:** Cloud storage, no git bloat
- **Effort:** 19 hours
- **Cost:** $14/month
- **Deliverables:**
  - S3 bucket setup
  - CloudFront CDN
  - API endpoint
  - Migration complete

### Phase 4: User Submissions (Month 3-6)
- **Goal:** Community-driven content
- **Effort:** 50 hours
- **Cost:** $25/month
- **Deliverables:**
  - User authentication
  - Upload CLI
  - Moderation system
  - User profiles

---

## 📊 Key Metrics

### Success Criteria (MVP Launch)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Showcase Views | 1000/week | Google Analytics |
| Click-through Rate | 5% | Event tracking |
| Page Load Time | < 3s | Lighthouse |
| Bounce Rate | < 40% | Analytics |
| Install Conversions | 50/week | Attribution |

### Performance Targets

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| Page Load | ~5s | ~2s | 2.5x faster |
| Video Size | 85 MB | 1.5 MB | 57x smaller |
| Content Updates | Manual | Weekly | Automatic |

---

## 💡 Design Principles

### 1. Start Simple, Scale Progressively
- MVP uses local generation + git
- Phase 2 adds automation
- Phase 3 adds cloud storage
- Phase 4 adds community features

### 2. Auto-Generate Everything
- Thumbnails from first screenshot
- Preview videos (10-second loops)
- Metadata from recordings
- Quality scores from algorithms

### 3. Mobile-First Design
- Responsive breakpoints (375px, 768px, 1024px)
- Touch-friendly controls
- Lazy loading for performance
- Optimized asset sizes

### 4. Accessibility Built-In
- Semantic HTML (`<section>`, `<nav>`)
- ARIA labels for screen readers
- Keyboard navigation (Tab, Enter, Arrows)
- Captions for videos

---

## 🛠 Technical Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS + Custom CSS Modules
- **Animations:** CSS transitions + Framer Motion
- **Images:** Next.js Image component (optimization)

### Generation Pipeline
- **Asset Generation:** Node.js scripts
- **Screenshot Extraction:** Python (openadapt-viewer)
- **Video Processing:** ffmpeg
- **Data Format:** JSON (recordings index)

### Deployment
- **Hosting:** Netlify (auto-deploy from git)
- **CDN:** Netlify CDN (Phase 1-2)
- **CDN:** CloudFront (Phase 3+)
- **Storage:** Git (MVP) → S3 (Phase 3+)

### Automation
- **CI/CD:** GitHub Actions
- **Scheduling:** Cron (weekly updates)
- **Testing:** Playwright (visual regression)

---

## 📁 File Structure

```
openadapt-web/
├── LANDING_PAGE_README.md            ← You are here
├── LANDING_PAGE_SUMMARY.md           ← Executive summary
├── LANDING_PAGE_QUICK_START.md       ← Implementation guide
├── LANDING_PAGE_DESIGN.md            ← Complete design doc
├── LANDING_PAGE_MOCKUPS.md           ← Visual mockups
│
├── components/
│   ├── RecordingShowcase.js          ← New component (create)
│   ├── RecordingShowcase.module.css  ← Styling (create)
│   ├── RecordingCard.js              ← Card component (create)
│   ├── MastHead.js                   ← Existing (keep or replace)
│   └── ...
│
├── pages/
│   ├── index.js                      ← Landing page (update)
│   └── recordings/
│       ├── index.js                  ← Gallery page (create later)
│       └── [id].js                   ← Recording page (create later)
│
├── scripts/
│   ├── generate-recordings.js        ← Generation script (create)
│   └── generate-index.js             ← Index generator (create)
│
├── public/
│   └── recordings/                   ← Generated assets (output)
│       ├── index.json                ← Master index
│       ├── turn-off-nightshift/
│       │   ├── metadata.json
│       │   ├── thumbnail.jpg
│       │   ├── preview.mp4
│       │   └── screenshots/
│       └── demo_new/
│           └── ...
│
└── .github/
    └── workflows/
        └── update-recordings.yml     ← Weekly automation (Phase 2)
```

---

## 🚦 Getting Started Checklist

### Before You Start

- [ ] Read [LANDING_PAGE_SUMMARY.md](LANDING_PAGE_SUMMARY.md) (15 min)
- [ ] Review [LANDING_PAGE_QUICK_START.md](LANDING_PAGE_QUICK_START.md) (20 min)
- [ ] Check you have access to:
  - [ ] openadapt-capture recordings
  - [ ] openadapt-viewer tools
  - [ ] openadapt-web repository

### Week 1: Implementation

- [ ] **Day 1-2:** Generate recording assets
  - [ ] Create `scripts/generate-recordings.js`
  - [ ] Run `npm run generate-recordings`
  - [ ] Verify output in `public/recordings/`

- [ ] **Day 3-4:** Build component
  - [ ] Create `components/RecordingShowcase.js`
  - [ ] Create `components/RecordingShowcase.module.css`
  - [ ] Test component in isolation

- [ ] **Day 5-6:** Integrate
  - [ ] Update `pages/index.js`
  - [ ] Test locally (`npm run dev`)
  - [ ] Mobile responsive check

- [ ] **Day 7:** Deploy
  - [ ] Create PR with clear description
  - [ ] Test on Netlify preview
  - [ ] QA review
  - [ ] Merge to main
  - [ ] Verify production

### Week 2: Monitor & Iterate

- [ ] Monitor Google Analytics
- [ ] Collect user feedback
- [ ] Fix any bugs
- [ ] Plan Phase 2 (automation)

---

## 🤔 FAQ

### Q: Do I need to read all 4 documents?

**A:** No! Choose based on your role:
- **Implementing?** → Quick Start Guide
- **Designing?** → Mockups + Quick Start
- **Planning?** → Summary + Complete Design
- **Deciding?** → Summary only

### Q: Can I implement without all recordings?

**A:** Yes! Even 2 recordings work for MVP. Add more over time.

### Q: What if I don't have openadapt-viewer installed?

**A:** Install it first:
```bash
cd /Users/abrichr/oa/src/openadapt-viewer
uv sync
```

### Q: How long does generation take?

**A:** ~5 minutes for 2-3 recordings (depends on video length).

### Q: Can I customize the design?

**A:** Absolutely! All code is provided as a starting point. Customize CSS, layout, behavior as needed.

### Q: What if the PR is too large (videos in git)?

**A:** Use Git LFS or host videos on GitHub Releases. See troubleshooting in Quick Start.

---

## 🐛 Troubleshooting

**Issue:** Generation script fails

**Check:**
1. openadapt-capture recordings exist
2. openadapt-viewer installed (`uv sync`)
3. ffmpeg installed (`brew install ffmpeg`)
4. Python environment active

**Issue:** Videos don't autoplay

**Solution:** Ensure `muted` and `playsInline` attributes:
```javascript
<video autoPlay loop muted playsInline>
```

**Issue:** Page loads slowly

**Solution:**
1. Compress videos more (CRF 32)
2. Convert images to WebP
3. Add lazy loading
4. Use CDN (Phase 3)

**More:** See troubleshooting section in [LANDING_PAGE_QUICK_START.md](LANDING_PAGE_QUICK_START.md)

---

## 📞 Support

### Questions?
- **Discord:** https://discord.gg/yF527cQbDG
- **GitHub Issues:** https://github.com/OpenAdaptAI/OpenAdapt.web/issues
- **Email:** support@openadapt.ai

### Contributing
1. Read documentation
2. Create feature branch
3. Implement changes
4. Open PR with clear description
5. Request review

---

## 🎉 Summary

You now have **complete documentation** for implementing the next-generation OpenAdapt landing page:

1. **[Executive Summary](LANDING_PAGE_SUMMARY.md)** - The "why" and "what"
2. **[Quick Start Guide](LANDING_PAGE_QUICK_START.md)** - The "how" (step-by-step)
3. **[Complete Design](LANDING_PAGE_DESIGN.md)** - The "details" (architecture, roadmap)
4. **[Visual Mockups](LANDING_PAGE_MOCKUPS.md)** - The "look" (UI/UX specs)

**Ready to start?**

```bash
cd /Users/abrichr/oa/src/openadapt-web
npm run generate-recordings
# Then open LANDING_PAGE_QUICK_START.md and follow along!
```

**Let's build something amazing! 🚀**

---

*Last Updated: January 17, 2026*
*Documentation Version: 1.0*
