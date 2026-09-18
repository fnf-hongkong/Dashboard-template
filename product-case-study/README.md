# Product Case Study — template

A single-style deep dive: one product, one launch window, read across thirteen cards — where
it ranks in its category, which doors sold it, how the colour and size buys performed against
what actually went out, who bought it, what else was in the basket, and how its opening week
compares with every other launch in the season.

Self-contained — no build step, no server, no package install, and no external requests at
all. Double-click `index.html` and it opens.

---

## Read this before you start

**This one is a layout reference, not a fillable data contract.** The other two templates in
this repo render from a single data object, so you replace the object and the page draws
itself. This page was hand-built: every figure lives in the markup at the point where it is
drawn, and the charts are SVG written out coordinate by coordinate. Blanking it therefore
meant replacing the figures *in place* rather than emptying a data block.

So use it for the structure and the chart vocabulary — the card order, the argument each card
makes, the tooltip conventions, the note blocks that close a section — and wire your own
generator to it. There is no `__DATA__` object to drop in.

---

## What is on the page

A sticky rail on the left carries the product shot, the headline KPIs and the metadata chips.
The main column runs thirteen cards:

| # | Card | What it shows |
|---|---|---|
| 1 | **Where It Ranks in Shoes** | The style placed in a top-10 of its category by net sales, its own row highlighted, closing with a note on rank by value vs by units and the style directly below it |
| 2 | **Sold Quantity by Shop** | Every selling door as a stacked bar, segmented by colourway, with door share alongside |
| 3 | **Basket Penetration by Shop** | The share of each door's baskets holding the style — the same doors read again, corrected for store size |
| 4 | **Colour Share** | A donut of units by colourway, tinted to the colour chips |
| 5 | **Colour Mix — Depth & Reach** | Per-colourway cards pairing the product shot with units, share of style, door count and size count |
| 6 | **Colour — What Was Put In vs What Went Out** | Allocation against sell-through by colour, ending in weeks of cover |
| 7 | **Size — What Was Put In vs What Went Out** | The same comparison down the size run |
| 8 | **Size Mix** | The style's size curve as a line against the scaled category curve, with door counts under each size |
| 9 | **Size × Colour** | One curve per colourway across the size run, for reading where size needs differ by colour |
| 10 | **Who Is Buying It** | A radar of age band against the chain baseline, pies for gender / residency / customer code, per-gender age bars, a buyer-skew strip and a caveat on identity capture |
| 11 | **What Else Is in the Basket** | Attach-rate tiles, attach rate by category against the chain, and the units-of-category-per-basket distribution |
| 12 | **Items Matching Up** | Same-receipt co-purchase ranked by lift, with thumbnails, so frequency and affinity are not confused |
| 13 | **How the Opening Compares** | Every launch in the season measured over *its own* first seven days, so a style that landed earlier is judged on the same footing |

Every image slot carries a placeholder; in a filled-in version they hold product shots, and
clicking one opens it in a lightbox.

---

## What was removed, and what was deliberately kept

**Removed**

- Every figure in visible text, in tooltips and in `alt` / `data-cap` attributes, replaced by
  `•` placeholders that keep the original width — `HKD •••,•••`, `#•`, `••.•%`, `•,••• u`.
- All 77 bar widths and 15 stacked-bar splits, replaced by one fixed decorative sequence. The
  bars are a repeating pattern, not a ranking.
- All 7 SVG charts, rebuilt geometrically: the donut and the three pies are equal slices, the
  two line charts follow a synthetic curve, and the radar is a fixed shape with its value dots
  and labels moved to match.
- The colour-coded direction signals — the index chips, the lift column and the negative note
  styling are flat, so nothing on the page still reads as good or bad.
- The identifiers: 24 style codes → `STYLE-001…`, 46 product names → `Sample Style 001…`,
  20 shop codes → `S01…`, 16 colourway codes → `C01…`, the brand name → `BRAND`, the source
  parquet filename, and the shared customer-code prefixes.
- **All 41 photographs**, replaced by one inline placeholder graphic. That covers the 26
  embedded product shots, the in-store VMD image — which carried the real style name and
  brand in its artwork, where text masking could not reach — and 15 thumbnails that had
  pointed at an internal F&F CDN. The file went from 2.5 MB to 129 KB and now makes no
  external requests, so it renders identically inside and outside the network.

**Kept on purpose**

- **The shape.** All thirteen cards, every heading, caption and narrative note block, and the
  tooltip on every bar and chart point — with the figures blanked inside them, so the page
  documents what each element is supposed to say.
- **The chart geometry.** The SVG is still real SVG with real axes, grids and legends; only
  the data coordinates were replaced.
- **Labels that are not results** — colour words (Silver / Black / Ivory / Brown), category
  words, and the period labels (week numbers, the date range, the season and launch dates).
- **Every image slot**, at its original size and with its lightbox wiring intact, so the
  layout keeps the density the real page has.

A banner at the top marks the page as a layout demo. Delete that block once real data is in.

---

## Internal preview

F&F staff can view the rendered template here (F&F login required):
<https://dcsai.fnf.co.kr/server/quick-dashboard/product-case-study-template>
