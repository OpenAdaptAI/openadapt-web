# Social Media Feeds - Quick Start Guide

## What Was Added

A new "Join the Community" section on the landing page showing:
- **GitHub Activity**: Live repository statistics (stars, forks, watchers, issues)
- **Reddit Discussions**: Latest Reddit posts mentioning OpenAdapt
- **Hacker News**: Latest HN stories about OpenAdapt
- **Twitter/X Feed**: Official @OpenAdaptAI timeline
- **Call-to-Action**: Links to Discord and GitHub

## Files Created

### Components (10 files)
```
/components/GitHubActivity.js
/components/GitHubActivity.module.css
/components/RedditFeed.js
/components/RedditFeed.module.css
/components/HackerNewsFeed.js
/components/HackerNewsFeed.module.css
/components/TwitterFeed.js
/components/TwitterFeed.module.css
/components/SocialSection.js
/components/SocialSection.module.css
```

### API Route (1 file)
```
/pages/api/social-feeds.js
```

### Modified Files (1 file)
```
/pages/index.js (added SocialSection import and component)
```

### Documentation (3 files)
```
SOCIAL_FEEDS_IMPLEMENTATION.md (comprehensive docs)
SOCIAL_FEEDS_PREVIEW.md (visual design preview)
SOCIAL_FEEDS_QUICKSTART.md (this file)
```

**Total: 15 files**

## Installation & Testing

### Step 1: Install Dependencies

```bash
cd /Users/abrichr/oa/src/openadapt-web
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

### Step 3: View in Browser

Open: http://localhost:3000

### Step 4: Navigate to Social Section

Scroll down the page or navigate directly to: http://localhost:3000#community

### Step 5: Test Features

**GitHub Activity:**
- [ ] Stats load (stars, forks, watchers, issues)
- [ ] Click card - opens GitHub repo in new tab
- [ ] Hover effect works (card lifts up slightly)

**Reddit Feed:**
- [ ] Posts load (if any exist)
- [ ] Click post - opens Reddit in new tab
- [ ] "View More on Reddit" button works
- [ ] Fallback message if no posts

**Hacker News:**
- [ ] Stories load (if any exist)
- [ ] Click story - opens HN in new tab
- [ ] "View More on Hacker News" button works
- [ ] Fallback message if no stories

**Twitter Feed:**
- [ ] Timeline loads (may take a few seconds)
- [ ] Shows latest tweets from @OpenAdaptAI
- [ ] "Follow @OpenAdaptAI" button works

**Call-to-Action:**
- [ ] Discord button opens Discord invite
- [ ] GitHub button opens repository

### Step 6: Test Responsive Design

**Desktop (> 1024px):**
- [ ] Three cards side-by-side
- [ ] Twitter full-width below
- [ ] CTA buttons side-by-side

**Tablet (768px - 1024px):**
- [ ] Cards stack vertically
- [ ] Twitter full-width
- [ ] CTA buttons side-by-side

**Mobile (< 768px):**
- [ ] All components stack vertically
- [ ] Twitter timeline adjusts height
- [ ] CTA buttons stack vertically

### Step 7: Test API Caching

Open browser DevTools → Network tab:

**First Load:**
```
1. Request to GitHub API - 200 OK
2. Request to Reddit API - 200 OK
3. Request to HN API - 200 OK
```

**Reload within 5 minutes:**
```
Same requests but should be faster (served from cache)
```

**Direct API Test:**
```bash
curl http://localhost:3000/api/social-feeds | jq
```

Should return JSON with all social data.

## Deployment to Production

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### Option 2: Netlify

```bash
# Build
npm run build

# Deploy manually via Netlify dashboard
# Or use Netlify CLI
netlify deploy --prod
```

### Option 3: Traditional Hosting

```bash
# Build static export
npm run build
npm run export

# Upload the 'out' directory to your hosting
```

## Production Checklist

- [ ] npm run build completes successfully
- [ ] No console errors in production build
- [ ] All API routes work on production domain
- [ ] Twitter widget loads on production domain
- [ ] Caching headers are set correctly
- [ ] All external links work
- [ ] Mobile responsive design works
- [ ] Performance is good (< 2s page load)

## Monitoring

### Check API Health

Test each API endpoint:

```bash
# GitHub
curl https://api.github.com/repos/OpenAdaptAI/OpenAdapt

# Reddit
curl "https://www.reddit.com/search.json?q=openadapt"

# Hacker News
curl "https://hn.algolia.com/api/v1/search?query=openadapt"
```

### Monitor Rate Limits

GitHub API limits:
- Unauthenticated: 60 requests/hour
- Authenticated: 5000 requests/hour

Check your remaining quota:
```bash
curl -I https://api.github.com/repos/OpenAdaptAI/OpenAdapt | grep rate
```

## Common Issues & Fixes

### Issue: "npm install" fails with puppeteer error

**Solution:**
```bash
npm install --no-optional --legacy-peer-deps
```

### Issue: GitHub rate limit exceeded

**Solution:**
Add GitHub token to environment variables:

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token
```

Then update components to use it (optional).

### Issue: Twitter timeline not loading

**Possible causes:**
1. Script blocked by ad blocker
2. @OpenAdaptAI account doesn't exist or is private
3. Twitter API/widget is down

**Solution:**
- Check browser console for errors
- Disable ad blockers
- Verify Twitter account exists

### Issue: No Reddit/HN posts found

**This is normal** if OpenAdapt hasn't been mentioned yet.

**Solution:**
The fallback UI will show "No posts found" with search links.

### Issue: Components not found error

**Solution:**
Check that jsconfig.json has the @ alias:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["components/*"]
    }
  }
}
```

## Performance Tips

1. **Enable Caching**: The API route caches for 5 minutes by default
2. **CDN**: Use Vercel/Netlify CDN for fast global delivery
3. **Image Optimization**: Twitter widget loads images lazily
4. **Code Splitting**: Next.js automatically splits code
5. **Compression**: Enable gzip/brotli on your hosting

## Analytics (Optional)

Track social section engagement:

```javascript
// Add to components
onClick={() => {
  window.gtag('event', 'social_click', {
    social_platform: 'github',
    action: 'view_repo'
  })
}}
```

## Support

For issues or questions:
1. Check the full documentation: `SOCIAL_FEEDS_IMPLEMENTATION.md`
2. Review the visual preview: `SOCIAL_FEEDS_PREVIEW.md`
3. Submit a GitHub issue
4. Contact the team on Discord

## Next Steps (Optional Enhancements)

Once the basic implementation is working, consider:

1. **Add LinkedIn** - Embed company page widget
2. **Add YouTube** - Show latest videos about OpenAdapt
3. **Add Discord Widget** - Show online member count
4. **Historical Charts** - Graph GitHub stars over time
5. **Sentiment Analysis** - Analyze social mentions
6. **Real-time Updates** - WebSocket for live feeds

## Summary

You now have a complete social media section that:
- ✅ Shows real-time GitHub statistics
- ✅ Displays Reddit discussions
- ✅ Shows Hacker News stories
- ✅ Embeds Twitter timeline
- ✅ Uses free APIs only
- ✅ Has server-side caching
- ✅ Is fully responsive
- ✅ Handles errors gracefully
- ✅ Follows 80/20 principle

**Time to implement**: ~2 hours
**Ongoing cost**: $0/month
**Maintenance**: Minimal

Enjoy the new social proof on your landing page!

---

**Questions?** See `SOCIAL_FEEDS_IMPLEMENTATION.md` for detailed documentation.
