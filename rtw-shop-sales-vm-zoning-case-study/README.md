# RTW Shop Sales / VM Zoning — Case Study template

A blank by-store RTW review: how each door is trading, who is buying in it, and how its
display zones are selling. Two panels, both blank.

Self-contained apart from the Tailwind CDN — double-click `index.html` and it opens.
It lands on the **store page**; the Overview is one click away, or straight there with
`index.html#ov`.

---

## What is in it

**Overview** — the by-store table: every door on sales, WtW, YoY, share, IMC and a 4-week
sparkline, grouped Total / HK / MC / Online with sub-totals, and a scope switch across
All RTW · TS · WJ · WP. Click any door to open its deep dive.

**One store page (`S05`)** — the seven sections every door repeats:

| § | What it shows |
|---|---|
| **Insight & action** | Two concerns and two actions, side by side, above the floor photos taken after the VM update |
| **1 · Weekly sales trend** | TY vs LY by week, split All customers / Local / Mainland, for Total · RTW · ACC |
| **2 · By lifestyle** | Weekly trend and share shift per lifestyle grouping, with sold / SOH / variance chips |
| **3 · The mix** | Gender, season and category rings, each with the sub-categories that moved the slice |
| **4 · IMC review** | The season's IMC plan as a share of RTW, its top sellers, and the overall top sellers beside them |
| **5 · Top sellers** | Ranked by customer region × product gender |
| **6 · Display zoning sales** | The **APP Main Wall** card — wall photo, stat boxes, region and age bars, one style-ranking box per bay — then one card per zone, each with its photo, stats, customer block and style list |
| **7 · Buying behaviour** | Per-receipt basket behaviour TY vs LY, top and lost sub-category combos, and the outfit-look rows |

Every figure is removed. Blanks read as `—`, `$—` or `—%`; fill-in prompts are written
between guillemets, `«like this»`.

## What was removed

| | |
|---|---|
| **Figures** | Every money value, percentage, count, rank and share — in the text *and* in the `title` / `aria-label` tooltips, which is where half of them hide. |
| **Chart geometry** | Bars sit on the baseline, trend lines and their points run flat, ranking bars are at 0%, CSS mini-bars are 2px stubs. A chart drawn at real proportions is still a figure, just in another notation. |
| **Photographs** | 143 embedded store display and product photos, plus 6 thumbnails that pointed at an internal F&F CDN, all replaced by inline placeholder tiles. That is most of why this is 569 KB rather than 13 MB. |
| **Product identity** | 78 distinct style codes masked to a stable `STYLE-01…78`, and 132 product descriptions to `«product name»`. Which styles sell in a door is data too. |
| **Store identity** | All 15 trading names dropped; every door is a generic `S01`…`S15`, numbered in the order the Overview lists them. |
| **The written read** | The Insight & action bullets and the section-7 amber box are now writing prompts — the numbers in them were already blank, but the sentences were real conclusions about a real door. |
| **Source paths** | Internal workbook filenames in the provenance lines. |

## What was kept on purpose

- **Calendar furniture** — `W33–W36`, month names, the ISO date range, `TY 2026 / LY 2025`.
  The page is unreadable as a format without an axis, and none of it is a business figure.
- **Composition visuals** — donut rings and the region / age strips are *not* erased. An empty
  ring reads as a broken widget rather than a blank one, so each is redrawn as an **even split**
  of however many segments it has: unmistakably a placeholder, still recognisably the chart it
  stands for. The figure in the middle already reads as a dash.
- **The door list** — 15 rows across HK / MC / Online with their region and customer-archetype
  tags. The shape of the estate is the format; which shop is which is not.
- **Zone names** (Main Wall, Feminine, Luxury, Unisex Outdoor…), lifestyle tags, sub-category
  names and every legend explaining how a panel is calculated. That is the format.

## Filling it in

There is no single data object here — unlike the RTW Collection Case Study, this page is
server-rendered. Use it to agree the layout, the section order and the wording before a week
is built, or as the brief for a new by-store review, and generate the real thing from the
pipeline that produces it.

To repeat a door: copy the store panel, give it a new `id` (`sr-S06`) and add a matching nav
chip. The nav already carries a note saying so.

## `check.js`

Renders the page in headless Chrome and fails on: the wrong panel count, a JS error, a
surviving figure, a real photograph, an image that is not a placeholder, a real trading name,
the wrong landing panel, a donut that draws no arc or sits off centre, or a composition
segment at zero width.

It scans by masking the calendar furniture out of the panel text and then flagging *anything*
still carrying a digit, rather than matching a list of known-bad patterns. That inversion is
what caught the figures the first passes missed — a share-shift sequence whose leading number
survived, sub-category bars still drawn at their real widths, and two age bands silently
losing their width because `>40` and `<18` sit inside `title` attributes and broke a naive
tag-matching regex.

It expects `puppeteer-core` at a path relative to the internal build tree, so it will need its
`require` adjusted to run anywhere else.
