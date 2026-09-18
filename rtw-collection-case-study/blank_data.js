/* ============================================================================
   Blank dataset for the RTW Collection Case Study template.
   ----------------------------------------------------------------------------
   Same shape as a real build, every figure zeroed and every label a placeholder.
   Anything written between guillemets - «like this» - is a prompt telling you
   what belongs there. Replace the whole token, guillemets included.

   The page renders entirely from this object, so filling it in IS the build.
   ========================================================================== */
'use strict';

/* a neutral tile stands in for a product photo until the real ones are embedded */
var PH_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="150">' +
  '<rect width="120" height="150" fill="#EFE7DA"/>' +
  '<rect x="0.5" y="0.5" width="119" height="149" fill="none" stroke="#D9CBB6"/>' +
  '<text x="60" y="78" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#A1907B">photo</text>' +
  '</svg>');

var WEEKS = ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'];
var DROP = 'W04';                                   // the main launch week
var STORE_WEEKS = WEEKS.slice(WEEKS.indexOf(DROP)); // the window every store figure uses

var REGIONS = ['Local', 'Mainland', 'Other'];
var AGES = ['<18', '18-29', '30-40', '>40'];
var SIZES = ['XS', 'S', 'M', 'L'];
var SLEEVES = ['Sleeveless', 'Short sleeve', 'Long sleeve'];
var LENGTHS = ['Crop', 'Semi Crop', 'Regular'];

/* four placeholder colourways. Colour name and hex are rarely in the master file -
   sample them off the product photos and list them here. */
var COLOURS = [
  { code: 'COL-A', name: '«Colour A»', hex: '#2E2823' },
  { code: 'COL-B', name: '«Colour B»', hex: '#E0DFD7' },
  { code: 'COL-C', name: '«Colour C»', hex: '#8A9880' },
  { code: 'COL-D', name: '«Colour D»', hex: '#A98B72' }
];

/* six placeholder styles, laid out so every sleeve / fit / length bucket is exercised */
var STYLE_SPEC = [
  { sleeve: 'Sleeveless', fit: 'Slim', length: 'Crop' },
  { sleeve: 'Short sleeve', fit: 'Slim', length: 'Crop' },
  { sleeve: 'Short sleeve', fit: 'Slim', length: 'Semi Crop' },
  { sleeve: 'Short sleeve', fit: 'Comfortable', length: 'Regular' },
  { sleeve: 'Long sleeve', fit: 'Slim', length: 'Semi Crop' },
  { sleeve: 'Long sleeve', fit: 'Comfortable', length: 'Regular' }
];

/* eight placeholder doors across the Local / Tourist x Young / Mid / Old grid */
var STORE_SPEC = [
  { code: 'S01', reg: 'Local', band: 'Mid' },
  { code: 'S02', reg: 'Local', band: 'Old' },
  { code: 'S03', reg: 'Local', band: 'Young' },
  { code: 'S04', reg: 'Tourist', band: 'Mid' },
  { code: 'S05', reg: 'Tourist', band: 'Young' },
  { code: 'S06', reg: 'Tourist', band: 'Old' },
  { code: 'S07', reg: 'Local', band: 'Mid' },
  { code: 'S08', reg: 'Tourist', band: 'Mid' }
];

function zeroWeeks() {
  var o = {};
  WEEKS.forEach(function (w) { o[w] = 0; });
  return o;
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }

