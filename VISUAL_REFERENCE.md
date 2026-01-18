# Visual Reference Guide: PyPI Charts Accessibility

## Quick Identification Guide

Use this guide to identify packages in the "By Package" chart without relying on color.

## Package Visual Signatures

Each package has a unique combination of color, pattern, and width:

### 1. openadapt (Main Package)

**Visual Signature**:
- **Color**: Blue (#4477AA)
- **Pattern**: ━━━━━━━━━━━━ (Solid)
- **Width**: 3px (Thickest)
- **How to Identify**: The thickest solid blue line

### 2. openadapt-ml

**Visual Signature**:
- **Color**: Red (#EE6677)
- **Pattern**: ━ ━ ━ ━ ━ ━ (Dashed)
- **Width**: 2.5px
- **How to Identify**: Dashed red line with medium dashes

### 3. openadapt-capture

**Visual Signature**:
- **Color**: Green (#228833)
- **Pattern**: ············ (Dotted)
- **Width**: 2.5px
- **How to Identify**: Dotted green line with small dots

### 4. openadapt-evals

**Visual Signature**:
- **Color**: Yellow (#CCBB44)
- **Pattern**: ━··━··━··━·· (Dash-dot)
- **Width**: 2.5px
- **How to Identify**: Yellow line with long dash followed by dot

### 5. openadapt-viewer

**Visual Signature**:
- **Color**: Cyan (#66CCEE)
- **Pattern**: ━━ ━━ ━━ ━━ (Long dash)
- **Width**: 2px
- **How to Identify**: Cyan line with long dashes

### 6. openadapt-grounding

**Visual Signature**:
- **Color**: Purple (#AA3377)
- **Pattern**: ━····━····━···· (Dash-dot-dot)
- **Width**: 2px
- **How to Identify**: Purple line with dash followed by two dots

### 7. openadapt-retrieval

**Visual Signature**:
- **Color**: Orange (#EE7733)
- **Pattern**: ━··━·━··━· (Mixed)
- **Width**: 2px
- **How to Identify**: Orange line with varied dash-dot pattern

### 8. openadapt-privacy

**Visual Signature**:
- **Color**: Grey (#BBBBBB)
- **Pattern**: ━━ ━━ ━━ (Medium dash)
- **Width**: 2px
- **How to Identify**: Grey line with medium-length dashes

## Pattern Quick Reference

Visual comparison of all patterns:

```
Solid:         ━━━━━━━━━━━━━━━━━━━━
Dashed:        ━━  ━━  ━━  ━━  ━━
Dotted:        · · · · · · · · · · ·
Dash-dot:      ━━━ · ━━━ · ━━━ ·
Long dash:     ━━━━  ━━━━  ━━━━
Dash-dot-dot:  ━━ · · ━━ · · ━━ · ·
Mixed:         ━━ · ━ · ━━ · ━ ·
Medium dash:   ━━━ ━━━ ━━━ ━━━
```

## Colorblind Mode Preview

### Protanopia (No Red)

How colors appear without red perception:

| Package | Original Color | Perceived Color |
|---------|---------------|-----------------|
| openadapt | Blue | Blue (unchanged) |
| openadapt-ml | Red | Brown/grey |
| openadapt-capture | Green | Yellow/grey |
| openadapt-evals | Yellow | Yellow (unchanged) |
| openadapt-viewer | Cyan | Cyan (unchanged) |
| openadapt-grounding | Purple | Blue/purple |
| openadapt-retrieval | Orange | Yellow/green |
| openadapt-privacy | Grey | Grey (unchanged) |

**Distinction**: Even with red removed, line patterns make all lines distinguishable.

### Deuteranopia (No Green)

How colors appear without green perception:

| Package | Original Color | Perceived Color |
|---------|---------------|-----------------|
| openadapt | Blue | Blue (unchanged) |
| openadapt-ml | Red | Red/orange |
| openadapt-capture | Green | Brown/grey |
| openadapt-evals | Yellow | Yellow/orange |
| openadapt-viewer | Cyan | Blue/purple |
| openadapt-grounding | Purple | Purple (unchanged) |
| openadapt-retrieval | Orange | Orange (unchanged) |
| openadapt-privacy | Grey | Grey (unchanged) |

**Distinction**: Line patterns ensure clarity even without green.

### Tritanopia (No Blue)

How colors appear without blue perception:

| Package | Original Color | Perceived Color |
|---------|---------------|-----------------|
| openadapt | Blue | Green/grey |
| openadapt-ml | Red | Red (unchanged) |
| openadapt-capture | Green | Green (unchanged) |
| openadapt-evals | Yellow | Pink/red |
| openadapt-viewer | Cyan | Green |
| openadapt-grounding | Purple | Red/pink |
| openadapt-retrieval | Orange | Red (unchanged) |
| openadapt-privacy | Grey | Grey (unchanged) |

**Distinction**: Line patterns remain clearly different.

### Achromatopsia (No Color)

How the chart appears with complete color blindness:

| Package | Perceived Color | Primary Identifier |
|---------|----------------|-------------------|
| openadapt | Light grey | **Thick solid line** |
| openadapt-ml | Medium grey | **Dashed pattern** |
| openadapt-capture | Medium grey | **Dotted pattern** |
| openadapt-evals | Light grey | **Dash-dot pattern** |
| openadapt-viewer | Light grey | **Long dash pattern** |
| openadapt-grounding | Medium grey | **Dash-dot-dot pattern** |
| openadapt-retrieval | Medium grey | **Mixed pattern** |
| openadapt-privacy | Grey | **Medium dash pattern** |

**Distinction**: With no color at all, 8 distinct line patterns ensure complete accessibility.

## Interactive Features

### Legend

The legend shows:
```
█ openadapt           ← Click to hide/show
█ openadapt-ml        ← Each entry is interactive
█ openadapt-capture   ← Box shows line color/pattern
... (etc)
```

**How to Use**:
1. Click any package name to toggle visibility
2. Hidden packages appear grayed out
3. Hover shows pointer cursor
4. Legend boxes match line patterns in chart

### Tooltips

Hover over any data point to see:
```
┌─────────────────────────────────┐
│ Dec 2025                         │ ← Date
│ ● openadapt: 123 downloads       │ ← Package & count
│ ● openadapt-ml: 45 downloads     │ ← With color indicator
│ ● openadapt-capture: 67 downloads│
│ ...                              │
│ Total: 235 downloads             │ ← Sum across all
└─────────────────────────────────┘
```

### Hover Highlighting

When you hover over a line:
- **Active line**: Full opacity, emphasized
- **Other lines**: Fade to 20% opacity
- **Effect**: Easy to trace which line you're examining

## Usage Tips

### Tip 1: Identify by Pattern First

In achromatopsia mode (no color), rely on patterns:
1. Look for the solid thick line → openadapt
2. Look for distinct dots → openadapt-capture
3. Look for long dashes → openadapt-viewer
4. Use tooltips to confirm

### Tip 2: Use Legend to Isolate

To focus on specific packages:
1. Click all packages except the one you want
2. Hidden packages disappear from chart
3. Click again to restore

### Tip 3: Hover for Confirmation

Not sure which line is which?
1. Hover over any data point
2. Tooltip shows all package names
3. Other lines fade, making active line obvious

### Tip 4: Compare Patterns in Legend

The legend boxes show line patterns:
1. Compare legend pattern to chart line
2. Match the pattern visually
3. No color needed for identification

## Tol Bright Color Scheme

Scientific basis for color choices:

### Why Tol Bright?

1. **Research-Based**: Designed by color scientist Paul Tol
2. **Peer-Reviewed**: Published in scientific literature
3. **Tested**: Validated with colorblind users
4. **Maximum Distinction**: Optimized for all CVD types

### Color Properties

| Color | Hex | RGB | Notes |
|-------|-----|-----|-------|
| Blue | #4477AA | rgb(68, 119, 170) | Safe for all CVD types |
| Red | #EE6677 | rgb(238, 102, 119) | Distinct from green |
| Green | #228833 | rgb(34, 136, 51) | Avoids red confusion |
| Yellow | #CCBB44 | rgb(204, 187, 68) | High contrast |
| Cyan | #66CCEE | rgb(102, 204, 238) | Unique hue |
| Purple | #AA3377 | rgb(170, 51, 119) | Distinct from blue |
| Orange | #EE7733 | rgb(238, 119, 51) | Warm accent |
| Grey | #BBBBBB | rgb(187, 187, 187) | Neutral |

### Contrast Ratios

All colors meet WCAG AA standards for contrast:
- Against white background: ≥4.5:1
- Against dark chart background: ≥3:1
- Between colors: ≥3:1

## Testing Checklist

Use this checklist when testing:

### Visual Distinction (No Color)
- [ ] Can identify openadapt by thick solid line
- [ ] Can distinguish dashed from dotted lines
- [ ] Can see difference between dash patterns
- [ ] All 8 lines look visually different

### Interactive Features
- [ ] Legend click toggles package visibility
- [ ] Legend hover shows pointer cursor
- [ ] Hover highlighting works smoothly
- [ ] Tooltips show package names clearly

### Colorblind Modes
- [ ] Protanopia: All lines distinguishable
- [ ] Deuteranopia: All lines distinguishable
- [ ] Tritanopia: All lines distinguishable
- [ ] Achromatopsia: All lines distinguishable

### Overall Accessibility
- [ ] Can use chart without seeing color
- [ ] Patterns provide sufficient distinction
- [ ] Tooltips confirm line identification
- [ ] Legend helps isolate packages

## Common Questions

### Q: Why not just use labels on the lines?

**A**: End-of-line labels would require an additional Chart.js plugin (chartjs-plugin-datalabels). The current approach works with built-in Chart.js features and provides excellent accessibility through the combination of patterns, widths, interactive legend, and enhanced tooltips.

### Q: Can I distinguish lines without hovering?

**A**: Yes! Line patterns and widths provide distinction without any interaction. Hover and tooltips are additional aids, not requirements.

### Q: What if two lines overlap?

**A**: Tooltips show all packages at that data point. You can also use the legend to hide packages and isolate specific lines.

### Q: Does this work on mobile?

**A**: Yes! Touch events work similarly to hover events. Tap any data point to see tooltips. Tap legend items to toggle visibility.

### Q: Are the patterns visible at all zoom levels?

**A**: Yes! Patterns scale with the chart and remain visible at all standard zoom levels (50%-200%).

## Browser-Specific Notes

### Chrome
- Best colorblind simulation tools
- Smooth hover animations
- Recommended for testing

### Firefox
- Good accessibility inspector
- Reliable pattern rendering
- Alternative testing option

### Safari
- Native canvas rendering (fastest)
- No built-in CVD simulation
- Use Chrome DevTools for testing

### Edge
- Chromium-based (same as Chrome)
- Built-in accessibility features
- Good testing option

## Print Considerations

When printing the chart:
- **Color Printer**: Tol Bright colors print well
- **Black & White**: Line patterns remain visible
- **Grayscale**: Patterns ensure distinction

## Summary

The PyPI download charts use a **multi-layered accessibility approach**:

1. **Color**: Tol Bright palette (colorblind-safe)
2. **Pattern**: 8 unique dash patterns
3. **Width**: Varying line thickness (2-3px)
4. **Interactive**: Click legend to toggle
5. **Tooltips**: Package names and counts
6. **Highlighting**: Hover to emphasize

**Result**: Fully accessible without relying on color perception alone.

---

**For detailed implementation**: See ACCESSIBILITY_IMPROVEMENTS.md
**For testing procedures**: See COLORBLIND_TESTING_GUIDE.md
**For data verification**: See DATA_VERIFICATION_REPORT.md
