# Dashboard-template

Dashboard templates — shared by the F&F Hong Kong team.

Each folder holds one dashboard as a **blank template**: the complete layout, styling and
chart logic, with every business figure removed. Open the HTML, read the structure, fill in
the data blocks, and the page fills itself.

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
