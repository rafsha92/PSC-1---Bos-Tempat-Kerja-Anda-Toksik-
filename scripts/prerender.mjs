import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer, loadEnv } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const env = loadEnv('production', root, '');
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : '';
const configuredUrl = process.env.SITE_URL || env.SITE_URL || env.VITE_SITE_URL || vercelUrl;

function normalizeSiteUrl(value) {
  if (!value) return '';
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('SITE_URL must use http or https.');
  return url.href.replace(/\/$/, '');
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

const siteUrl = normalizeSiteUrl(configuredUrl);
const vite = await createServer({
  root,
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const appHtml = renderToString(
    React.createElement(StrictMode, null, React.createElement(App, { siteUrl })),
  );
  const indexPath = path.join(dist, 'index.html');
  let html = await readFile(indexPath, 'utf8');

  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  const canonical = siteUrl ? `${siteUrl}/` : '/';
  html = html.replace(
    /(<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"\s*\/>)/,
    `$1\n    <link rel="canonical" href="${canonical}" />`,
  );

  if (siteUrl) {
    html = html
      .replace('data-site-url=""', `data-site-url="${siteUrl}"`)
      .replace(/(<meta property="og:type" content="website"\s*\/>)/, `$1\n    <meta property="og:url" content="${canonical}" />`)
      .replaceAll('content="/og.jpg"', `content="${siteUrl}/og.jpg"`);

    const today = new Date().toISOString().slice(0, 10);
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${escapeXml(canonical)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`;
    await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
    await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${canonical}sitemap.xml\n`);
  }

  await writeFile(indexPath, html);
  console.log(`Prerendered homepage${siteUrl ? ` for ${siteUrl}` : ' with deployment-neutral URLs'}.`);
} finally {
  await vite.close();
}
