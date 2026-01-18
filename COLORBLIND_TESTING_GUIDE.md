# Colorblind Accessibility Testing Guide

## Quick Start

This guide helps you test the PyPI download charts for colorblind accessibility.

## Chrome DevTools Testing (Recommended)

### Step 1: Open the Page
1. Navigate to https://deploy-preview-123--cosmic-klepon-3c693c.netlify.app/
2. Wait for the "PyPI Download Trends" chart to load
3. Click the "By Package" button to switch to the multi-line chart

### Step 2: Open Rendering Tools
1. Press `F12` to open Chrome DevTools
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
3. Type "Show Rendering" and press Enter
4. Scroll down to "Emulate vision deficiencies"

### Step 3: Test Each Vision Deficiency

#### Test 1: Protanopia (Red-Blind) - 1% of males
1. Select "Protanopia" from the dropdown
2. Verify you can distinguish all package lines
3. Check that line patterns are clearly visible
4. Hover over lines to verify highlighting works

#### Test 2: Deuteranopia (Green-Blind) - 1% of males
1. Select "Deuteranopia" from the dropdown
2. Verify all lines are distinguishable
3. Check colors don't appear identical
4. Test legend clicking to toggle packages

#### Test 3: Tritanopia (Blue-Blind) - 0.001% of people
1. Select "Tritanopia" from the dropdown
2. Verify line differentiation is maintained
3. Check tooltip readability

#### Test 4: Achromatopsia (Total Colorblind) - 0.003% of people
1. Select "Achromatopsia" from the dropdown
2. **Critical Test**: Without any color, can you still distinguish lines?
3. Verify line patterns (solid, dashed, dotted) are clearly different
4. Check that tooltips show package names clearly

### Step 4: Interactive Testing

With vision deficiency emulation still active:

1. **Hover Test**:
   - Hover over each line
   - Verify other lines fade out (become dimmer)
   - Verify you can identify which line you're hovering over

2. **Legend Test**:
   - Click each package name in the legend
   - Verify the line disappears/reappears
   - Verify you can isolate specific packages

3. **Tooltip Test**:
   - Hover over various data points
   - Verify package name is clearly shown
   - Check that total downloads are displayed
   - Confirm tooltips are readable in all vision modes

## Firefox Testing

### Step 1: Open Accessibility Tools
1. Navigate to the chart page
2. Press `F12` to open Developer Tools
3. Click the "Accessibility" tab
4. Click "Simulate" dropdown

### Step 2: Test Vision Deficiencies
1. Select each vision deficiency type
2. Verify line distinguishability
3. Test interactivity (hover, legend clicks)

## Safari Testing (Mac Only)

Safari doesn't have built-in colorblind simulation, but you can:
1. Test the interactive features (hover, legend clicks)
2. Verify line patterns are visible
3. Check tooltip functionality

For color testing, use Chrome or Firefox.

## What to Look For

### ✅ Pass Criteria

The chart is accessible if you can answer "Yes" to all these questions:

1. **Line Distinction**: Can you identify at least 3-4 different lines without color?
2. **Pattern Clarity**: Are the dash patterns (solid, dashed, dotted) clearly visible?
3. **Hover Feedback**: When hovering, does the active line stand out clearly?
4. **Legend Clarity**: Can you match legend entries to chart lines?
5. **Tooltip Utility**: Do tooltips help identify which package you're examining?
6. **Toggle Function**: Can you successfully show/hide packages via legend clicks?

### ❌ Fail Criteria

The chart has accessibility issues if:

1. All lines appear identical or nearly identical
2. You cannot tell which line is which without color
3. Hover highlighting doesn't work or is too subtle
4. Legend doesn't help identify lines
5. Tooltips don't clearly show package names
6. You need to guess which line represents which package

## Line Pattern Reference

Use this guide to identify packages by pattern:

| Visual Pattern | Package Name |
|----------------|--------------|
| ━━━━━━━━━━━━ (Solid, thick) | openadapt |
| ━ ━ ━ ━ ━ ━ (Dashed) | openadapt-ml |
| ······ (Dotted) | openadapt-capture |
| ━·━·━·━· (Dash-dot) | openadapt-evals |
| ━━ ━━ ━━ (Long dash) | openadapt-viewer |
| ━··━··━·· (Dash-dot-dot) | openadapt-grounding |
| ━·━·━·━ (Mixed) | openadapt-retrieval |
| ━━ ━━ ━━ (Medium dash) | openadapt-privacy |

## Color Palette Reference

The Tol Bright colors used (for reference):

| Package | Color | Hex Code | Notes |
|---------|-------|----------|-------|
| openadapt | Blue | #4477AA | Primary package |
| openadapt-ml | Red | #EE6677 | Not problematic with green |
| openadapt-capture | Green | #228833 | Safe green shade |
| openadapt-evals | Yellow | #CCBB44 | High contrast |
| openadapt-viewer | Cyan | #66CCEE | Distinct from blue |
| openadapt-grounding | Purple | #AA3377 | Unique hue |
| openadapt-retrieval | Orange | #EE7733 | Warm accent |
| openadapt-privacy | Grey | #BBBBBB | Neutral |

## Reporting Issues

If you find accessibility issues:

1. **Screenshot**: Take a screenshot showing the problem
2. **Vision Mode**: Note which vision deficiency mode revealed the issue
3. **Browser**: Specify browser and version
4. **Description**: Describe what's unclear or indistinguishable
5. **Impact**: Rate severity (Critical/High/Medium/Low)

### Example Issue Report

```
Issue: Lines appear identical in Achromatopsia mode
Vision Mode: Achromatopsia (no color)
Browser: Chrome 120.0
Description: openadapt-ml and openadapt-capture lines look the same
Severity: High
Screenshot: [attached]
```

## Success Criteria Summary

The chart meets accessibility standards if:

✅ All 8 packages are distinguishable in Achromatopsia mode (no color)
✅ Hover highlighting clearly indicates the active line
✅ Legend click-to-toggle works smoothly
✅ Tooltips show package names prominently
✅ Line patterns are visible and distinct
✅ No reliance on color alone for information

## Additional Resources

- [WCAG 2.1 Use of Color Guideline](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [Tol Bright Color Scheme Research](https://personal.sron.nl/~paultol/data/colourschemes.pdf)
- [Colorblind Accessibility Best Practices](https://www.w3.org/WAI/perspective-videos/contrast/)
- [Chart.js Accessibility Documentation](https://www.chartjs.org/docs/latest/general/accessibility.html)

## Quick Test Commands

For developers, here's how to test locally:

```bash
# Start dev server
cd /Users/abrichr/oa/src/openadapt-web
npm run dev

# Open in browser
open http://localhost:3000

# Then use Chrome DevTools as described above
```

## Automated Testing (Future)

Consider adding automated accessibility tests:

```javascript
// Example using jest-axe
import { axe } from 'jest-axe';
import { render } from '@testing-library/react';
import PyPIDownloadChart from './PyPIDownloadChart';

test('chart should not have accessibility violations', async () => {
  const { container } = render(<PyPIDownloadChart />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Contact

If you have questions about these accessibility improvements, contact the development team or file an issue on GitHub.
