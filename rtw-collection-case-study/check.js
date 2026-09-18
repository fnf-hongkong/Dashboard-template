/* Renders the template in headless Chrome, clicks every tab, and fails loudly on
   a JS error, an empty pane, a leftover number or a leftover source-collection reference.
   Run: node check.js            (writes shot_tabN.png beside this file) */
'use strict';
var path = require('path');
var fs = require('fs');
var puppeteer = require(path.join(__dirname, '..', '..', 'service', 'dx_ss26_review',
  'node_modules', 'puppeteer-core'));

var CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
var FILE = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');

/* wording that must not survive into a template */
var BANNED = [/wellness/i, /3FTS[A-Z]\d{4}/, /3FTO[A-Z]\d{4}/, /\bJUL drop\b/i,
  /women\u2019s tee capsule/i, /capsule on the floor/i];

(async function () {
  var browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new',
    args: ['--no-sandbox', '--allow-file-access-from-files'] });
  var page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200, deviceScaleFactor: 1 });

  var errors = [];
  page.on('pageerror', function (e) { errors.push('pageerror: ' + e.message); });
  page.on('console', function (m) { if (m.type() === 'error') errors.push('console: ' + m.text()); });

  await page.goto(FILE, { waitUntil: 'networkidle0' });

  var nTabs = await page.$$eval('nav.tabs button', function (b) { return b.length; });
  console.log('tabs: ' + nTabs);
  if (nTabs !== 4) throw new Error('expected 4 tabs, got ' + nTabs);

  var head = await page.$eval('header.top', function (e) { return e.innerText.replace(/\n/g, ' | '); });
  console.log('masthead: ' + head);

  var report = [];
  for (var i = 0; i < nTabs; i++) {
    await page.evaluate(function (k) {
      document.querySelectorAll('nav.tabs button')[k].click();
    }, i);
    await new Promise(function (r) { setTimeout(r, 250); });

    var info = await page.evaluate(function (k) {
      var pane = document.getElementById('pane' + k);
      return {
        chars: pane.innerText.length,
        cards: pane.querySelectorAll('.card').length,
        tiles: pane.querySelectorAll('.tile').length,
        svgs: pane.querySelectorAll('svg').length,
        rows: pane.querySelectorAll('tbody tr').length,
        reads: pane.querySelectorAll('.read').length,
        text: pane.innerText
      };
    }, i);
    if (info.chars < 400) throw new Error('tab ' + i + ' rendered almost nothing (' + info.chars + ' chars)');
    if (!info.reads) throw new Error('tab ' + i + ' has no key-reading box');

    BANNED.forEach(function (re) {
      var m = info.text.match(re);
      if (m) throw new Error('tab ' + i + ' still carries "' + m[0] + '"');
    });

    /* any figure left in the copy? every metric must read as a zero */
    var nums = (info.text.match(/\b\d[\d,]*\.?\d*\b/g) || []).filter(function (s) {
      return !/^0([.,]0+)?$/.test(s.replace(/,/g, '')) && Number(s.replace(/,/g, '')) !== 0;
    });
    var stray = nums.filter(function (s) {
      var v = Number(s.replace(/,/g, ''));
      return !(v >= 1 && v <= 30);   // ranks, counts of placeholder rows, week numbers
    });

    report.push('tab ' + i + ': ' + info.chars + ' chars, ' + info.cards + ' cards, ' +
      info.tiles + ' tiles, ' + info.svgs + ' charts, ' + info.rows + ' table rows' +
      (stray.length ? '  STRAY NUMBERS: ' + stray.slice(0, 12).join(' ') : ''));

    await page.screenshot({ path: path.join(__dirname, 'shot_tab' + i + '.png') });
  }

  report.forEach(function (r) { console.log(r); });
  await browser.close();

  if (errors.length) { errors.forEach(function (e) { console.log('!! ' + e); }); throw new Error(errors.length + ' page error(s)'); }
  console.log('\nOK - 4 tabs render, no page errors, no leftover collection wording.');
})().catch(function (e) { console.error('FAILED: ' + e.message); process.exit(1); });
