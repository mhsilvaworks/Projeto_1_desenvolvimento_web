const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE });
    try {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
        await page.goto(url);
        assert.equal(await page.locator('.produto:visible').count(), 3);
        await page.locator('#menu-principal').waitFor({ state: 'visible' });
        assert.equal(await page.locator('.menu-toggle').isVisible(), false);
        for (const faixa of ['2-4', '5-7', '8-11']) {
            await page.getByLabel('Filtrar por idade').selectOption(faixa);
            assert.equal(await page.locator('.produto:visible').count(), 1);
            assert.equal(await page.locator('.produto:visible').getAttribute('data-faixa'), faixa);
            assert.equal(await page.getByRole('status').innerText(), '1 modelo encontrado.');
        }
        await page.getByLabel('Filtrar por idade').selectOption('todos');
        assert.equal(await page.locator('.produto:visible').count(), 3);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.locator('#botaoTopo').waitFor({ state: 'visible' });
        await page.getByRole('button', { name: 'Voltar ao topo' }).click();
        await page.waitForFunction(() => window.scrollY === 0);
        assert.equal(await page.locator('.topo .logo').evaluate(el => el === document.activeElement), true);
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
        if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'desktop.png'), fullPage: true });

        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('#menu-principal').waitFor({ state: 'hidden' });
        const toggle = page.locator('.menu-toggle');
        await toggle.focus();
        await page.keyboard.press('Enter');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('#menu-principal a').first().evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(await toggle.evaluate(el => el === document.activeElement), true);
        await toggle.click();
        await page.getByRole('navigation').getByRole('link', { name: 'Produtos', exact: true }).click();
        await page.locator('#menu-principal').waitFor({ state: 'hidden' });
        assert.equal(await page.locator('#produtos').evaluate(el => el === document.activeElement), true);
        await page.getByLabel('Filtrar por idade').selectOption('5-7');
        assert.equal(await page.locator('.produto:visible').count(), 1);
        for (const width of [390, 320, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'Overflow at ' + width);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => window.scrollTo(0, 0));
        await toggle.click();
        if (process.env.SCREENSHOT_DIR) await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, 'mobile-menu.png'), fullPage: true });
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.locator('#menu-principal').waitFor({ state: 'visible' });
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'smooth');

        const noJs = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
        await noJs.goto(url);
        assert.equal(await noJs.locator('#menu-principal').isVisible(), true);
        assert.equal(await noJs.locator('.produto:visible').count(), 3);
        assert.equal(await noJs.locator('.filtro-modelos').isVisible(), false);
        assert.deepEqual(errors, []);
        console.log('PASS: filtros, menu/teclado/Escape/foco, topo, responsividade 320/390/768/1440, movimento reduzido, fallback sem JS e ausência de erros JS.');
    } finally {
        await browser.close();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
