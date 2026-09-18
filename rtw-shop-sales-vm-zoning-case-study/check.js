/* Renders the shop-review template in headless Chrome and fails loudly on:
     - the wrong number of panels or nav chips
     - a JS error
     - any surviving business figure in the visible text
     - a real photograph left embedded
   Run: node check.js        (writes shot_overview.png / shot_store.png) */
'use strict';
var path = require('path');
var puppeteer = require(path.join(__dirname, '..', '..', 'service', 'dx_ss26_review',
  'node_modules', 'puppeteer-core'));

var CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
var FILE = 'file:///' + path.join(__dirname, 'index.html').split(path.sep).join('/');
var KEEP = null;   // derived from the page: whichever store panel survived
var MON = '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*';

/* Calendar furniture and masked identifiers: the only digits allowed to survive.
   These are masked out of the panel text BEFORE the scan - phrase by phrase, not
   token by token, because innerText welds neighbours together ("STYLE-01" next to
   "FW26" reads as one word) and because a bare day-of-month is only legitimate
   when a month name is sitting beside it. */
var ALLOWED_PHRASES = [
  /(?:19|20)\d{2}-\d{2}-\d{2}/g,                                  // ISO dates
  new RegExp(MON + '\\.?\\s*\\d{1,2}\\s*[\\u2013\\u2014-]\\s*\\d{1,2}', 'g'), // Aug 1-31
  new RegExp('\\d{1,2}\\s*' + MON, 'g'),                          // 8 Sep
  new RegExp(MON + '\\.?\\s*\\d{0,2}', 'g'),                      // Sep 6, Aug
  /STYLE-\d{2}/g,                                                 // masked product codes
  /\b(?:FW|SS)\d{2}\b/g,                                          // season codes
  /W\d{1,2}/g,                                                    // week labels
  /\bL4W\b|\b4w[k]?\b|\b4-wk\b|\b4-week\b|\b4 weeks\b/gi,         // window labels
  /\bS\d{2}\b/g,                                                  // generic store codes
  /(?:19|20)\d{2}/g,                                              // years
  /^[ \t]*\d{1,2}(?=[ \t]*·)/gm,                             // "3 · The mix ..." section numbering
  /^[ \t]*\d{1,2}\.(?!\d)/gm,                                     // "1." / "2." bullet numbering
  /<18|>40|\b18-29\b|\b30-40\b/g                                  // the age-band labels
];

