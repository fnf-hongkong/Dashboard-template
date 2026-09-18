# Dashboard-template

Dashboard templates — shared by the F&F Hong Kong team.

Each folder holds one dashboard as a **blank template**: the complete layout, styling and
chart logic, with every business figure removed. Open the HTML, read the structure, fill in
the data blocks, and the page fills itself.

`product-case-study/` is the exception. It was hand-built rather than rendered from a data
object, so its figures live in the markup where they are drawn — read it as a layout
reference and wire your own generator to it, rather than expecting a data block to drop in.

---

## `customer-profile/`

**Customer Profile — an eight-week customer behaviour study across a set of retail stores.**

A single self-contained HTML file. No build step, no server, no package install — double-click
`customer-profile/index.html` and it opens. The only external requests it makes are for
Tailwind and Chart.js from public CDNs.

### What is in it

| Tab | What it shows |
|---|---|
| **Customer Base** | Who is buying: headline KPIs, demographics (age / gender / spend tiers), behaviour (new vs returning, basket by segment, customer origin), age × category affinity, acquisition cohorts, shop profile, membership, a repeat-purchase deep dive and an auto-written read of the whole tab |
| **Part 1 · Weekly Customer Trend** | Weekly sales and receipts by customer origin, per store or across all stores, plus a store trajectory heatmap and a stability index |
| **Part 2 · ATV Positioning** | Stores placed on a customer-type × age matrix by average transaction value, an ATV/volume strategic map, and a month-over-month comparison |
| **Part 3 · Category Study** | A category overview (leaderboard, weekly mix, auto-written notes) and a **dimension explorer** that pivots category × store × origin × age × gender × week across six measures, with filters and saved views |

Everything is rendered from data — nothing is typed into the markup — so there is no page to
re-lay-out and no figure that can go stale.

### How to fill it in

Open `index.html` in any editor and find the **`HOW TO FILL THIS IN`** comment at the top of
the `<script>` block near the end of the file. It documents all nine data blocks. In short:

| Block | Shape |
|---|---|
| `WEEKS` | 8 week labels, oldest first. Every weekly array is indexed by position in this list |
| `PARTIAL` | `{}` when every week is complete; otherwise the page raises its own incomplete-week banner and marks the affected chart labels |
| `SALES` | store → origin → 8 weekly net-sales values |
| `TX` | store → receipt counts per origin and per age band, plus weekly counts per origin |
| `SALES_AGE` | store → age band → net sales |
| `CROSS_TAB` | store → week → origin → age → **share** of that week's sales (fractions, summing to ~1.0) |
| `CAT` | store → category → origin → net sales |
| `CAT_AGE` | store → category → age band → net sales |
| `BRAND_CAT_AGE` | brand-wide category → age band → net sales |
| `CUBE` | the fact table behind Part 3 — parallel index arrays into `CUBE.levels` plus sales / units / receipts per cell |
| `CB` | the Customer Base tab — totals, segments, gender, age, origin, membership, repeat behaviour, per-shop rows, spend bands, weekly new-vs-returning, cohorts |

Every key, dimension level and array length has been left in place as a worked example of the
required shape. **Replace the zeros; keep the shape.** `CUBE` and `CB` each carry an `ok` flag —
set it to `false` to hide that tab entirely rather than showing it empty.

Two conventions worth knowing: figures should be net of returns and in a single currency (the
page never converts), and shares in `CROSS_TAB` are fractions (`0.68`), not percentages (`68`).

### What was removed, and what was deliberately kept

**Removed** — 28,344 figures: every value in the nine data blocks, plus the hardcoded totals in
the header, the worked example in the trajectory caption, the four Part 3-B finding cards and
the observed numbers quoted in a few code comments.

**Kept on purpose:**

- **The shape.** Every key, every dimension level and every array length, so the file documents
  the data contract it needs.
- **Structural indices.** The cube's store / week / origin / age / gender / category index
  arrays and its category-to-segment map. Zeroing those would collapse the pivot grid to a
  single row and destroy the layout the template exists to show.
- **Bucket definitions,** not results: spend-band floors, return-gap bucket edges, cohort month
  numbers, the ATV tier thresholds, the number of weeks in the window.
- **Labels:** store codes, category names, product names and thumbnails.

The blank page renders at `0`, `—` and `0%` throughout rather than crashing or printing `NaN`;
a small number of zero-data guards are marked `TEMPLATE GUARD` in the source.

