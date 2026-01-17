# Landing Page Quick Start Guide

**TL;DR:** Implement the next-gen landing page with auto-generated recordings in 1 week.

---

## 🎯 Goal

Replace static video masthead with **auto-generated recording showcase** that updates automatically.

## 📋 Prerequisites

- Node.js 18+
- Access to openadapt-capture recordings
- Access to openadapt-viewer tools
- 20 hours development time

## 🚀 Quick Implementation (MVP)

### Step 1: Generate Recording Assets (2 hours)

```bash
# Terminal 1: Create generation script
cd /Users/abrichr/oa/src/openadapt-web
mkdir -p scripts
touch scripts/generate-recordings.js

# Terminal 2: Create output directory
mkdir -p public/recordings
```

**File: `scripts/generate-recordings.js`**

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CAPTURE_DIR = '/Users/abrichr/oa/src/openadapt-capture';
const VIEWER_DIR = '/Users/abrichr/oa/src/openadapt-viewer';
const OUTPUT_DIR = path.join(__dirname, '../public/recordings');

// Recordings to showcase (hardcoded for MVP)
const RECORDINGS = [
  {
    id: 'turn-off-nightshift',
    name: 'Turn Off Night Shift',
    description: 'Navigate macOS System Preferences to disable Night Shift',
    domain: 'system',
    featured: true,
  },
  {
    id: 'demo_new',
    name: 'Demo Workflow',
    description: 'General workflow demonstration',
    domain: 'general',
    featured: true,
  },
];

