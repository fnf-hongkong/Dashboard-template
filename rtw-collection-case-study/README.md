# RTW Collection Case Study — template

A blank collection review: four tabs that take one RTW capsule from *what sold* through
*which doors sold it*, *who bought it* and *what the shops say about it*, ending each tab
with a Key reading box that states the finding and the buying decision it leads to.

Self-contained — no build step, no server, no package install. Double-click
`index.html` and it opens. It makes no external requests at all.

Every figure has been removed and every sentence replaced by a fill-in prompt written
between guillemets, `«like this»`. Replace the whole token, guillemets included.

---

## The tabs

| Tab | What it shows |
|---|---|
| **01 · Product & sales** | Headline tiles, the weekly sold trend split by sleeve with cumulative sell-through under each week, a by-style table with colourway thumbnails and fit/length badges, and by-colour / by-length / by-sleeve cuts |
| **02 · Store performance** | Every door ranked on collection units and sales, its collection sales as a slice of the base business it sits inside, rank-vs-size bubbles, region mix bars, and sleeve / length mix per door |
| **03 · Customer & combo** | Region × age matrix, weekly sales by region, the size curve cut by length and region, top-5 SKUs per segment with an over-indexing flag, same-receipt buying combos, and what gets attached by sub-category |
| **04 · Shop VOC** | A power ranking of shop score against sell-through, expandable per-style reads, ranked wins and issues with the door count behind each, and a callout block for a complaint that runs across styles |

## The one rule

Everything renders from a single object, `window.__DATA__`, injected as one line near the
end of `index.html`. **There is no prose in the render script.** To make a real report you
replace that object — you never edit the JavaScript below it.

```
D.meta      headline figures, the week list, colour/store dictionaries, the masthead
D.styles    one record per style, each with its colourways and weekly units
D.receipts  receipt lines — [week, store, region, age, gender, size, style, colour, qty, amt]
D.basket    receipt-level UPT / ATV / attachment
D.voc       shop feedback — scores, wins, issues, the callout block
D.combos    same-receipt pairings
D.copy      every sentence on the page
```

## Files

| File | What it is |
|---|---|
| `index.html` | The template. This is the thing you open and ship. |
| `blank_data.js` | The blank dataset + the copy deck, commented. **This is the contract** — match its keys. |
| `data.template.json` | The same object as plain JSON, if you would rather build it from Python. |
| `check.js` | Renders the page in headless Chrome, clicks all four tabs and fails on a JS error, an empty pane, a stray figure or leftover wording. Run it before you show anyone. |

## How to fill it in

1. Copy this folder and rename it for your collection.
2. Build the `__DATA__` object from your sources — the item file (order / received / sold /
   weekly units), the receipt-line export (store, region, age, gender, size) and the shop
   VOC workbook. `blank_data.js` documents every key.
3. Replace the `window.__DATA__=…` line in `index.html` with your object.
4. Run `node check.js`. It fails loudly rather than letting a half-empty page reach anyone.

**Replace the values; keep the shape.** The placeholder rows are laid out to exercise every
bucket the page can draw — six styles covering all three sleeves, three lengths and two fits,
four colourways, eight doors, and receipt rows touching every region, age and size. Delete
a dimension and the tab that draws it goes empty.

## What is already wired up for you

- **The vocabularies are data.** `meta.regions`, `meta.ages`, `meta.sizes`, `meta.lengths`,
  `meta.sleeveOrder` and their colour maps all override the defaults, so the same page can
  review a bottoms capsule or an accessories drop, not only tees.
- **The masthead is data** — `meta.kicker`, `meta.collection`, `meta.tagline`, `meta.subLines`.
- **The store table's column headers are data** — `copy.storeCols`. "Base" means whatever
  business the collection is measured inside: women's RTW, men's outerwear, accessories.
- **The like-for-like cohort is data** — `meta.dropWeek`. Only styles that landed in the main
  drop week are compared, so a style with a head start cannot flatter whatever group it sits in.
- **The tab names are data** — `copy.tabs`.

## Writing the prose

Each tab ends with a Key reading box, filled from `copy.readProduct`, `copy.readStore`,
`copy.readCustomer` and `copy.readVoc`:

```js
{ hl:   'the one-sentence finding, with the figures that prove it in <b>bold</b>',
  cols: [ { h: 'Working',         items: ['…', '…'] },
          { h: 'Needs attention', items: ['…'] },
          { h: 'Buy signal',      items: ['…'] } ],
  act:  '<b>SS28:</b> the decisions this review leads to',
  prov: 'which file, which columns, which weeks, and every reconciliation gap' }
```

Two habits worth keeping from the review this was cut from:

- **Never hand-count a door.** In the VOC tab, `voc.wins[].doors` and `voc.issues[].doors` are
  door lists and the bar prints `n / total`. Derive them by matching the comment text with the
  `doorsWith()` / `doorsIn()` helpers already in the page, then write the result into the
  dataset — a bare keyword match over-counts whenever one door is praising the very thing the
  others complain about.
- **Check the prose against the numbers before publishing.** Dump every figure the read boxes
  assert and read the sentences against it. The original review carried about a dozen claims
  that were entirely plausible and wrong until someone did exactly that.

## A note on the blank state

With no data the page renders `0`, `0%`, `HK$0` and `—` throughout rather than crashing or
printing `NaN`, and product photos fall back to a neutral tile. Two numbers you will still
see are structural, not data: the `>40` age-band label, and the `100.0%` on a total row.
