import puppeteer from 'puppeteer-core';

const sleep = ms => new Promise(r => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Mozilla Firefox/firefox.exe',
  browser: 'firefox',
  headless: true,
  args: ['--no-remote'],
  protocol: 'webDriverBiDi',
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 900 });
await page.goto('http://localhost:5185/', { waitUntil: 'networkidle0' });
await sleep(1500);

// Navigate wizard
for (let i = 0; i < 20; i++) {
  const hasSheet = await page.$('.sheet-preview');
  if (hasSheet) { console.log('Sheet found!'); break; }

  const clicked = await page.evaluate(() => {
    const cards = document.querySelectorAll('[class*="card"], [class*="template"], [class*="Card"]');
    for (const c of cards) {
      if (c.textContent.includes('Modern')) { c.click(); return 'modern card'; }
    }
    const btns = [...document.querySelectorAll('button')];
    const priorities = ['continue', 'generate', 'create', 'preview', 'next', 'skip'];
    for (const p of priorities) {
      for (const btn of btns) {
        if (btn.textContent.trim().toLowerCase().includes(p)) {
          btn.click();
          return btn.textContent.trim();
        }
      }
    }
    return null;
  });
  console.log(`Click ${i}: ${clicked}`);
  await sleep(800);
}

await sleep(3000);

// Dump page structure
const info = await page.evaluate(() => {
  const pages = document.querySelectorAll('.sheet-preview');
  const result = { pageCount: pages.length, pages: [] };

  pages.forEach((p, i) => {
    const grid = p.querySelector('.sheet-grid');
    const modules = p.querySelectorAll('[data-module-key]');
    const moduleInfo = [];
    modules.forEach(m => {
      const cs = getComputedStyle(m);
      moduleInfo.push({
        key: m.dataset.moduleKey,
        gridRow: `${cs.gridRowStart} / ${cs.gridRowEnd}`,
        gridCol: `${cs.gridColumnStart} / ${cs.gridColumnEnd}`,
        height: m.offsetHeight,
        top: m.offsetTop,
      });
    });

    result.pages.push({
      page: i + 1,
      template: p.dataset.template,
      pageSize: `${p.offsetWidth}x${p.offsetHeight}`,
      gridSize: grid ? `${grid.offsetWidth}x${grid.offsetHeight}` : 'NO GRID',
      gridInlineRows: grid?.style.gridTemplateRows?.substring(0, 300) || 'none',
      gridComputedRows: (grid ? getComputedStyle(grid).gridTemplateRows : '').substring(0, 400),
      moduleCount: modules.length,
      modules: moduleInfo,
    });
  });

  return result;
});

console.log(JSON.stringify(info, null, 2));

await page.screenshot({ path: 'C:/Temp/Sheetlab/firefox-screenshot.png', fullPage: true });
console.log('Screenshot saved');

try {
  await page.pdf({
    path: 'C:/Temp/Sheetlab/firefox-print.pdf',
    format: 'A4',
    margin: { top: '8mm', bottom: '8mm', left: '0', right: '0' },
    printBackground: true,
  });
  console.log('PDF saved');
} catch(e) {
  console.log('PDF error:', e.message);
}

await browser.close();
