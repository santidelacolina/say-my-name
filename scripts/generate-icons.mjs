// Genera los PNG de la PWA renderizando public/icons/icon.svg con Chromium (Playwright).
// Uso: npm run icons   (requiere `npx playwright install chromium` la primera vez)
import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';

const src = 'public/icons/icon.svg';
if (!existsSync(src)) throw new Error(`No existe ${src}`);
const svg = readFileSync(src, 'utf8');

// [archivo, tamaño, maskable]. El maskable lleva margen de seguridad del 10% sobre fondo sólido.
const targets = [
  ['icon-192.png', 192, false],
  ['icon-512.png', 512, false],
  ['icon-512-maskable.png', 512, true],
  ['apple-touch-icon.png', 180, false],
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

for (const [name, size, maskable] of targets) {
  const inner = maskable ? Math.round(size * 0.8) : size;
  const bg = maskable ? '#00C2B2' : 'transparent';
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<html><body style="margin:0;width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center">
       <div style="width:${inner}px;height:${inner}px">${svg.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
     </body></html>`,
  );
  await page.screenshot({ path: `public/icons/${name}`, omitBackground: !maskable, clip: { x: 0, y: 0, width: size, height: size } });
  console.log(`✔ ${name}`);
}

await browser.close();