(async function () {
  var browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'] });
  var page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1400, deviceScaleFactor: 1 });

  var errors = [];
  page.on('pageerror', function (e) { errors.push('pageerror: ' + e.message); });
  page.on('console', function (m) { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(FILE, { waitUntil: 'networkidle2' });
  await new Promise(function (r) { setTimeout(r, 1200); });   // let the Tailwind CDN settle

  var shape = await page.evaluate(function () {
    return {
      panels: Array.prototype.map.call(document.querySelectorAll('.sr-panel'), function (p) { return p.id; }),
      chips: Array.prototype.map.call(document.querySelectorAll('.srb'), function (b) { return b.id; }),
      /* what the page shows before anything is clicked */
      landing: Array.prototype.filter.call(document.querySelectorAll('.sr-panel'), function (p) {
        return !p.classList.contains('hidden');
      }).map(function (p) { return p.id; }),
      activeChip: Array.prototype.filter.call(document.querySelectorAll('.srb'), function (b) {
        return /bg-gray-900/.test(b.className);
      }).map(function (b) { return b.id; }),
      photos: document.querySelectorAll('img[src^="data:image/jpeg"],img[src^="data:image/png"]').length,
      /* any image inside a panel that is not our placeholder: a real remote thumbnail,
         or an empty src that renders as a broken-image icon */
      foreign: Array.prototype.filter.call(document.querySelectorAll('.sr-panel img'), function (i) {
        return !/^data:image\/svg\+xml/.test(i.getAttribute('src') || '');
      }).map(function (i) { return (i.getAttribute('src') || '(empty)').slice(0, 60); }),
      svgs: document.querySelectorAll('svg').length
    };
  });
  console.log('panels : ' + shape.panels.join(', '));
  console.log('chips  : ' + shape.chips.join(', '));
  console.log('charts : ' + shape.svgs + '   real photos left: ' + shape.photos);
  if (shape.panels.length !== 2) throw new Error('expected 2 panels, got ' + shape.panels.length);
  if (shape.chips.length !== 2) throw new Error('expected 2 nav chips, got ' + shape.chips.length);
  KEEP = shape.panels.filter(function (p) { return p !== 'sr-ov'; })[0].replace('sr-', '');
  if (!/^S\d{2}$/.test(KEEP)) throw new Error('kept store reads "' + KEEP + '" - a real store code survived');
  /* No trading name may remain. Checked structurally rather than against a list of the real
     shop names - a denylist would have to carry those names around to prove they are gone.
     The generator puts the name in its own span right after the code span, so the test is:
     every store cell starts with a generic code, and that name slot no longer exists. */
  var names = await page.evaluate(function () {
    var bad = [];
    Array.prototype.forEach.call(document.querySelectorAll('.sr-panel button[onclick^="srShow"]'), function (b) {
      var first = b.querySelector('span');
      var code = first ? first.textContent.trim() : '';
      if (!/^S\d{2}$/.test(code)) bad.push('store cell reads "' + code + '"');
      Array.prototype.forEach.call(b.children, function (c, i) {
        if (i && /^[A-Z][a-z]+(\s[A-Za-z]+)+$/.test(c.textContent.trim()) && !/-/.test(c.textContent)) {
          bad.push('name-shaped text beside ' + code + ': ' + c.textContent.trim().slice(0, 30));
        }
      });
    });
    return bad;
  });
  if (names.length) {
    names.slice(0, 10).forEach(function (n) { console.log('   STORE CELL  ' + n); });
    throw new Error(names.length + " store-name check failure(s)");
  }
  console.log('store  : ' + KEEP + '   store cells all generic');

  /* the page must open on the store deep dive, with its chip lit, and nothing else showing */
  if (shape.landing.length !== 1 || shape.landing[0] !== 'sr-' + KEEP) {
    throw new Error('expected to land on sr-' + KEEP + ', but visible panels were: ' +
      (shape.landing.join(', ') || 'none'));
  }
  if (shape.activeChip.length !== 1 || shape.activeChip[0] !== 'srb-' + KEEP) {
    throw new Error('expected the ' + KEEP + ' chip to be the active one, got: ' +
      (shape.activeChip.join(', ') || 'none'));
  }
  console.log('landing: ' + shape.landing[0] + '  (chip ' + shape.activeChip[0] + ' lit)');

  /* the spliced-in APP Main Wall card must be there, leading section 6, with its bays */
  var wall = await page.evaluate(function () {
    var card = Array.prototype.filter.call(document.querySelectorAll('.sr-panel div'), function (d) {
      return /APP Main Wall/.test(d.textContent) && d.children.length && d.clientHeight;
    })[0];
    if (!card) return null;
    /* the labels read "Left bay" / "Right bay" and are uppercased by CSS, so match
       case-insensitively on the text rather than on how it is displayed */
    return { bays: (card.textContent.match(/\b(left|right|middle)\s+bay\b/gi) || []).length,
             imgs: card.querySelectorAll('img').length,
             rows: card.querySelectorAll('tr,.flex').length };
  });
  if (!wall) throw new Error('the APP Main Wall card is missing from section 6');
  if (wall.bays < 2) throw new Error('the Main Wall card has ' + wall.bays + ' bay boxes, expected at least 2');
  console.log('mainwall: ' + wall.bays + ' bays, ' + wall.imgs + ' images');

  /* the donut rings must actually draw an arc, and sit centred - an earlier pass erased
     the arcs and dragged cy off centre, which looked like a broken widget */
  var rings = await page.evaluate(function () {
    return Array.prototype.map.call(document.querySelectorAll('.sr-panel circle[stroke-dasharray]'), function (c) {
      var d = (c.getAttribute('stroke-dasharray') || '').split(/[ ,]+/);
      return { arc: parseFloat(d[0]) || 0, cy: parseFloat(c.getAttribute('cy')),
               vb: (c.ownerSVGElement.getAttribute('viewBox') || '').split(/\s+/) };
    });
  });
  if (!rings.length) throw new Error('no donut rings found');
  var dead = rings.filter(function (r) { return r.arc < 1; });
  if (dead.length) throw new Error(dead.length + ' donut segment(s) draw no arc');
  var offCentre = rings.filter(function (r) { return Math.abs(r.cy - (+r.vb[3]) / 2) > 1; });
  if (offCentre.length) throw new Error(offCentre.length + ' donut segment(s) are off centre');
  console.log('donuts : ' + rings.length + ' segments, all drawn and centred');

  /* every zoning card carries the region + age composition bars */
  var zones = await page.evaluate(function () {
    var strips = document.querySelectorAll('.sr-panel div.flex.mt-0\\.5.rounded.overflow-hidden');
    var widths = [];
    Array.prototype.forEach.call(strips, function (s) {
      Array.prototype.forEach.call(s.children, function (c) { widths.push(parseFloat(c.style.width) || 0); });
    });
    return { strips: strips.length, flat: widths.filter(function (w) { return w < 1; }).length };
  });
  if (zones.strips < 8) throw new Error('expected the region/age bars on every zoning card, found ' + zones.strips + ' strips');
  if (zones.flat) throw new Error(zones.flat + ' composition segment(s) render at zero width');
  console.log('zonebars: ' + zones.strips + ' composition strips, none flat');

  /* the TS scope chip reads plain "TS" */
  var tsLabel = await page.evaluate(function () {
    var b = document.getElementById('bsb-ts');
    return b ? b.textContent.trim() : null;
  });
  if (tsLabel !== 'TS') throw new Error('the TS scope chip reads "' + tsLabel + '", expected "TS"');
  console.log('scope chips: TS chip reads "TS"');

  /* #ov must still deep-link to the Overview. This needs its own tab: changing only the
     hash on the page we are already on is a same-document navigation, so the inline
     router never re-runs and the test would pass or fail for the wrong reason. */
  var hashPage = await browser.newPage();
  await hashPage.goto(FILE + '#ov', { waitUntil: 'networkidle2' });
  await new Promise(function (r) { setTimeout(r, 900); });
  var viaHash = await hashPage.evaluate(function () {
    return Array.prototype.filter.call(document.querySelectorAll('.sr-panel'), function (p) {
      return !p.classList.contains('hidden');
    }).map(function (p) { return p.id; });
  });
  await hashPage.close();
  if (viaHash.join() !== 'sr-ov') throw new Error('#ov did not open the Overview, got: ' + viaHash.join());
  console.log('deep-link: #ov opens the Overview');
  if (shape.photos) throw new Error(shape.photos + ' real photographs still embedded');
  if (shape.foreign.length) {
    shape.foreign.slice(0, 10).forEach(function (f) { console.log('   FOREIGN IMAGE  ' + f); });
    throw new Error(shape.foreign.length + ' image(s) in a panel are not the placeholder');
  }

  var bad = [];
  for (var v = 0; v < 2; v++) {
    var id = v === 0 ? 'ov' : KEEP;
    await page.evaluate(function (k) { srShow(k); }, id);
    await new Promise(function (r) { setTimeout(r, 400); });

    var res = await page.evaluate(function (pid) {
      var pane = document.getElementById('sr-' + pid);
      return { chars: pane.innerText.length,
               cards: pane.querySelectorAll('.rounded-2xl').length,
               tables: pane.querySelectorAll('table').length,
               svgs: pane.querySelectorAll('svg').length,
               text: pane.innerText };
    }, id);
    if (res.chars < 500) throw new Error('panel ' + id + ' rendered almost nothing');

    var t = res.text;
    ALLOWED_PHRASES.forEach(function (re) { t = t.replace(re, ' '); });
    (t.match(/\S*\d\S*/g) || []).forEach(function (tok) { bad.push(id + ': ' + tok); });

    console.log('panel ' + id + ': ' + res.chars + ' chars, ' + res.cards + ' cards, ' +
      res.tables + ' tables, ' + res.svgs + ' charts');
    await page.screenshot({ path: path.join(__dirname, 'shot_' + (v ? 'store' : 'overview') + '.png') });
  }

  await browser.close();
  if (errors.length) { errors.forEach(function (e) { console.log('!! ' + e); }); throw new Error(errors.length + ' page error(s)'); }
  if (bad.length) {
    var uniq = [], seen = {};
    bad.forEach(function (b) { if (!seen[b]) { seen[b] = 1; uniq.push(b); } });
    uniq.slice(0, 40).forEach(function (b) { console.log('   LEFTOVER FIGURE  ' + b); });
    throw new Error(uniq.length + ' distinct leftover figure(s)');
  }
  console.log('\nOK - 2 panels, no page errors, no leftover figures, no real photos.');
})().catch(function (e) { console.error('FAILED: ' + e.message); process.exit(1); });