module.exports = function blankData() {
  /* ------------------------------------------------------------- styles */
  var styles = STYLE_SPEC.map(function (spec, i) {
    var code = 'STYLE-' + pad2(i + 1);
    return {
      code: code,
      desc: '«full product description as it reads in the master file»',
      name: '«Style ' + pad2(i + 1) + ' short name»',
      price: 0,
      sleeve: spec.sleeve,
      fit: spec.fit,
      length: spec.length,
      detail: '«the one feature that sells it»',
      imc: '',
      launch: '',
      plannedWk: 0,
      grouping: '«lifestyle grouping»',
      collection: '«COLLECTION NAME»',
      fibre: '«fibre composition»',
      fabric: '«fabric, in English»',
      globalCols: COLOURS.map(function (c) { return c.code; }),
      colors: COLOURS.map(function (c) {
        return {
          code: c.code, name: c.name, hex: c.hex,
          sku: code + '-' + c.code,
          order: 0, rcvd: 0, sold: 0,
          weeks: zeroWeeks(),
          img: PH_IMG, imgB: PH_IMG,
          st: 0
        };
      }),
      weeks: zeroWeeks(),
      order: 0, rcvd: 0, sold: 0, st: 0, amt: 0, soh: 0,
      firstWk: DROP,
      wom: 0, rate: 0,
      img: PH_IMG
    };
  });

  /* ----------------------------------------------------------- receipts
     [week, store, region, age, gender, size, style, colour, qty, amt]
     One zeroed row per store x style, cycling the customer dimensions so every
     region / age / size bucket exists on the page before the real file lands. */
  var receipts = [];
  var n = 0;
  STORE_SPEC.forEach(function (st) {
    styles.forEach(function (s) {
      receipts.push([
        STORE_WEEKS[n % STORE_WEEKS.length],
        st.code,
        REGIONS[n % REGIONS.length],
        AGES[n % AGES.length],
        n % 7 === 0 ? 'Male' : 'Female',
        SIZES[n % SIZES.length],
        s.code,
        COLOURS[n % COLOURS.length].code,
        0, 0
      ]);
      n++;
    });
  });

  /* ------------------------------------------------------- store dictionaries */
  var storeArch = {}, storeMix = {};
  STORE_SPEC.forEach(function (st) {
    storeArch[st.code] = { label: st.reg + '-' + st.band, reg: st.reg, band: st.band, pct: 0 };
    storeMix[st.code] = {
      rtw: 0, women: 0, well: 0,
      rtwAmt: 0, womenAmt: 0, wellAmt: 0,
      womenPct: 0, wellOfWomen: 0, wellOfRtw: 0,
      womenPctAmt: 0, wellOfWomenAmt: 0
    };
  });

  var meta = {
    /* --- masthead ------------------------------------------------------ */
    /* kicker, collection and tagline are plain text (escaped on the way in).
       subLines are raw HTML, so <b> works there. */
    kicker: '«BRAND» Hong Kong & Macau  ·  «SEASON» RTW  ·  Collection review',
    collection: '«COLLECTION»',
    tagline: '«drop month» · «what the capsule is, in five words»',
    subLines: [
      '<b>«n» styles · «n» colourways</b>',
      '«units» units · HK$«value» · <b>«n»% sell-through</b>',
      'data to «week» (week ending «date»)'
    ],
    collectionTag: '«TAG»',      // the pill on an in-collection item in the combo cards
    title: '«BRAND» HK - «COLLECTION» collection review',
    asOf: '«W00 (week ending 00 Mmm 0000)»',

    /* --- the reporting window ------------------------------------------ */
    weeks: WEEKS,
    dropWeek: DROP,
    storeWeeks: STORE_WEEKS,

    /* --- headline figures ---------------------------------------------- */
    /* counts, not derived from the placeholder rows - they are headline figures like any
       other, so the template leaves them blank. Put the real numbers here. */
    nStyles: '«n»',
    nSkus: '«n»',
    order: 0, rcvd: 0, sold: 0, amt: 0, st: 0,
    rcQty: 0, rcAmt: 0,       // the same two off the receipt file
    gap: 0, gapPct: 0,        // item file vs receipt file, always printed in provenance
    compWk: zeroWeeks(),      // the comparison range, week by week
    teeWk: zeroWeeks(),       // the parent category, for the share-of-category tile

    /* --- vocabularies (override to re-cut the page for another product type) */
    regions: REGIONS,
    ages: AGES,
    sizes: SIZES,
    sleeveOrder: SLEEVES,
    lengths: LENGTHS,
    barHex: {},               // colourway code -> a darker bar colour, for near-white shades
    subCatNames: null,        // sub-category code -> readable name; null keeps the defaults

    /* --- colour and store dictionaries --------------------------------- */
    colNames: (function () { var o = {}; COLOURS.forEach(function (c) { o[c.code] = c.name; }); return o; })(),
    colHex: (function () { var o = {}; COLOURS.forEach(function (c) { o[c.code] = c.hex; }); return o; })(),
    storeArch: storeArch,
    storeMix: storeMix,
    chainMix: {
      rtw: 0, women: 0, well: 0, rtwAmt: 0, womenAmt: 0, wellAmt: 0,
      womenPct: 0, wellOfWomen: 0, wellOfRtw: 0, womenPctAmt: 0, wellOfWomenAmt: 0
    },
    corr: {
      n: STORE_SPEC.length,
      mixVsPen_r: 0, mixVsPen_rho: 0, unitsVsUnits_r: 0,
      best: ['S01', 'S02', 'S03'],     // strongest converters, computed in the builder
      worst: ['S06', 'S07', 'S08'],    // weakest converters
      topWomenMix: [], bigWomen: []
    },

    /* an in-store photo of the collection on the floor; leave empty for none */
    display: []
  };

  /* ---------------------------------------------------------------- VOC */
  var vocStyles = styles.slice(0, 3).map(function (s, i) {
    return {
      style: s.code,
      desc: s.desc,
      overall: 0,
      scores: { color: 0, fit: 0, material: 0, design: 0 },
      callout: '«one line: what the doors say about this style»',
      why: {
        fit: '«what the doors say about fit and length»',
        material: '«what the doors say about the fabric»',
        design: '«what the doors say about the design»',
        color: '«what the doors say about the colour range»'
      },
      tags: ['«tag»', '«tag»', '«tag»'],
      topics: ['FIT/LENGTH', 'MATERIAL', 'DESIGN', 'COLOR'].map(function (t) {
        return { topic: t, notes: [] };   // notes: [[storeCode, 'the comment as written'], ...]
      })
    };
  });

  var voc = {
    weekLabel: '«Week 00»',
    stores: STORE_SPEC.map(function (s) { return s.code; }),
    styles: vocStyles,
    series: { q: '«the series question as the form asks it»', notes: [] },
    adjacent: { q: '«the adjacent-block question»', notes: [] },
    scoreNote: '«Say here that the shop score is an editorial 0-10 read of the comments - ' +
      'the shop form carries no rating scale.»',
    /* Wins and issues: count the doors by matching the comment text, never by hand. */
    wins: [1, 2, 3, 4].map(function (i) {
      return { icon: '✓', label: '«What the doors love, ' + i + '»', doors: [], note: '«the evidence»' };
    }),
    issues: [1, 2, 3, 4].map(function (i) {
      return { icon: '!', label: '«Where it loses sales, ' + i + '»', doors: [], styles: [], note: '«the evidence»' };
    }),
    /* the one complaint worth its own block; drop the whole key if there isn't one */
    callout: {
      icon: '⚠️',
      title: '«The one repeated complaint &mdash; and the fixes the doors ask for»',
      cards: [1, 2, 3].map(function (i) {
        return {
          icon: '•',
          code: '«Angle ' + i + '»',
          name: '«the doors that said it»',
          quote: '«the quote, then what it means for the buy»'
        };
      })
    }
  };

  /* ------------------------------------------------------------- combos */
  function pair(i) {
    return {
      a: styles[i % styles.length].code, b: 'PARTNER-' + pad2(i + 1),
      n: 0, amt: 0,
      aName: styles[i % styles.length].name, bName: '«partner style name»',
      aIn: true, bIn: false, both: false,
      aSub: 'TS', bSub: 'TS', aSeason: '', bSeason: '',
      prof: null
    };
  }
  var combos = {
    all: [0, 1, 2, 3, 4].map(pair),
    inside: [0, 1, 2, 3, 4].map(function (i) {
      var p = pair(i);
      p.b = styles[(i + 1) % styles.length].code;
      p.bName = styles[(i + 1) % styles.length].name;
      p.bIn = true; p.both = true;
      return p;
    }),
    cross: [0, 1, 2, 3, 4].map(pair),
    acc: [0, 1, 2, 3, 4].map(function (i) {
      var p = pair(i);
      p.b = 'ACC-' + pad2(i + 1);
      p.bName = '«accessory name»';
      p.bSub = 'CP'; p.bSeason = 'ACC';
      return p;
    }),
    soloReceipts: 0, multiReceipts: 0, accReceipts: 0,
    attachSub: [['TS', 0], ['WP', 0], ['SK', 0], ['WJ', 0], ['SP', 0]],
    byStyle: {},
    img: {},      // partner style code -> product image (data URI or URL)
    lift: {},     // 'reg|Local|STYLE-COLOUR' -> index vs the all-buyer mix
    scope: '«how a combo is defined: two styles on the same receipt, over which weeks ' +
      'and which brands»'
  };

  /* ====================================================================
     THE COPY DECK - every sentence on the page.
     Write the story here; never edit the render script to change wording.
     ================================================================== */
  var copy = {
    tabs: [
      ['01', 'Product &amp; sales'],
      ['02', 'Store performance'],
      ['03', 'Customer &amp; combo'],
      ['04', 'Shop VOC']
    ],

    /* ---- tab 1: product & sales ---- */
    tilesProduct: [
      { k: 'Styles / SKUs', f: '«what the capsule is»' },
      { k: 'Units sold', f: '' },
      { k: 'Sales value', f: 'at tag price' },
      { k: 'Sell-through', f: '' },
      { k: 'Stock on floor', f: '«has the whole buy landed?»' },
      { k: 'Share of «parent category»', f: '«of which universe»' }
    ],
    eyebrowTrend: '',
    trendTitle: '«Weekly sold trend»',
    displayCaption: '&middot; «the collection on the floor»',
    eyebrowStyle: 'By style · sold quantity and sell-through',
    eyebrowColour: 'By colour, by length, by sleeve',
    readProduct: {
      hl: '«One sentence. The single biggest finding of the whole review, with the two ' +
        'figures that prove it in bold.»',
      cols: [
        { h: 'Working', items: ['«the best style, and why»', '«the volume piece»', '«the attribute that wins»'] },
        { h: 'Needs attention', items: ['«what is stuck, and what it is worth»', '«the weakest attribute»', '«the stock position»'] },
        { h: 'Buy signal', items: ['«what to buy deeper»', '«what to cut»', '«what the top SKUs have in common»'] }
      ],
      act: '<b>&lt;&lt;NEXT SEASON&gt;&gt;:</b> «three or four decisions, separated by middots»',
      prov: '«Which file, which columns, which weeks. Name every reconciliation gap here - ' +
        'the item file against the weekly columns, and against the receipt file.»'
    },

    /* ---- tab 2: store performance ---- */
    tilesStore: [
      { k: 'Top door', f: '' },
      { k: 'Top 5 doors', f: 'of collection units' },
      { k: 'Strongest converter', f: '' },
      { k: 'Demand sits', f: '' }
    ],
    /* the store table's column headers. Raw HTML, so <br> works. "base" is the parent
       business the collection is measured against - women's RTW, men's outerwear, ACC... */
    storeTableTitle: 'Store performance',
    storeCols: {
      units: '«Collection» units',
      sales: '«Collection»<br>sales',
      base: '«Base category» sales',
      baseNote: '«collection» slice filled in',
      basePct: '«Base» %<br>of RTW sales',
      pen: '«Collection» %<br>of «base» sales',
      baseRank: '«Base»<br>rank',
      penRank: '«Collection»<br>rank'
    },
    storeCardTitle: '«Which doors work the collection hardest?»',
    storeNotes: [
      { h: '«Key takeaway»', p: '«Does door size buy penetration? Name the biggest door, its rate, ' +
        'and the chain rate. Look every figure up - a hard-coded claim rots the week after.»' },
      { h: '«Where real demand sits»', p: '«The three strongest converters and what they have in common.»' },
      { h: '«Where recoverable volume sits»', p: '«The three weakest, what they hold, and what lifting ' +
        'them to the chain rate would be worth.»' }
    ],
    storeFoot: '«The statistical check: correlation across the doors, and the grouped comparison. ' +
      'Say plainly whether there is a link.»',
    sleeveMixTitle: 'Sleeve mix by door',
    lengthMixTitle: 'Length mix by door',
    readStore: {
      hl: '«One sentence on distribution versus conversion, with the top and bottom rate in bold.»',
      cols: [
        { h: 'Working', items: ['«the leading doors»', '«the productive market»', '«the best converter»'] },
        { h: 'Needs attention', items: ['«the trailing door»', '«the attribute that has not started»', '«the big door on a low rate»'] },
        { h: 'Door read', items: ['«the archetype split»', '«what the local customer buys»', '«size vs penetration»'] }
      ],
      act: '<b>&lt;&lt;NEXT SEASON&gt;&gt;:</b> «how to allocate by door»',
      prov: '«Receipt Line weeks, units, and the gap against the item file - name what the receipt ' +
        'extract does not carry (outlet, airside, e-comm).»'
    },

    /* ---- tab 3: customer & combo ---- */
    tilesCustomer: [
      { k: 'Female', f: '' },
      { k: '', f: '' },
      { k: '', f: '' },
      { k: 'Core age band', f: '«largest single band»' },
      { k: '', f: '«what the size curve says»' },
      { k: 'Units per receipt', f: '' }
    ],
    eyebrowWho: 'Who is buying',
    regionFoot: 'Weekly sales value by region,',
    sizeNotes: [
      { h: '«Is the curve small or large?»', p: '«XS+S as a share of units, against what a standard ' +
        'curve for this category would be.»' },
      { h: '«What moves the curve»', p: '«Compare the curve by length and by region - usually one ' +
        'moves it and the other does not.»' },
      { h: '«What to do with it»', p: '«The buying instruction that follows.»' }
    ],
    eyebrowTop5: 'Top 5 SKUs by segment',
    segCardTitle: '«What each segment actually buys»',
    segFoot: '«Warn the reader that the raw ranking says little if every segment leads with the same ' +
      'styles. The gold flag marks the SKU that over-indexes hardest against the all-buyer mix, ' +
      'which is where the groups actually differ.»',
    eyebrowCombo: 'Buying combo · what else is in the same receipt',
    comboTitle: 'Top 5 buying combos',
    comboSub: '«What the pairings have in common.»',
    insideTitle: 'Inside the collection',
    insideSub: '«Both halves are collection styles - is she building the collection or replacing a basic?»',
    accTitle: 'Collection + accessories',
    accSub: '«Which accessory attaches, and at what rate against the best apparel partner.»',
    attachTitle: 'What gets attached, by sub-category',
    attachRow: 'Attachment mix',
    attachFoot: '«What the mix says about how she shops.»',
    readCustomer: {
      hl: '«One sentence: who she is, in bold percentages, and how she shops.»',
      cols: [
        { h: 'Working', items: ['«the core age band»', '«the basket»', '«the top combo»', '«the accessory attach»'] },
        { h: 'Needs attention', items: ['«the size curve against the buy»', '«the band this range misses»', '«the segment carrying an attribute alone»'] },
        { h: 'How she shops', items: ['«tops with tops, or tops with bottoms»', '«cross-sell inside the collection»', '«repeat buyers»'] }
      ],
      act: '<b>&lt;&lt;NEXT SEASON&gt;&gt;:</b> «curve, merchandising and range decisions»',
      prov: '«Receipt Line weeks and brand scope. State that no member identifiers ship in the file.»'
    },

    /* ---- tab 4: shop VOC ---- */
    tilesVoc: [
      { k: 'VOC week', f: '«the feedback file»' },
      { k: 'Styles covered', f: '«which block of the form»' },
      { k: 'Doors reporting', f: '«the door range»' },
      { k: 'Comments read', f: 'fit · material · design · colour' },
      { k: 'Covered styles’ ST', f: '' },
      { k: 'Their share of sales', f: '«the styles asked about»' }
    ],
    eyebrowVoc: 'Power ranking · shop score against sell-through',
    vocRankTitle: '«How the doors rate the styles they were asked about»',
    vocRankSub: 'Sell-through sits beside the score so you can see where the two disagree — ' +
      'that gap is where the action is.',
    vocHint: 'Click any card for the fit, material, design and colour read behind the score — ' +
      'synthesised from feedback across',
    eyebrowWins: 'Wins and issues',
    vocWinsTitle: 'What the doors love',
    vocIssuesTitle: 'Where it is losing sales',
    readVoc: {
      hl: '«One sentence linking what the doors say to what the numbers do. If they praise the ' +
        'product but it does not sell, say which of the two is wrong.»',
      cols: [
        { h: 'Working', items: ['«the most praised feature»', '«where the fabric lands»', '«what the doors ask for more of»'] },
        { h: 'Fix before «next season»', items: ['«spec fix 1, with the door count»', '«spec fix 2»', '«the size or calendar problem»'] },
        { h: 'Score vs sell-through', items: ['«a style scoring high and selling badly»', '«a style scoring low and selling well»', '«what that disagreement means»'] }
      ],
      act: '<b>&lt;&lt;NEXT SEASON&gt;&gt;:</b> «the spec and calendar decisions»',
      prov: '«Which feedback file, which week, how many doors. Say that the shop score is editorial ' +
        'and that the form carries no rating scale.»'
    }
  };

  return { meta: meta, styles: styles, receipts: receipts, basket: {
    n: 0, upt: 0, atv: 0, collectionUpt: 0, attach: 0,
    multi: {}, repeatCust: 0, custTotal: 0
  }, voc: voc, combos: combos, copy: copy };
};