### Notes before you share it further

- **Product thumbnails** in the repurchase ranking point at an internal F&F CDN
  (`static-dashff.fnf.co.kr`, `static-resource-mall.fnf.co.kr`). They will not load outside the
  network — replace the `img` / `imgBig` fields in `CB.rep.top`, or drop them, if that matters.
- The banner at the top of the page marks it as a template. Delete that block once the data is in.

### Internal preview

F&F staff can view the rendered template here (F&F login required):
<https://dcsai.fnf.co.kr/server/quick-dashboard/customer-profile-template>

---

## `rtw-collection-case-study/`

**RTW Collection Case Study — a four-tab review of one ready-to-wear capsule, from what sold
through to what the shops say about it.**

A single self-contained HTML file with no build step and no external requests at all —
double-click `rtw-collection-case-study/index.html` and it opens.

| Tab | What it shows |
|---|---|
| **01 · Product & sales** | Headline tiles, the weekly sold trend by sleeve with cumulative sell-through, a by-style table with colourway thumbnails and fit/length badges, and by-colour / by-length / by-sleeve cuts |
| **02 · Store performance** | Every door on collection units and sales, its collection sales as a slice of the base business, rank-vs-size bubbles, region mix, and sleeve / length mix per door |
| **03 · Customer & combo** | Region × age, weekly sales by region, the size curve cut by length and region, top-5 SKUs per segment with an over-indexing flag, same-receipt combos, and attachment by sub-category |
| **04 · Shop VOC** | Shop score ranked against sell-through, expandable per-style reads, ranked wins and issues with the door count behind each, and a cross-style callout |

Everything renders from one object, `window.__DATA__`, and **all prose lives in `D.copy`** —
there is not a single sentence in the render script. Fill the object in and the page writes
itself. Placeholders are written between guillemets, `«like this»`.

`blank_data.js` is the data contract, commented key by key; `data.template.json` is the same
object as plain JSON; `check.js` renders the page in headless Chrome and fails loudly on a JS
error, an empty pane or a stray figure. See `rtw-collection-case-study/README.md` for the
full how-to.

---

## `weekly-sales-review/`

**Weekly Sales Review — the daily / weekly / monthly retail sales dashboard for a market, with
receipt, IMC and top-seller views.** A blank of the MLB Hong Kong daily board: complete
layout, toggles, popups and formulas, every business figure removed.

A single self-contained HTML file. No build step, no server, no package install —
double-click `weekly-sales-review/index.html` and it opens.

| Tab | What it shows |
|---|---|
| **Sales Review** | Three period boxes (Yesterday / WTD·LW / MTD·LM·YTD) with Sales, YoY, Regular vs Outlet and ACC vs RTW, an All/MLB-only and Excl/Incl-clearance toggle, a Key Insight card (dropped stores & categories), and a by-store table with a per-store 📊 detail popup |
| **Monthly Sales** | A store × month matrix and a By Store × Cat view, TY-vs-LY with sales / discount and channel / category cuts |
| **Last 12 Weeks** | The same, weekly |
| **By Season ST & SOH** | Sell-through % and closing SOH by season aging, RTW vs ACC |
| **IMC Review** | The IMC launch calendar with per-launch order / sold / ST%, and IMC vs non-IMC + Sales & Order share |
| **Customer Region** | Local vs tourist weekly trend, ATV and mix |
| **In-season Intake & ST** | Order → received → sold by category |
| **Top Seller** | Top styles / SKUs by period with SOH and weeks-cover |

### Filling it in

Everything renders from JS data objects near the top of the file — `salesData`,
`trendData`, `monthly`/`weeklyStoreData`, `storeTargets`, `brandData`, `agingData`, `IMC`,
`SHARE`, `CRD`, `INS`, `txnData`, `cat3Data`, `topSellerData` and `stores`. Replace the
zeros with your market's numbers and the page fills itself. Store names are generic
placeholders (`S01`, `S02`…) keyed to internal ids; top-seller styles show as
`STYLE-01` / «Style 01 short name». Period date-range labels are left as examples.

---

## `product-case-study/`

**Product Case Study — a single-style deep dive: one product, one launch window, read across
thirteen cards.**

A single self-contained HTML file with no build step and no external requests at all —
double-click `product-case-study/index.html` and it opens.

