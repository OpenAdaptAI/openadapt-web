# Next-Generation OpenAdapt Landing Page Design

**Date:** January 17, 2026
**Vision:** Auto-generate landing page from latest recordings, creating a "futuristic and amazing" experience

---

## Executive Summary

This document outlines a strategic plan to transform the OpenAdapt landing page from static content to a **dynamic, auto-generated showcase** of real OpenAdapt recordings. The design bridges from an MVP (implementable immediately with few users) to a long-term vision (scalable to thousands of users sharing recordings).

**Key Innovation:** Replace the static video masthead with automatically generated visuals from actual OpenAdapt recordings, showing users the latest functionality and real-world applications.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Long-Term Vision (Many Users)](#long-term-vision-many-users)
3. [MVP Design (Few Users, Now)](#mvp-design-few-users-now)
4. [Landing Page Experience Design](#landing-page-experience-design)
5. [Auto-Generation Pipeline](#auto-generation-pipeline)
6. [Storage Strategy](#storage-strategy)
7. [User Flow Design](#user-flow-design)
8. [Technical Implementation](#technical-implementation)
9. [Migration Path (MVP → Scale)](#migration-path-mvp--scale)
10. [Success Metrics](#success-metrics)
11. [Cost/Effort Analysis](#costeffort-analysis)
12. [Implementation Roadmap](#implementation-roadmap)

---

## Current State Analysis

### Existing Landing Page Components

**File:** `/Users/abrichr/oa/src/openadapt-web/pages/index.js`

```javascript
<MastHead />        // Static video (demo.mp4)
<Developers />      // Installation instructions
<IndustriesGrid />  // 9 industry use cases
<Footer />          // Links and contact
```

### MastHead Component (To Be Replaced)

**Current Implementation:**
- Static `demo.mp4` video (85MB, hardcoded at 80-second poster frame)
- Manual recording, no automatic updates
- Single demonstration workflow
- No variety or rotation

**Pain Points:**
1. Static content becomes stale
2. Doesn't showcase latest features automatically
3. Single workflow doesn't show diversity of use cases
4. Manual update process (re-record, re-upload, redeploy)

### Available Infrastructure

**Recording System (openadapt-capture):**
- SQLite database storage
- Video/audio capture with transcription
- Screenshot generation at each action
- Metadata: timestamps, action types, coordinates

**Viewer System (openadapt-viewer):**
- Catalog system (automatic recording discovery)
- Segmentation viewer (episode extraction)
- Interactive HTML viewers (playback, timeline)
- Screenshot automation (Playwright-based)
- Component library for building visualizations

**Existing Recordings:**
- `turn-off-nightshift` - System preferences automation
- `demo_new` - General workflow demonstration
- Plus capability to generate more on demand

### Tech Stack

**Framework:** Next.js 14 (React)
**Styling:** Tailwind CSS + DaisyUI
**Deployment:** Netlify (automatic from `main` branch)
**Assets:** `/public` directory (static files)

---

## Long-Term Vision (Many Users)

**Scenario:** Hundreds or thousands of users running OpenAdapt daily, creating diverse recordings.

### Community Recording Gallery

**Concept:** User-generated content platform for automation demonstrations.

#### Key Features

1. **User Opt-In Sharing**
   - Checkbox during recording: "Share this recording publicly"
   - Privacy controls: scrub PII before upload
   - License: CC-BY-4.0 (attribution required)

2. **Quality Scoring System**
   ```python
   def calculate_quality_score(recording):
       score = 0
       # Episode coherence (segmentation quality)
       score += len(recording.episodes) * 10
       # Visual clarity (screenshot sharpness, contrast)
       score += image_quality_score(recording.screenshots)
       # Task diversity (different action types)
       score += len(set(action.type for action in recording.actions))
       # Duration (not too short, not too long)
       score += optimal_duration_score(recording.duration)
       # Engagement (views, likes if implemented)
       score += engagement_score(recording.stats)
       return score
   ```

3. **Curation & Moderation**
   - Automated quality filter (score > threshold)
   - Manual review queue for featured recordings
   - Community reporting for inappropriate content
   - Blacklist/whitelist for users

4. **Featured Rotation**
   - Top 10 recordings rotate on landing page
   - Daily/weekly refresh
   - Category-based (office, browser, system, creative)
   - "Editor's Pick" section

#### Architecture

```
User's Machine                     Cloud Infrastructure                Landing Page
──────────────                     ───────────────────                ─────────────

┌─────────────┐                   ┌──────────────────┐              ┌────────────┐
│ OpenAdapt   │ ─── Upload ────>  │ S3 Bucket        │ <─── API ─── │ React App  │
│ Recording   │   (CLI command)   │ /recordings/     │              │            │
└─────────────┘                   │   - video.mp4    │              │ Featured   │
                                  │   - metadata.json│              │ Carousel   │
                                  │   - screenshots/ │              └────────────┘
                                  └──────────────────┘
                                           │
                                           v
                                  ┌──────────────────┐
                                  │ PostgreSQL DB    │
                                  │ - Recording meta │
                                  │ - Quality scores │
                                  │ - View counts    │
                                  └──────────────────┘
                                           │
                                           v
                                  ┌──────────────────┐
                                  │ Background Jobs  │
                                  │ - Quality scoring│
                                  │ - Thumbnail gen  │
                                  │ - PII scrubbing  │
                                  └──────────────────┘
```

#### API Endpoints

```
GET  /api/recordings              # List all public recordings
GET  /api/recordings/featured     # Top-rated for homepage
GET  /api/recordings/:id          # Single recording details
POST /api/recordings              # Upload new recording (authenticated)
GET  /api/recordings/:id/viewer   # Embed-ready viewer HTML
GET  /api/categories              # Browse by category/domain
```

#### Privacy Considerations

1. **PII Scrubbing (Pre-Upload)**
   - Use `openadapt-privacy` package
   - Detect and blur: emails, phone numbers, SSNs, credit cards
   - OCR + regex patterns on screenshots
   - Audio transcription filtering

2. **User Consent**
   - Explicit opt-in required
   - Terms of service agreement
   - Right to remove recordings

3. **Moderation**
   - Automated NSFW detection
   - Text content filtering
   - Manual review queue for first upload per user

#### Storage at Scale

**Estimated Costs (1000 recordings):**

| Component | Size/Recording | Total (1000) | Monthly Cost |
|-----------|----------------|--------------|--------------|
| Video (MP4) | 10 MB | 10 GB | $0.25 (S3) |
| Screenshots | 2 MB | 2 GB | $0.05 |
| Metadata (JSON) | 100 KB | 100 MB | $0.01 |
| Database | - | 1 GB | $5 (RDS micro) |
| CloudFront (CDN) | - | 100 GB transfer | $8.50 |
| **Total** | | | **~$14/month** |

**Scalability:**
- Add CloudFront CDN for global delivery
- S3 lifecycle policies (archive old recordings to Glacier)
- Lazy-load thumbnails, only full video on demand

---

## MVP Design (Few Users, Now)

**Constraint:** Only 2-5 internal recordings available, no public submissions yet.

### MVP Strategy: Local-to-Static Generation

**Goal:** Demonstrate the concept without building full backend infrastructure.

#### Approach: "Baked-In" Static Assets

```
┌────────────────────────────────────────────────────────────────┐
│ MVP Flow: Local Generation → Git → Deploy                      │
└────────────────────────────────────────────────────────────────┘

1. Developer runs generation script locally:
   $ cd /Users/abrichr/oa/src/openadapt-web
   $ npm run generate-recordings

2. Script does:
   - Scans openadapt-capture for recordings (via catalog)
   - Runs screenshot pipeline on each
   - Generates optimized thumbnails/previews
   - Creates recordings index JSON
   - Copies assets to public/recordings/

3. Commit and push:
   $ git add public/recordings/
   $ git commit -m "Update recordings showcase"
   $ git push origin main

4. Netlify auto-deploys with new assets
```

#### Directory Structure

```
openadapt-web/
├── public/
│   └── recordings/
│       ├── index.json                    # Master index
│       ├── turn-off-nightshift/
│       │   ├── metadata.json             # Recording details
│       │   ├── thumbnail.jpg             # 1280x720 cover image
│       │   ├── preview.mp4               # 10-second loop
│       │   ├── screenshots/
│       │   │   ├── 001.jpg
│       │   │   ├── 002.jpg
│       │   │   └── ...
│       │   └── viewer.html               # Full interactive viewer
│       ├── notepad-automation/
│       │   └── ...
│       └── browser-navigation/
│           └── ...
├── components/
│   └── RecordingShowcase.js             # New component
└── scripts/
    └── generate-recordings.js            # Generation script
```

#### index.json Format

```json
{
  "version": "1.0",
  "generated_at": "2026-01-17T10:00:00Z",
  "recordings": [
    {
      "id": "turn-off-nightshift",
      "name": "Turn Off Night Shift",
      "description": "Demonstrates navigating macOS System Preferences to disable Night Shift feature",
      "domain": "system",
      "platform": "macOS",
      "duration_seconds": 45,
      "action_count": 12,
      "created_at": "2026-01-15T14:30:00Z",
      "featured": true,
      "quality_score": 95,
      "thumbnail": "/recordings/turn-off-nightshift/thumbnail.jpg",
      "preview_video": "/recordings/turn-off-nightshift/preview.mp4",
      "screenshots": [
        "/recordings/turn-off-nightshift/screenshots/001.jpg",
        "/recordings/turn-off-nightshift/screenshots/002.jpg"
      ],
      "viewer_url": "/recordings/turn-off-nightshift/viewer.html",
      "tags": ["system", "preferences", "display", "macos"]
    }
  ]
}
```

#### MVP Components

**1. RecordingShowcase Component**

```javascript
// components/RecordingShowcase.js
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function RecordingShowcase() {
  const [recordings, setRecordings] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetch('/recordings/index.json')
      .then(res => res.json())
      .then(data => setRecordings(data.recordings.filter(r => r.featured)))
  }, [])

  if (recordings.length === 0) return null

  const current = recordings[currentIndex]

  return (
    <div className="recording-showcase">
      <div className="showcase-header">
        <h2>Real OpenAdapt Automations</h2>
        <p>Watch actual recorded workflows - updated automatically</p>
      </div>

      {/* Main Feature */}
      <div className="showcase-main">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={current.thumbnail}
          className="showcase-video"
        >
          <source src={current.preview_video} type="video/mp4" />
        </video>

        <div className="showcase-info">
          <h3>{current.name}</h3>
          <p>{current.description}</p>
          <div className="showcase-meta">
            <span>{current.duration_seconds}s</span>
            <span>{current.action_count} actions</span>
            <span>{current.platform}</span>
          </div>
          <Link href={current.viewer_url} className="btn-view-full">
            View Full Recording →
          </Link>
        </div>
      </div>

      {/* Carousel of Others */}
      <div className="showcase-carousel">
        {recordings.map((rec, idx) => (
          <button
            key={rec.id}
            onClick={() => setCurrentIndex(idx)}
            className={idx === currentIndex ? 'active' : ''}
          >
            <Image src={rec.thumbnail} width={200} height={112} alt={rec.name} />
            <span>{rec.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

**2. Generation Script**

```javascript
// scripts/generate-recordings.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

async function generateRecordings() {
  const CAPTURE_DIR = '/Users/abrichr/oa/src/openadapt-capture'
  const OUTPUT_DIR = path.join(__dirname, '../public/recordings')

  // 1. Get recordings from catalog
  const recordings = [
    'turn-off-nightshift',
    'demo_new',
    // Add more as available
  ]

  const recordingData = []

  for (const recordingId of recordings) {
    const recordingPath = path.join(CAPTURE_DIR, recordingId)
    if (!fs.existsSync(recordingPath)) continue

    console.log(`Processing ${recordingId}...`)

    const outputPath = path.join(OUTPUT_DIR, recordingId)
    fs.mkdirSync(outputPath, { recursive: true })

    // 2. Generate screenshots via openadapt-viewer
    execSync(`cd /Users/abrichr/oa/src/openadapt-viewer && \
              uv run python scripts/generate_screenshots.py \
              --recording ${recordingId} \
              --output ${outputPath}/screenshots`,
              { stdio: 'inherit' })

    // 3. Generate thumbnail (first screenshot)
    const screenshots = fs.readdirSync(`${outputPath}/screenshots`)
    if (screenshots.length > 0) {
      fs.copyFileSync(
        `${outputPath}/screenshots/${screenshots[0]}`,
        `${outputPath}/thumbnail.jpg`
      )
    }

    // 4. Generate preview video (first 10 seconds)
    execSync(`ffmpeg -i ${recordingPath}/video.mp4 \
              -t 10 -vf scale=1280:720 \
              ${outputPath}/preview.mp4`,
              { stdio: 'inherit' })

    // 5. Generate viewer HTML
    execSync(`cd /Users/abrichr/oa/src/openadapt-viewer && \
              uv run python scripts/generate_viewer.py \
              --recording ${recordingId} \
              --output ${outputPath}/viewer.html`,
              { stdio: 'inherit' })

    // 6. Load metadata
    const metadata = JSON.parse(
      fs.readFileSync(`${recordingPath}/metadata.json`)
    )

    recordingData.push({
      id: recordingId,
      name: metadata.task_description || recordingId,
      description: metadata.description || '',
      domain: metadata.domain || 'general',
      platform: metadata.platform || 'unknown',
      duration_seconds: metadata.duration || 0,
      action_count: metadata.action_count || 0,
      created_at: metadata.created_at,
      featured: true, // All featured in MVP
      quality_score: 90,
      thumbnail: `/recordings/${recordingId}/thumbnail.jpg`,
      preview_video: `/recordings/${recordingId}/preview.mp4`,
      viewer_url: `/recordings/${recordingId}/viewer.html`,
      tags: metadata.tags || []
    })
  }

  // 7. Write index
  const index = {
    version: '1.0',
    generated_at: new Date().toISOString(),
    recordings: recordingData
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.json'),
    JSON.stringify(index, null, 2)
  )

  console.log(`Generated ${recordingData.length} recordings`)
}

generateRecordings()
```

**3. Package.json Script**

```json
{
  "scripts": {
    "generate-recordings": "node scripts/generate-recordings.js"
  }
}
```

#### MVP Pros/Cons

**Pros:**
- ✅ No backend infrastructure needed
- ✅ Works with existing Netlify deployment
- ✅ Fast to implement (1-2 days)
- ✅ Automatic via existing catalog system
- ✅ Version controlled (git tracks changes)

**Cons:**
- ❌ Manual regeneration required
- ❌ Large git commits (media assets)
- ❌ No real-time updates
- ❌ Limited to developer's recordings

#### MVP Limitations & Workarounds

| Limitation | Workaround |
|------------|-----------|
| Large git commits | Use Git LFS for media files |
| Manual updates | GitHub Action: weekly auto-regeneration |
| Only internal recordings | Document process for adding more |
| No user submissions | Phase 2 feature |

---

## Landing Page Experience Design

### Option 1: Rotating Recording Carousel (RECOMMENDED)

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenAdapt.AI                             │
│              Teach AI to use any software.                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                         │  │
│  │         [Auto-Playing Preview Video/GIF]               │  │
│  │                                                         │  │
│  │    Current: "Turn Off Night Shift"                     │  │
│  │    macOS System Preferences • 12 actions • 45s         │  │
│  │                                                         │  │
│  │              [View Full Recording →]                   │  │
│  │                                                         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  Real OpenAdapt automations from our community               │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ [thumb]  │  │ [thumb]  │  │ [thumb]  │  │ [thumb]  │   │
│  │ Turn Off │  │ Notepad  │  │ Browser  │  │ Office   │   │
│  │ Night..  │  │ Automat. │  │ Navigate │  │ Workflow │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  [Explore All Recordings →]                                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Auto-rotates through featured recordings every 10 seconds
- Hover to pause
- Click thumbnail to switch immediately
- "View Full Recording" opens interactive viewer
- Shows real metadata (action count, duration, platform)

**Implementation:**

```javascript
// Auto-rotate logic
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % recordings.length)
  }, 10000) // 10 seconds

  return () => clearInterval(timer)
}, [recordings.length])
```

### Option 2: Interactive Embedded Viewer

**Concept:** Embed full viewer directly on landing page (more ambitious).

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│                     OpenAdapt.AI                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┬──────────────────────┐ │
│  │                                 │ Select Recording:    │ │
│  │                                 │ ┌─────────────────┐  │ │
│  │     [Screenshot Display]        │ │ Turn Off Night..│  │ │
│  │                                 │ ├─────────────────┤  │ │
│  │                                 │ │ Notepad Auto... │  │ │
│  │                                 │ ├─────────────────┤  │ │
│  │                                 │ │ Browser Nav...  │  │ │
│  │                                 │ └─────────────────┘  │ │
│  │                                 │                      │ │
│  │  ◀  ▶  ⏸  [Timeline]           │ Current Step:        │ │
│  │                                 │ Click at (450, 320)  │ │
│  │  Step 5 of 12                   │ Timestamp: 12.5s     │ │
│  └─────────────────────────────────┴──────────────────────┘ │
│                                                               │
│  Explore real recorded workflows. No prompts, no scripts.    │
└─────────────────────────────────────────────────────────────┘
```

**Pros:**
- Immersive, interactive experience
- Users can explore at their own pace
- Showcases viewer capabilities

**Cons:**
- Complex UI for homepage
- May slow page load
- Distracts from CTA (install)

**Recommendation:** Use Option 1 for MVP, consider Option 2 for `/recordings` gallery page.

### Option 3: Dynamic Feature Showcase Grid

**Concept:** 3x3 grid of auto-generated screenshots, each showing different capability.

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│            See OpenAdapt in Action                           │
│         Auto-updated from latest recordings                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ System  │  │ Browser │  │ Office  │                     │
│  │ Prefs   │  │ Auto    │  │ Tasks   │                     │
│  │ [img]   │  │ [img]   │  │ [img]   │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ File    │  │ Creative│  │ Data    │                     │
│  │ Mgmt    │  │ Apps    │  │ Entry   │                     │
│  │ [img]   │  │ [img]   │  │ [img]   │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │ Code    │  │ Terminal│  │ Design  │                     │
│  │ Editing │  │ Commands│  │ Work    │                     │
│  │ [img]   │  │ [img]   │  │ [img]   │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

**Pros:**
- Shows diversity of use cases
- Visually striking
- Fast load (just images)

**Cons:**
- Requires 9 diverse recordings
- Less engaging than video
- Static feel

**Recommendation:** Consider for future when we have 20+ recordings across domains.

### Option 4: "Latest Automation" Activity Feed

**Concept:** Twitter/LinkedIn-style feed of recent automations.

**Visual Layout:**

```
┌─────────────────────────────────────────────────────────────┐
│          Latest OpenAdapt Automations                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐                                                │
│  │ [thumb]  │  Turn Off Night Shift                         │
│  │          │  by @mldsai • 2 days ago                      │
│  └──────────┘  12 actions • macOS • System Preferences      │
│                                                               │
│  ┌──────────┐                                                │
│  │ [thumb]  │  Notepad Text Automation                      │
│  │          │  by @contributor • 5 days ago                 │
│  └──────────┘  8 actions • Windows • Text Editing           │
│                                                               │
│  ┌──────────┐                                                │
│  │ [thumb]  │  Browser Navigation Workflow                  │
│  │          │  by @demo • 1 week ago                        │
│  └──────────┘  15 actions • Cross-platform • Web            │
│                                                               │
│  [View All Recordings →]                                     │
└─────────────────────────────────────────────────────────────┘
```

**Best For:** Long-term vision with many users.

---

## Auto-Generation Pipeline

### Complete Pipeline Architecture

```
┌───────────────────────────────────────────────────────────────┐
│ 1. RECORDING CAPTURE (User Action)                            │
│    openadapt capture start --name my-task                     │
│    [User performs task]                                       │
│    openadapt capture stop                                     │
│    → Saves to openadapt-capture/my-task/                     │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 2. CATALOG INDEXING (Automatic)                               │
│    openadapt-viewer catalog scan                              │
│    → Updates ~/.openadapt/catalog.db                          │
│    → Indexes: name, duration, action_count, platform          │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 3. SEGMENTATION (Optional, for ML)                            │
│    cd /Users/abrichr/oa/src/openadapt-ml                      │
│    python scripts/segment_recording.py --recording my-task    │
│    → Extracts episodes (coherent sub-tasks)                   │
│    → Saves to segmentation_output/my-task_episodes.json       │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 4. SCREENSHOT GENERATION (For Web)                            │
│    cd /Users/abrichr/oa/src/openadapt-viewer                  │
│    python scripts/generate_screenshots.py \                   │
│      --recording my-task \                                    │
│      --output /tmp/screenshots                                │
│    → Generates: 001.jpg, 002.jpg, ... (one per action)       │
│    → Optimized: 1280x720, 80% JPEG quality                   │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 5. PREVIEW VIDEO GENERATION (10-second loop)                  │
│    ffmpeg -i video.mp4 -t 10 -vf scale=1280:720 preview.mp4  │
│    → Creates lightweight preview for landing page             │
│    → ~500KB vs 85MB full video                               │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 6. VIEWER GENERATION (Interactive HTML)                       │
│    python scripts/generate_viewer.py \                        │
│      --recording my-task \                                    │
│      --output viewer.html                                     │
│    → Standalone HTML with playback controls                   │
│    → Embeds screenshots, metadata, timeline                   │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 7. QUALITY SCORING (MVP: Manual, Future: Automated)           │
│    quality_score = score_recording(recording)                 │
│    if quality_score > 80: featured = True                     │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 8. ASSET PACKAGING                                            │
│    public/recordings/my-task/                                 │
│    ├── metadata.json                                          │
│    ├── thumbnail.jpg     (first screenshot)                   │
│    ├── preview.mp4       (10-second loop)                     │
│    ├── screenshots/      (all action screenshots)             │
│    └── viewer.html       (interactive viewer)                 │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 9. INDEX GENERATION                                           │
│    Aggregates all recordings into index.json                  │
│    {                                                          │
│      "recordings": [                                          │
│        { "id": "my-task", "name": "...", ... }               │
│      ]                                                        │
│    }                                                          │
└──────────────────┬────────────────────────────────────────────┘
                   ↓
┌───────────────────────────────────────────────────────────────┐
│ 10. DEPLOYMENT (MVP: Git, Future: S3)                         │
│     MVP:                          Future:                     │
│     git add public/recordings/    aws s3 sync recordings/     │
│     git commit                    → Triggers webhook          │
│     git push                      → Incremental updates       │
│     → Netlify auto-deploys        → No git bloat             │
└───────────────────────────────────────────────────────────────┘
```

### Automation Script (All-in-One)

```bash
#!/bin/bash
# scripts/update-landing-recordings.sh

set -e

echo "🎬 OpenAdapt Landing Page Recording Update"
echo "=========================================="

# Configuration
CAPTURE_DIR="/Users/abrichr/oa/src/openadapt-capture"
VIEWER_DIR="/Users/abrichr/oa/src/openadapt-viewer"
WEB_DIR="/Users/abrichr/oa/src/openadapt-web"
OUTPUT_DIR="$WEB_DIR/public/recordings"

# 1. Scan catalog
echo "📋 Scanning recording catalog..."
cd "$VIEWER_DIR"
uv run openadapt-viewer catalog scan

# 2. Get featured recordings (quality score > 80)
RECORDINGS=$(uv run openadapt-viewer catalog list --format json | \
             jq -r '.recordings[] | select(.quality_score > 80) | .name')

echo "Found $(echo "$RECORDINGS" | wc -l) recordings"

# 3. Process each recording
for RECORDING in $RECORDINGS; do
  echo "Processing: $RECORDING"

  REC_OUTPUT="$OUTPUT_DIR/$RECORDING"
  mkdir -p "$REC_OUTPUT/screenshots"

  # Generate screenshots
  echo "  → Generating screenshots..."
  uv run python scripts/generate_screenshots.py \
    --recording "$RECORDING" \
    --output "$REC_OUTPUT/screenshots"

  # Generate thumbnail (first screenshot)
  cp "$REC_OUTPUT/screenshots/001.jpg" "$REC_OUTPUT/thumbnail.jpg"

  # Generate preview video
  echo "  → Generating preview video..."
  VIDEO_PATH="$CAPTURE_DIR/$RECORDING/video.mp4"
  if [ -f "$VIDEO_PATH" ]; then
    ffmpeg -i "$VIDEO_PATH" -t 10 -vf scale=1280:720 \
           -c:v libx264 -crf 28 -preset fast \
           "$REC_OUTPUT/preview.mp4" -y &>/dev/null
  fi

  # Generate interactive viewer
  echo "  → Generating viewer..."
  uv run python scripts/generate_viewer.py \
    --recording "$RECORDING" \
    --output "$REC_OUTPUT/viewer.html"

  echo "  ✅ Complete"
done

# 4. Generate index.json
echo "📝 Generating index..."
cd "$WEB_DIR"
node scripts/generate-index.js

echo "🎉 Update complete!"
echo "Run: cd $WEB_DIR && npm run dev"
echo "Then visit: http://localhost:3000"
```

### GitHub Action (Weekly Auto-Update)

```yaml
# .github/workflows/update-recordings.yml
name: Update Landing Page Recordings

on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday at midnight
  workflow_dispatch:     # Manual trigger

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh

      - name: Install dependencies
        run: |
          npm ci
          cd ../openadapt-viewer && uv sync

      - name: Update recordings
        run: ./scripts/update-landing-recordings.sh

      - name: Commit and push
        run: |
          git config user.name "OpenAdapt Bot"
          git config user.email "bot@openadapt.ai"
          git add public/recordings/
          git commit -m "Update landing page recordings [automated]" || exit 0
          git push
```

---

## Storage Strategy

### Comparison Matrix

| Approach | Setup Time | Scalability | Cost (1000 recs) | Real-time | Git Bloat |
|----------|------------|-------------|------------------|-----------|-----------|
| **Git + LFS** | 1 hour | Low | Free | No | Medium |
| **GitHub Releases** | 2 hours | Medium | Free | No | None |
| **S3 Public** | 4 hours | High | ~$15/mo | Yes | None |
| **S3 + CloudFront** | 8 hours | Very High | ~$25/mo | Yes | None |
| **Supabase Storage** | 3 hours | High | Free tier | Yes | None |
| **Netlify LFS** | 1 hour | Medium | $19/mo | No | None |

### Recommended Path

#### Phase 1: MVP (Month 1)
**Use:** Git with selective files

```bash
# Only commit optimized assets
public/recordings/
├── index.json          # ✅ Commit (1KB)
├── turn-off-nightshift/
│   ├── metadata.json   # ✅ Commit (5KB)
│   ├── thumbnail.jpg   # ✅ Commit (100KB)
│   ├── preview.mp4     # ❌ Git LFS or .gitignore (500KB)
│   └── viewer.html     # ✅ Commit (50KB)
```

**Tradeoff:** Preview videos hosted on GitHub Releases instead.

```json
// index.json
{
  "preview_video": "https://github.com/OpenAdaptAI/OpenAdapt.web/releases/download/v1.0/turn-off-nightshift-preview.mp4"
}
```

#### Phase 2: S3 Migration (Month 2-3)
**Use:** S3 + CloudFront

```bash
# Upload to S3
aws s3 sync public/recordings/ s3://openadapt-recordings/ \
  --exclude "*.html" \
  --acl public-read

# Configure CloudFront distribution
DISTRIBUTION_ID="E1234567890ABC"
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/recordings/*"
```

**Benefits:**
- Unlimited storage
- CDN for global delivery
- No git bloat
- Incremental updates

### Git LFS Setup (If Needed)

```bash
# Install Git LFS
git lfs install

# Track video files
git lfs track "*.mp4"
git lfs track "*.mov"
git add .gitattributes

# Commit and push
git add .
git commit -m "Add LFS tracking for videos"
git push
```

---

## User Flow Design

### MVP User Flow (No Submissions)

```
User visits openadapt.ai
        ↓
┌───────────────────────────────────────┐
│ Landing Page                          │
│                                       │
│ [Auto-rotating Recording Showcase]   │
│  • Turn Off Night Shift (featured)   │
│  • Notepad Automation                 │
│  • Browser Navigation                 │
│                                       │
│ [See All Recordings →]                │
└───────────────────────────────────────┘
        ↓ Click recording
┌───────────────────────────────────────┐
│ Full Interactive Viewer               │
│                                       │
│ [Screenshot with overlays]            │
│ [◀ ▶ ⏸ Timeline controls]           │
│ [Event list with details]             │
│                                       │
│ Stats: 12 actions, 45s, macOS        │
└───────────────────────────────────────┘
        ↓ Scroll down
┌───────────────────────────────────────┐
│ Getting Started Section               │
│                                       │
│ $ uv tool install openadapt          │
│ $ openadapt capture start            │
│                                       │
│ [Install OpenAdapt →]                 │
└───────────────────────────────────────┘
```

### Future User Flow (With Submissions)

```
User creates recording locally
        ↓
┌───────────────────────────────────────┐
│ Terminal                              │
│                                       │
│ $ openadapt capture start --name task│
│ [Recording started]                   │
│ $ openadapt capture stop              │
│                                       │
│ Share this recording? (y/n): y       │
│ → Running PII scrubber...             │
│ → Uploading to OpenAdapt.ai...        │
│ → Recording published!                │
│                                       │
│ View at: openadapt.ai/r/abc123        │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ Recording Processing (Backend)        │
│                                       │
│ • Quality scoring → 92/100           │
│ • Thumbnail generation                │
│ • Episode segmentation                │
│ • Metadata extraction                 │
│                                       │
│ Decision: Featured = Yes              │
└───────────────────────────────────────┘
        ↓
┌───────────────────────────────────────┐
│ Landing Page (Updated)                │
│                                       │
│ 🌟 NEW: User's Task (featured)       │
│  • Turn Off Night Shift               │
│  • ...                                │
│                                       │
│ User gets notification email:         │
│ "Your recording is now featured!"    │
└───────────────────────────────────────┘
```

### Gallery Page (`/recordings`)

```
┌─────────────────────────────────────────────┐
│ OpenAdapt Recording Gallery                 │
├─────────────────────────────────────────────┤
│ [Search: ____________]  [Filter: All ▼]    │
├─────────────────────────────────────────────┤
│                                             │
│ Featured                                    │
│ ┌───────┐ ┌───────┐ ┌───────┐             │
│ │[thumb]│ │[thumb]│ │[thumb]│             │
│ │ Task1 │ │ Task2 │ │ Task3 │             │
│ │★★★★★ │ │★★★★☆ │ │★★★★★ │             │
│ └───────┘ └───────┘ └───────┘             │
│                                             │
│ Recent                                      │
│ ┌───────┐ ┌───────┐ ┌───────┐             │
│ │[thumb]│ │[thumb]│ │[thumb]│             │
│ │ Task4 │ │ Task5 │ │ Task6 │             │
│ │ 2d ago│ │ 5d ago│ │ 1w ago│             │
│ └───────┘ └───────┘ └───────┘             │
│                                             │
│ By Domain                                   │
│ [Office] [Browser] [System] [Creative]     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Technical Implementation

### New Files to Create

```
openadapt-web/
├── components/
│   ├── RecordingShowcase.js        # Main showcase component
│   ├── RecordingCard.js            # Individual recording card
│   └── RecordingShowcase.module.css
├── pages/
│   └── recordings/
│       ├── index.js                # Gallery page
│       └── [id].js                 # Individual recording page
├── scripts/
│   ├── generate-recordings.js      # Asset generation
│   ├── generate-index.js           # Index generation
│   └── update-landing-recordings.sh
├── public/
│   └── recordings/
│       └── index.json              # Master index (generated)
└── utils/
    └── recordingUtils.js           # Helper functions
```

### Component: RecordingShowcase

See earlier section for full implementation. Key features:

- Fetches `recordings/index.json` on mount
- Auto-rotates through featured recordings
- Video preview with poster image
- Metadata display (duration, actions, platform)
- Click-through to full viewer

### Component: RecordingCard

```javascript
// components/RecordingCard.js
import Image from 'next/image'
import Link from 'next/link'

export default function RecordingCard({ recording }) {
  return (
    <Link href={recording.viewer_url} className="recording-card">
      <div className="card-thumbnail">
        <Image
          src={recording.thumbnail}
          width={320}
          height={180}
          alt={recording.name}
        />
        <div className="card-overlay">
          <span className="card-duration">{recording.duration_seconds}s</span>
        </div>
      </div>
      <div className="card-content">
        <h4>{recording.name}</h4>
        <p className="card-description">{recording.description}</p>
        <div className="card-meta">
          <span>{recording.action_count} actions</span>
          <span>{recording.platform}</span>
        </div>
        {recording.tags && (
          <div className="card-tags">
            {recording.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
```

### Page: /recordings (Gallery)

```javascript
// pages/recordings/index.js
import { useState, useEffect } from 'react'
import RecordingCard from '@components/RecordingCard'

export default function RecordingsGallery() {
  const [recordings, setRecordings] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/recordings/index.json')
      .then(res => res.json())
      .then(data => setRecordings(data.recordings))
  }, [])

  const filtered = recordings.filter(rec => {
    if (filter !== 'all' && rec.domain !== filter) return false
    if (search && !rec.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  const featured = filtered.filter(r => r.featured)
  const recent = filtered.filter(r => !r.featured).slice(0, 6)

  return (
    <div className="recordings-gallery">
      <header>
        <h1>OpenAdapt Recording Gallery</h1>
        <p>Explore real automation workflows</p>
      </header>

      <div className="filters">
        <input
          type="text"
          placeholder="Search recordings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Domains</option>
          <option value="system">System</option>
          <option value="browser">Browser</option>
          <option value="office">Office</option>
          <option value="creative">Creative</option>
        </select>
      </div>

      {featured.length > 0 && (
        <section>
          <h2>Featured</h2>
          <div className="recordings-grid">
            {featured.map(rec => (
              <RecordingCard key={rec.id} recording={rec} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section>
          <h2>Recent</h2>
          <div className="recordings-grid">
            {recent.map(rec => (
              <RecordingCard key={rec.id} recording={rec} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No recordings found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
```

### Styling (Tailwind + Custom CSS)

```css
/* components/RecordingShowcase.module.css */

.showcaseHeader {
  @apply text-center mb-8;
}

.showcaseMain {
  @apply relative max-w-4xl mx-auto bg-gray-900 rounded-lg overflow-hidden;
}

.showcaseVideo {
  @apply w-full aspect-video object-cover;
}

.showcaseInfo {
  @apply absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white;
}

.showcaseInfo h3 {
  @apply text-2xl font-bold mb-2;
}

.showcaseMeta {
  @apply flex gap-4 text-sm opacity-80;
}

.showcaseCarousel {
  @apply flex gap-4 mt-6 overflow-x-auto;
}

.showcaseCarousel button {
  @apply flex-shrink-0 w-48 text-left opacity-60 hover:opacity-100 transition;
}

.showcaseCarousel button.active {
  @apply opacity-100 ring-2 ring-blue-500;
}

.recordingCard {
  @apply block bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition;
}

.cardThumbnail {
  @apply relative aspect-video;
}

.cardOverlay {
  @apply absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs;
}

.cardContent {
  @apply p-4;
}

.cardMeta {
  @apply flex gap-3 text-sm text-gray-400 mt-2;
}

.cardTags {
  @apply flex gap-2 mt-3;
}

.tag {
  @apply bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs;
}
```

---

## Migration Path (MVP → Scale)

### Phase 1: MVP (Week 1-2)

**Goals:**
- ✅ Prove concept with 2-3 recordings
- ✅ Replace static video masthead
- ✅ Local generation → git → deploy

**Tasks:**
1. Create `RecordingShowcase` component
2. Write generation script (`generate-recordings.js`)
3. Generate assets for existing recordings
4. Update `pages/index.js` to use new component
5. Deploy to staging
6. Test and iterate
7. Deploy to production

**Deliverables:**
- Working showcase with auto-rotation
- Documentation for adding new recordings

### Phase 2: Automation (Week 3-4)

**Goals:**
- ✅ Weekly automatic updates
- ✅ Improved asset optimization
- ✅ Gallery page

**Tasks:**
1. Create GitHub Action for weekly updates
2. Add `/recordings` gallery page
3. Implement search and filters
4. Optimize image compression
5. Add video loading optimization (lazy load)

**Deliverables:**
- Automated weekly refresh
- Full recording gallery

### Phase 3: S3 Migration (Month 2)

**Goals:**
- ✅ Remove assets from git
- ✅ S3 + CloudFront CDN
- ✅ API for recording metadata

**Tasks:**
1. Set up S3 bucket with public access
2. Configure CloudFront distribution
3. Update generation script to upload to S3
4. Create simple API endpoint (`/api/recordings`)
5. Update components to fetch from API
6. Migrate existing assets to S3
7. Remove large files from git history

**Deliverables:**
- Cloud-hosted recordings
- No git bloat
- Faster page loads (CDN)

### Phase 4: User Submissions (Month 3-6)

**Goals:**
- ✅ Allow users to share recordings
- ✅ Quality scoring and moderation
- ✅ User profiles

**Tasks:**
1. Add authentication (e.g., Supabase Auth)
2. Create upload CLI command
3. Implement PII scrubbing pre-upload
4. Build moderation queue
5. Add quality scoring algorithm
6. Create user profile pages
7. Add social features (likes, comments)

**Deliverables:**
- Full community platform
- User-generated content
- Moderation tools

---

## Success Metrics

### MVP Metrics (Month 1)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Recording Showcase Views | 1000/week | Google Analytics custom event |
| Click-through to Full Viewer | 5% | Click tracking on "View Full" |
| Bounce Rate (landing page) | <40% | Google Analytics |
| Time on Page | >90s | Google Analytics |
| Install Conversions | 50/week | Track `uv tool install openadapt` |

### Growth Metrics (Month 2-6)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Total Public Recordings | 100 | Database count |
| Active Contributors | 20 | Users who shared ≥1 recording |
| Gallery Page Views | 5000/month | Analytics |
| Recording Shares (social) | 200/month | Share button clicks |
| Average Quality Score | >80 | Mean of all recordings |

### Engagement Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Repeat Visitors | 30% | Google Analytics |
| Recording Completion Rate | 60% | Video analytics |
| Search Usage | 40% | Search query tracking |
| Filter Usage | 50% | Filter interaction tracking |
| Mobile vs Desktop | 20% mobile | Device detection |

---

## Cost/Effort Analysis

### MVP Implementation Cost

| Task | Effort (hours) | Developer | Priority |
|------|----------------|-----------|----------|
| RecordingShowcase component | 4 | Frontend | P0 |
| Generation script | 6 | Full-stack | P0 |
| Asset optimization | 2 | DevOps | P1 |
| Landing page integration | 2 | Frontend | P0 |
| Testing & QA | 4 | QA | P0 |
| Documentation | 2 | Tech Writer | P1 |
| **Total** | **20 hours** | | |

**Estimated Timeline:** 1 week (part-time) or 2-3 days (full-time)

### Phase 2 (Automation) Cost

| Task | Effort (hours) | Developer | Priority |
|------|----------------|-----------|----------|
| GitHub Action setup | 3 | DevOps | P0 |
| Gallery page | 8 | Frontend | P1 |
| Search & filters | 4 | Frontend | P1 |
| Video optimization | 3 | DevOps | P2 |
| **Total** | **18 hours** | | |

**Estimated Timeline:** 1 week

### Phase 3 (S3 Migration) Cost

| Task | Effort (hours) | Cost (one-time) | Monthly Cost |
|------|----------------|-----------------|--------------|
| S3 setup | 2 | - | $0.25 (storage) |
| CloudFront setup | 3 | - | $8.50 (CDN) |
| API development | 8 | - | $5 (Lambda) |
| Migration script | 4 | - | - |
| Git cleanup | 2 | - | - |
| **Total** | **19 hours** | **-** | **~$14/month** |

**Estimated Timeline:** 1-2 weeks

### Phase 4 (User Submissions) Cost

| Task | Effort (hours) | Monthly Cost |
|------|----------------|--------------|
| Authentication | 8 | $0 (Supabase free) |
| Upload CLI | 6 | - |
| PII scrubbing | 8 | - |
| Moderation queue | 12 | - |
| Quality scoring | 6 | - |
| User profiles | 10 | - |
| **Total** | **50 hours** | **~$25/month** |

**Estimated Timeline:** 4-6 weeks

### Total Investment

| Phase | Development | Infrastructure | Timeline |
|-------|-------------|----------------|----------|
| MVP | 20 hours | $0 | 1 week |
| Automation | 18 hours | $0 | 1 week |
| S3 Migration | 19 hours | $14/mo | 2 weeks |
| User Submissions | 50 hours | $25/mo | 6 weeks |
| **Total** | **107 hours** | **$25/mo** | **10 weeks** |

---

## Implementation Roadmap

### Week 1-2: MVP

**Day 1-2: Component Development**
- [ ] Create `RecordingShowcase.js` component
- [ ] Create `RecordingCard.js` component
- [ ] Add CSS styling (Tailwind + custom)
- [ ] Test on localhost

**Day 3-4: Asset Generation**
- [ ] Write `generate-recordings.js` script
- [ ] Generate assets for `turn-off-nightshift`
- [ ] Generate assets for `demo_new`
- [ ] Create `index.json`

**Day 5-6: Integration**
- [ ] Update `pages/index.js` to use `RecordingShowcase`
- [ ] Remove old static video code
- [ ] Test all functionality
- [ ] Optimize performance

**Day 7: Deploy**
- [ ] Create feature branch
- [ ] Open PR
- [ ] Deploy to Netlify preview
- [ ] QA testing
- [ ] Merge to main
- [ ] Verify production

### Week 3-4: Automation

**Day 1-2: GitHub Action**
- [ ] Create `.github/workflows/update-recordings.yml`
- [ ] Test workflow manually
- [ ] Schedule weekly runs

**Day 3-5: Gallery Page**
- [ ] Create `pages/recordings/index.js`
- [ ] Implement search functionality
- [ ] Implement domain filters
- [ ] Add responsive design

**Day 6-7: Optimization**
- [ ] Image compression (WebP)
- [ ] Lazy loading
- [ ] Video streaming optimization

### Month 2: S3 Migration

**Week 1: S3 Setup**
- [ ] Create S3 bucket
- [ ] Configure CORS
- [ ] Set up CloudFront distribution
- [ ] Test CDN performance

**Week 2: API Development**
- [ ] Create `/api/recordings` endpoint
- [ ] Implement caching (Redis or CDN)
- [ ] Update frontend to use API
- [ ] Test API performance

**Week 3: Migration**
- [ ] Update generation script for S3 upload
- [ ] Migrate existing assets
- [ ] Remove assets from git
- [ ] Clean git history (BFG Repo-Cleaner)

**Week 4: Testing & Polish**
- [ ] Full QA testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Deploy to production

### Month 3-6: User Submissions

**Month 3: Upload & Auth**
- [ ] Add Supabase authentication
- [ ] Create upload CLI command
- [ ] Implement PII scrubbing
- [ ] Test upload flow

**Month 4: Moderation**
- [ ] Build moderation dashboard
- [ ] Implement quality scoring
- [ ] Add reporting features
- [ ] Test moderation workflow

**Month 5: Social Features**
- [ ] User profile pages
- [ ] Likes and comments
- [ ] Recording stats
- [ ] Social sharing

**Month 6: Launch**
- [ ] Beta testing with select users
- [ ] Fix bugs and iterate
- [ ] Marketing launch
- [ ] Monitor and scale

---

## Appendix

### A. Example Recording Metadata

```json
{
  "id": "turn-off-nightshift",
  "name": "Turn Off Night Shift",
  "description": "Demonstrates navigating macOS System Preferences to disable the Night Shift feature",
  "task_description": "Turn off Night Shift on macOS",
  "domain": "system",
  "platform": "macOS",
  "os_version": "14.2",
  "screen_resolution": "2880x1800",
  "duration_seconds": 45.3,
  "action_count": 12,
  "event_count": 156,
  "created_at": "2026-01-15T14:30:00Z",
  "updated_at": "2026-01-15T14:30:45Z",
  "featured": true,
  "quality_score": 95,
  "has_audio": true,
  "has_transcript": true,
  "pii_scrubbed": true,
  "tags": ["system", "preferences", "display", "macos", "nightshift"],
  "actions": [
    {
      "type": "click",
      "timestamp": 2.1,
      "x": 450,
      "y": 320,
      "target": "System Preferences icon"
    },
    {
      "type": "click",
      "timestamp": 5.8,
      "x": 640,
      "y": 480,
      "target": "Displays button"
    }
  ],
  "episodes": [
    {
      "id": "ep-001",
      "name": "Open System Preferences",
      "start_index": 0,
      "end_index": 3,
      "duration_seconds": 5.8
    },
    {
      "id": "ep-002",
      "name": "Navigate to Displays",
      "start_index": 4,
      "end_index": 7,
      "duration_seconds": 12.5
    },
    {
      "id": "ep-003",
      "name": "Disable Night Shift",
      "start_index": 8,
      "end_index": 11,
      "duration_seconds": 27.0
    }
  ],
  "file_paths": {
    "video": "video.mp4",
    "audio": "audio.flac",
    "database": "capture.db",
    "transcript": "transcript.json"
  },
  "statistics": {
    "clicks": 8,
    "double_clicks": 0,
    "drags": 0,
    "scrolls": 2,
    "keypresses": 0,
    "types": 0
  }
}
```

### B. Quality Scoring Algorithm

```python
def calculate_quality_score(recording):
    """
    Calculate recording quality score (0-100).
    Higher score = better quality for showcasing.
    """
    score = 0

    # 1. Episode Coherence (0-30 points)
    # Well-segmented recordings are easier to understand
    episode_count = len(recording.episodes)
    if episode_count >= 3:
        score += 30
    elif episode_count >= 2:
        score += 20
    elif episode_count >= 1:
        score += 10

    # 2. Visual Clarity (0-25 points)
    # Check screenshot quality metrics
    avg_contrast = sum(img.contrast_score for img in recording.screenshots) / len(recording.screenshots)
    avg_sharpness = sum(img.sharpness_score for img in recording.screenshots) / len(recording.screenshots)
    visual_score = (avg_contrast + avg_sharpness) / 2 * 25
    score += visual_score

    # 3. Task Diversity (0-20 points)
    # More action types = more interesting
    action_types = set(action.type for action in recording.actions)
    diversity = len(action_types) / 6  # 6 = max action types
    score += diversity * 20

    # 4. Optimal Duration (0-15 points)
    # Not too short, not too long
    duration = recording.duration_seconds
    if 30 <= duration <= 120:  # 30s - 2min is ideal
        score += 15
    elif 15 <= duration <= 180:  # 15s - 3min is okay
        score += 10
    else:
        score += 5

    # 5. Completeness (0-10 points)
    # Has audio, transcript, PII scrubbed
    if recording.has_audio:
        score += 3
    if recording.has_transcript:
        score += 3
    if recording.pii_scrubbed:
        score += 4

    return min(score, 100)
```

### C. PII Scrubbing Checklist

Before uploading any recording publicly:

- [ ] Run OCR on all screenshots
- [ ] Detect and blur: emails, phone numbers, SSNs, credit cards
- [ ] Redact usernames and passwords
- [ ] Remove audio if contains sensitive speech
- [ ] Check URLs for tokens/API keys
- [ ] Review transcript for PII mentions
- [ ] Blur faces in screenshots (optional)
- [ ] Redact financial information
- [ ] Remove internal IP addresses
- [ ] Clear browser history/cookies visible in screenshots

### D. References

**Existing Documentation:**
- `/Users/abrichr/oa/src/openadapt-viewer/README.md` - Viewer system
- `/Users/abrichr/oa/src/openadapt-viewer/CATALOG_SYSTEM.md` - Recording catalog
- `/Users/abrichr/oa/src/openadapt-capture/README.md` - Capture system

**External Resources:**
- Next.js Image Optimization: https://nextjs.org/docs/pages/api-reference/components/image
- Netlify Large Media: https://docs.netlify.com/large-media/overview/
- AWS S3 Static Hosting: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html

---

## Conclusion

This design provides a clear path from MVP to scale for the next-generation OpenAdapt landing page. The key insight is to **start simple** (local generation, git deployment) and **evolve incrementally** (S3, user submissions, community features).

**Immediate Next Steps:**
1. Review this document with team
2. Prioritize MVP features
3. Create GitHub issues for Phase 1 tasks
4. Assign developer to Week 1-2 MVP implementation
5. Set target launch date

**Expected Impact:**
- More engaging landing page (dynamic vs static)
- Showcase real functionality automatically
- Reduce maintenance burden (auto-updates)
- Build community momentum (user submissions)
- Demonstrate OpenAdapt capabilities visually

**Risk Mitigation:**
- Start with MVP to validate concept
- Incremental rollout reduces deployment risk
- Git-based MVP allows easy rollback
- Quality scoring prevents low-quality content

This design balances **ambition** (futuristic auto-generated showcase) with **pragmatism** (implementable MVP in 1 week). The migration path ensures we can start small and scale as the community grows.