async function generateRecordings() {
  console.log('🎬 Generating recording assets...\n');

  const recordingData = [];

  for (const rec of RECORDINGS) {
    console.log(`Processing: ${rec.name}`);

    const recPath = path.join(CAPTURE_DIR, rec.id);
    if (!fs.existsSync(recPath)) {
      console.log(`  ⚠️  Recording not found, skipping`);
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, rec.id);
    fs.mkdirSync(outputPath, { recursive: true });

    // 1. Copy first few screenshots (thumbnail)
    const screenshotsDir = path.join(outputPath, 'screenshots');
    fs.mkdirSync(screenshotsDir, { recursive: true });

    console.log('  → Extracting screenshots...');
    try {
      execSync(
        `cd ${VIEWER_DIR} && \
         uv run python -c "
from openadapt_capture import Capture
import os
capture = Capture.load('${recPath}')
os.makedirs('${screenshotsDir}', exist_ok=True)
for i, action in enumerate(list(capture.actions())[:5]):  # First 5
    action.screenshot.save(f'${screenshotsDir}/{i+1:03d}.jpg', quality=80)
print('Saved 5 screenshots')
"`,
        { stdio: 'inherit' }
      );
    } catch (e) {
      console.log('  ⚠️  Screenshot extraction failed, using placeholder');
    }

    // 2. Create thumbnail (first screenshot)
    const screenshots = fs.readdirSync(screenshotsDir);
    if (screenshots.length > 0) {
      fs.copyFileSync(
        path.join(screenshotsDir, screenshots[0]),
        path.join(outputPath, 'thumbnail.jpg')
      );
    }

    // 3. Generate preview video (10 seconds)
    const videoPath = path.join(recPath, 'video.mp4');
    if (fs.existsSync(videoPath)) {
      console.log('  → Generating preview video...');
      try {
        execSync(
          `ffmpeg -i "${videoPath}" -t 10 -vf scale=1280:720 \
           -c:v libx264 -crf 28 -preset fast \
           "${path.join(outputPath, 'preview.mp4')}" -y`,
          { stdio: 'inherit' }
        );
      } catch (e) {
        console.log('  ⚠️  Preview video generation failed');
      }
    }

    // 4. Load metadata
    let metadata = {};
    const metadataPath = path.join(recPath, 'metadata.json');
    if (fs.existsSync(metadataPath)) {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    }

    // 5. Add to index
    recordingData.push({
      id: rec.id,
      name: rec.name,
      description: rec.description,
      domain: rec.domain,
      platform: metadata.platform || 'unknown',
      duration_seconds: metadata.duration || 0,
      action_count: metadata.action_count || 0,
      created_at: metadata.created_at || new Date().toISOString(),
      featured: rec.featured,
      quality_score: 90,
      thumbnail: `/recordings/${rec.id}/thumbnail.jpg`,
      preview_video: `/recordings/${rec.id}/preview.mp4`,
      screenshots: screenshots.map((s) => `/recordings/${rec.id}/screenshots/${s}`),
      tags: metadata.tags || [rec.domain],
    });

    console.log('  ✅ Complete\n');
  }

  // 6. Write index.json
  const index = {
    version: '1.0',
    generated_at: new Date().toISOString(),
    recordings: recordingData,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  );

  console.log(`🎉 Generated ${recordingData.length} recordings`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
}

generateRecordings().catch(console.error);
```

**Make executable:**

```bash
chmod +x scripts/generate-recordings.js
```

**Add to package.json:**

```json
{
  "scripts": {
    "generate-recordings": "node scripts/generate-recordings.js"
  }
}
```

**Run it:**

```bash
npm run generate-recordings
```

**Expected output:**

```
public/recordings/
├── index.json
├── turn-off-nightshift/
│   ├── thumbnail.jpg
│   ├── preview.mp4
│   └── screenshots/
│       ├── 001.jpg
│       ├── 002.jpg
│       └── ...
└── demo_new/
    └── ...
```

---

### Step 2: Create RecordingShowcase Component (4 hours)

**File: `components/RecordingShowcase.js`**

```javascript
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './RecordingShowcase.module.css';

export default function RecordingShowcase() {
  const [recordings, setRecordings] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Load recordings index
    fetch('/recordings/index.json')
      .then((res) => res.json())
      .then((data) => {
        const featured = data.recordings.filter((r) => r.featured);
        setRecordings(featured);
      })
      .catch((err) => console.error('Failed to load recordings:', err));
  }, []);

  useEffect(() => {
    // Auto-rotate every 10 seconds (unless hovered)
    if (recordings.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recordings.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [recordings.length, isHovered]);

  if (recordings.length === 0) return null;

  const current = recordings[currentIndex];

  return (
    <div className={styles.showcaseContainer}>
      <div className={styles.showcaseHeader}>
        <h2>Real OpenAdapt Automations</h2>
        <p>Watch actual recorded workflows · Updated automatically</p>
      </div>

      <div
        className={styles.showcaseMain}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <video
          key={current.id}
          autoPlay
          loop
          muted
          playsInline
          poster={current.thumbnail}
          className={styles.showcaseVideo}
        >
          <source src={current.preview_video} type="video/mp4" />
        </video>

        <div className={styles.showcaseInfo}>
          <h3>{current.name}</h3>
          <p>{current.description}</p>
          <div className={styles.showcaseMeta}>
            <span>{current.action_count} actions</span>
            <span>{current.duration_seconds}s</span>
            <span>{current.platform}</span>
          </div>
          <Link href="#start" className={styles.showcaseCta}>
            Learn More →
          </Link>
        </div>
      </div>

      <div className={styles.showcaseCarousel}>
        {recordings.map((rec, idx) => (
          <button
            key={rec.id}
            onClick={() => setCurrentIndex(idx)}
            className={`${styles.carouselItem} ${
              idx === currentIndex ? styles.carouselItemActive : ''
            }`}
          >
            <Image
              src={rec.thumbnail}
              width={200}
              height={112}
              alt={rec.name}
              className={styles.carouselThumbnail}
            />
            <span className={styles.carouselLabel}>{rec.name}</span>
            <span className={styles.carouselMeta}>
              {rec.duration_seconds}s · {rec.action_count} actions
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**File: `components/RecordingShowcase.module.css`**

```css
.showcaseContainer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.showcaseHeader {
  text-align: center;
  margin-bottom: 40px;
}

.showcaseHeader h2 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary, #f0f0f0);
}

.showcaseHeader p {
  font-size: 16px;
  color: var(--text-secondary, #a0a0b0);
}

.showcaseMain {
  position: relative;
  background: var(--bg-secondary, #12121a);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
}

.showcaseMain:hover {
  transform: scale(1.01);
}

.showcaseVideo {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
  object-fit: cover;
}

.showcaseInfo {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  padding: 32px;
  color: white;
}

.showcaseInfo h3 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.showcaseInfo p {
  font-size: 16px;
  margin-bottom: 12px;
  opacity: 0.9;
}

.showcaseMeta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 16px;
}

.showcaseCta {
  display: inline-block;
  padding: 10px 20px;
  background: var(--primary, #560df8);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s ease;
}

.showcaseCta:hover {
  background: var(--primary-dark, #3d0ab3);
}

.showcaseCarousel {
  display: flex;
  gap: 16px;
  margin-top: 32px;
  overflow-x: auto;
  padding-bottom: 16px;
}

.carouselItem {
  flex-shrink: 0;
  width: 240px;
  background: var(--bg-secondary, #12121a);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s ease;
  text-align: left;
}

.carouselItem:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.carouselItemActive {
  opacity: 1;
  border-color: var(--primary, #560df8);
}

.carouselThumbnail {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 8px;
}

.carouselLabel {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary, #f0f0f0);
  margin-bottom: 4px;
}

.carouselMeta {
  display: block;
  font-size: 12px;
  color: var(--text-secondary, #a0a0b0);
}

/* Responsive */
@media (max-width: 768px) {
  .showcaseInfo {
    padding: 20px;
  }

  .showcaseInfo h3 {
    font-size: 20px;
  }

  .showcaseInfo p {
    font-size: 14px;
  }

  .carouselItem {
    width: 180px;
  }
}
```

---

### Step 3: Update Landing Page (2 hours)

**File: `pages/index.js`**

```javascript
import { useRef, useState } from 'react';

import Developers from '@components/Developers';
import Footer from '@components/Footer';
import IndustriesGrid from '@components/IndustriesGrid';
import MastHead from '@components/MastHead';
import RecordingShowcase from '@components/RecordingShowcase'; // NEW

export default function Home() {
  const [feedbackData, setFeedbackData] = useState({
    email: '',
    message: '',
  });

  const sectionRef = useRef(null);

  return (
    <div>
      <MastHead />

      {/* NEW: Replace or supplement video with recording showcase */}
      <RecordingShowcase />

      <Developers />
      <IndustriesGrid
        feedbackData={feedbackData}
        setFeedbackData={setFeedbackData}
        sectionRef={sectionRef}
      />
      <Footer />
    </div>
  );
}
```

**Option 1: Replace MastHead completely**

Comment out `<MastHead />` and rely on `<RecordingShowcase />`.

**Option 2: Keep both (recommended for MVP)**

Keep existing masthead, add RecordingShowcase below as "Latest Automations" section.

---

### Step 4: Test Locally (1 hour)

```bash
# Start dev server
npm run dev

# Open browser
open http://localhost:3000

# Check:
# ✅ Recording showcase loads
# ✅ Videos autoplay (muted)
# ✅ Rotation works (10s)
# ✅ Hover pauses rotation
# ✅ Clicking carousel switches recording
# ✅ Mobile responsive
```

---

### Step 5: Deploy (1 hour)

```bash
# Create feature branch
git checkout -b feature/recording-showcase

# Commit assets (use Git LFS if videos are large)
git add public/recordings/
git add components/RecordingShowcase.*
git add pages/index.js
git add scripts/generate-recordings.js
git add package.json

git commit -m "Add auto-generated recording showcase

- Replace static video with dynamic recording carousel
- Auto-rotates through featured recordings
- Generates assets from openadapt-capture
- Mobile responsive design"

# Push and create PR
git push -u origin feature/recording-showcase
gh pr create --title "Add Recording Showcase to Landing Page" \
  --body "Implements auto-generated recording showcase. See LANDING_PAGE_DESIGN.md for details."

# Deploy to Netlify preview
# (Automatic when PR is created)

# Review and merge
# Once approved, merge to main
# Netlify auto-deploys to production
```

---

## 📊 Success Criteria

After deployment, verify:

- [ ] Recording showcase visible on landing page
- [ ] Videos autoplay and loop
- [ ] Rotation works (10 seconds)
- [ ] Carousel thumbnails clickable
- [ ] Mobile responsive
- [ ] Page load time < 3s
- [ ] Lighthouse score > 90
- [ ] No console errors

---

## 🔄 Weekly Update Process

**Option A: Manual (MVP)**

```bash
# Every week
cd /Users/abrichr/oa/src/openadapt-web
npm run generate-recordings
git add public/recordings/
git commit -m "Update recordings showcase [automated]"
git push
```

**Option B: GitHub Action (Phase 2)**

Create `.github/workflows/update-recordings.yml`:

```yaml
name: Update Recordings

on:
  schedule:
    - cron: '0 0 * * 0' # Every Sunday at midnight
  workflow_dispatch: # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run generate-recordings
      - run: |
          git config user.name "OpenAdapt Bot"
          git config user.email "bot@openadapt.ai"
          git add public/recordings/
          git commit -m "Update recordings [automated]" || exit 0
          git push
```

---

## 🐛 Troubleshooting

### Issue: Videos don't autoplay

**Solution:** Ensure videos are muted and have `playsInline` attribute:

```javascript
<video autoPlay loop muted playsInline>
```

### Issue: Large git commits

**Solution:** Use Git LFS:

```bash
git lfs install
git lfs track "*.mp4"
git add .gitattributes
```

### Issue: Preview videos too large

**Solution:** Increase compression:

```bash
ffmpeg -i input.mp4 -t 10 -vf scale=1280:720 \
  -c:v libx264 -crf 32 -preset fast output.mp4
```

(CRF 32 = more compression, CRF 18 = less compression)

### Issue: Screenshots missing

**Check:**

1. openadapt-capture recording exists
2. openadapt-viewer installed: `cd /Users/abrichr/oa/src/openadapt-viewer && uv sync`
3. Python script runs: `uv run python -c "from openadapt_capture import Capture; print('OK')"`

---

## 📚 Next Steps

After MVP is deployed:

### Week 2: Gallery Page

```bash
# Create gallery page
mkdir -p pages/recordings
touch pages/recordings/index.js

# Implement:
# - Grid of all recordings
# - Search and filters
# - Individual recording pages
```

### Week 3: Automation

```bash
# Set up GitHub Action for weekly updates
touch .github/workflows/update-recordings.yml

# Test:
gh workflow run update-recordings.yml
```

### Week 4: Optimization

- Convert images to WebP
- Add lazy loading
- Implement CDN (CloudFront or similar)
- A/B test against old design

---

## 📖 Related Documents

- [LANDING_PAGE_DESIGN.md](LANDING_PAGE_DESIGN.md) - Complete design document
- [LANDING_PAGE_MOCKUPS.md](LANDING_PAGE_MOCKUPS.md) - Visual mockups
- [/Users/abrichr/oa/src/openadapt-viewer/CATALOG_SYSTEM.md](../openadapt-viewer/CATALOG_SYSTEM.md) - Recording catalog

---

## 💡 Pro Tips

1. **Start Small:** 2-3 recordings is enough for MVP
2. **Use Placeholders:** If ffmpeg fails, use static images first
3. **Test Mobile:** Most users are on mobile
4. **Monitor Performance:** Check Lighthouse scores
5. **Get Feedback:** Show to users before full rollout

---

## ⏱ Time Estimate Breakdown

| Task | Time | Priority |
|------|------|----------|
| Generate recordings script | 2h | P0 |
| RecordingShowcase component | 4h | P0 |
| CSS styling | 2h | P0 |
| Landing page integration | 2h | P0 |
| Local testing | 1h | P0 |
| PR and deployment | 1h | P0 |
| Bug fixes and polish | 4h | P1 |
| Documentation | 2h | P1 |
| **Total** | **18-20h** | |

---

**Ready to start? Run the first command:**

```bash
cd /Users/abrichr/oa/src/openadapt-web
npm run generate-recordings
```

Then follow steps 2-5 above!