| Card | What it shows |
|---|---|
| **Rank in category** | The style placed in a top-10 of its category by net sales, its own row highlighted, closing on rank by value vs by units and the style directly below it |
| **By shop** | Every selling door as a stacked bar segmented by colourway, then the same doors read again as basket penetration — share of that door's baskets holding the style, which corrects for store size |
| **Colour** | Share donut, per-colourway depth-and-reach cards with product shots, and allocation against sell-through ending in weeks of cover |
| **Size** | Allocation vs sell-through down the size run, the style's size curve against the scaled category curve, and one curve per colourway for reading where size needs differ by colour |
| **Who is buying it** | Age band on a radar against the chain baseline, pies for gender / residency / customer code, per-gender age bars, a buyer-skew strip and a caveat on identity capture |
| **Basket** | Attach-rate tiles, attach rate by category against the chain, units-per-basket distribution, and same-receipt co-purchase ranked by lift so frequency and affinity are not confused |
| **Opening comparison** | Every launch in the season measured over *its own* first seven days, so a style that landed earlier is judged on the same footing |

Unlike the other two, this page is **hand-built rather than data-driven** — the figures live in
the markup at the point where they are drawn, and the charts are SVG written out coordinate by
coordinate. Blanking it meant replacing the figures in place, so there is no data block to
fill. Read it for the structure and the chart vocabulary and wire your own generator to it.

### What was removed, and what was deliberately kept

**Removed** — every figure in visible text, tooltips and `alt` / `data-cap` attributes,
replaced by `•` placeholders that keep the original width; all 77 bar widths and 15
stacked-bar splits, replaced by one fixed decorative sequence; all 7 SVG charts, rebuilt
geometrically (equal donut and pie slices, synthetic line curves, a fixed radar shape with its
dots and labels moved to match); the colour-coded direction signals, so nothing still reads as
good or bad; the identifiers — 24 style codes, 46 product names, 20 shop codes, 16
colourway codes, the brand name, the source filename and the customer-code prefixes; and all
41 photographs, replaced by one inline placeholder graphic, which also removed the in-store
VMD image that carried the real style name in its artwork and 15 thumbnails pointing at an
internal F&F CDN. That took the file from 2.5 MB to 129 KB.

**Kept on purpose** — all thirteen cards with every heading, caption and narrative note block,
and the tooltip on every bar and chart point, blanked inside rather than stripped, so the page
documents what each element is meant to say. The SVG is still real SVG with real axes, grids
and legends; only the data coordinates changed. Colour words, category words and period labels
stay, as does every image slot at its original size with its lightbox wiring intact, so the
layout keeps the density the real page has.

A banner at the top marks the page as a layout demo. Delete that block once the data is in.

### Internal preview

F&F staff can view the rendered template here (F&F login required):
<https://dcsai.fnf.co.kr/server/quick-dashboard/product-case-study-template>

---

## `rtw-shop-sales-vm-zoning-case-study/`

**RTW Shop Sales / VM Zoning — a by-store review: how each door is trading, who is buying in
it, and how its display zones are selling.**

A single self-contained HTML file — double-click
`rtw-shop-sales-vm-zoning-case-study/index.html` and it opens on the store page; the Overview
is one click away, or straight there with `#ov`.

**Overview** is the by-store table: every door on sales, WtW, YoY, share, IMC and a 4-week
sparkline, grouped Total / HK / MC / Online with sub-totals, and a scope switch across
All RTW · TS · WJ · WP.

**One store page** carries the seven sections every door repeats: Insight & action · weekly
sales trend TY vs LY · by lifestyle · the gender / season / category mix · IMC review · top
sellers by region and gender · display-zoning sales, opening with the APP Main Wall card and
one card per zone · and buying behaviour, with the outfit-look rows.

**Removed** — every money value, percentage, count, rank and share, in the text and in the
tooltips; the chart geometry, so no bar or line is drawn at a real proportion; 143 photographs
and 6 internal-CDN thumbnails, replaced by inline placeholders (13 MB → 569 KB); 78 style
codes and 132 product names; all 15 trading names, with every door now a generic `S01`…`S15`;
and the written conclusions, which became writing prompts.

**Kept on purpose** — the calendar labels, the door list with its region and archetype tags,
the zone and sub-category names, every legend, and the composition visuals: donut rings and
the region / age strips are redrawn as an even split rather than erased, because an empty ring
reads as broken rather than blank.

`check.js` renders the page and fails on a surviving figure, a real photo or name, a donut
that draws no arc, or a composition segment at zero width. See the folder's own README.
