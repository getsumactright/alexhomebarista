# alexhomebarista — website

A static site (HTML/CSS/JS, no build step) replacing Alex Gren's Linktree. Four design directions are presented for her to choose from:

| Page | What it is |
|---|---|
| `index.html` | Options page: presents all four directions with live previews |
| `first-light.html` | **A · First Light**: her counter across one day; scrolling moves the window light from 7:02 AM to 7:45 PM |
| `strata.html` | **B · Glass Strata**: her bio up front, drinks as colorful layered glasses |
| `rosetta.html` | **C · Rosetta**: one cup from above on espresso; a latte-art rosetta pours itself while her bio turns around the saucer |
| `counter.html` | **D · Exploded Counter**: her gear as a patent drawing; tap a numbered part for its brand and code |

All four share `styles.css`, `app.js` and `data.js`; each alternate adds its own `.css` and `.js` (B, C and D). C and D use short animations made with Remotion; the source is in [`motion/`](motion/README.md) and the rendered loops in `media/`. Once a direction is chosen, make it `index.html` and delete the others.

The sections below describe First Light; the other directions have the same features.

| Section | What's there |
|---|---|
| Hero | Search for any recipe or brand code (press `/` on desktop), quick links, newest recipe |
| Recipes (morning) | Drinks and house syrups with a filter; each opens a recipe sheet. Shareable links: `/#recipe/<id>` |
| Gear & Codes (midday) | Amazon storefront, every affiliate link, tap-to-copy codes, FTC disclosure |
| For Brands (afternoon) | Partners, what Alex makes, spec sheet, contact |

## Edit content

Everything visitors read lives in **`data.js`**. Layout code never needs touching to add a recipe, a code, or a brand.

## Preview locally

```bash
python3 -m http.server 5178
```

Then open http://localhost:5178.

## Deploy

The draft is live on GitHub Pages: every push to `main` republishes it. For the final site, any static host works (GitHub Pages, Netlify, Vercel). Ship the chosen page as `index.html` along with `styles.css`, `app.js` and `data.js` (plus `strata.css` and `strata.js` if B is chosen).

## Before launch: what Alex needs to supply

1. **Real recipes.** Replace the 10 sample entries in `data.js` (each has `sample: true`, which shows a "Sample" tag). Layers draw the glass, so give each layer a color key and a relative size.
2. **Contact email.** Set `contactEmail` in `data.js`. Until then, brand buttons open an Instagram DM and the media-kit button stays hidden.
3. **Casabrews Amazon links.** The Linktree used tracked `r.amzlink.to` links. The site currently uses plain Amazon product pages, so paste the original tracked links back in to keep commission attribution.
4. **Social URLs.** Instagram, TikTok and YouTube are assumed to be `@alexhomebarista`; confirm them.
5. **Brand numbers (optional).** Audience/reach and rates read "On request". Add real figures only when Alex has them.
6. **Confirm partners.** "On my counter" lists the 9 affiliate brands. Remove any Alex shouldn't present as a partner.

## Design system

See `DESIGN.md`. Product facts and constraints are in `PRODUCT.md`.
