// Runs after `vite build`. Renders every blog route to static HTML (dist/<route>/index.html)
// and writes sitemap.xml, feed.xml and robots.txt, so each post has a real, crawlable URL.
import fs from 'node:fs'
import path from 'node:path'
import { createServer } from 'vite'

process.env.NODE_ENV = 'production'

const dist = path.resolve('dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const { render, listRoutes, routeMeta, routePath, posts, SITE_URL } = await vite.ssrLoadModule('/src/entry-server.jsx')

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function setMeta(html, attr, key, value) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`)
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`)
}

function buildPage(route) {
  const meta = routeMeta(route)
  const rel = routePath(route)
  const depth = rel.split('/').filter(Boolean).length
  let html = template

  // Home-page schema (BicycleStore, FAQPage) does not belong on blog pages.
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${meta.canonical}" />`)
  html = setMeta(html, 'name', 'description', meta.description)
  html = setMeta(html, 'property', 'og:title', meta.title)
  html = setMeta(html, 'property', 'og:description', meta.description)
  html = setMeta(html, 'property', 'og:type', meta.type)
  html = setMeta(html, 'property', 'og:url', meta.canonical)
  html = setMeta(html, 'name', 'twitter:title', meta.title)
  html = setMeta(html, 'name', 'twitter:description', meta.description)
  if (meta.image) {
    html = setMeta(html, 'property', 'og:image', meta.image)
    html = setMeta(html, 'name', 'twitter:image', meta.image)
  }
  if (meta.noindex) html = setMeta(html, 'name', 'robots', 'noindex')
  html = html.replace(/<meta name="keywords"[^>]*>\s*/, '')
  if (meta.jsonLd) {
    const ld = JSON.stringify({ '@context': 'https://schema.org', ...meta.jsonLd })
    html = html.replace('</head>', `    <script type="application/ld+json">${ld.replace(/</g, '\\u003c')}</script>\n  </head>`)
  }
  // Relative asset paths (./assets/..., ./images/...) resolve to the site root from any depth.
  html = html.replace('<head>', `<head>\n    <base href="${'../'.repeat(depth)}" />`)
  html = html.replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`)
  return { rel, html }
}

const routes = listRoutes()
for (const route of routes) {
  const { rel, html } = buildPage(route)
  fs.mkdirSync(path.join(dist, rel), { recursive: true })
  fs.writeFileSync(path.join(dist, rel, 'index.html'), html)
}

// Sitemap
const urls = [{ loc: SITE_URL }, ...routes.map((r) => ({
  loc: SITE_URL + routePath(r),
  lastmod: r.name === 'post' ? posts.find((p) => p.slug === r.slug)?.date : undefined,
}))]
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
  `\n</urlset>\n`)

// Atom feed
const updated = posts[0]?.date || new Date().toISOString().slice(0, 10)
fs.writeFileSync(path.join(dist, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n` +
  `  <title>Cam's Corner | Dunkeld Cycles</title>\n  <link href="${SITE_URL}feed.xml" rel="self" />\n  <link href="${SITE_URL}cams-corner/" />\n` +
  `  <id>${SITE_URL}cams-corner/</id>\n  <updated>${updated}T00:00:00Z</updated>\n` +
  posts.map((p) =>
    `  <entry>\n    <title>${esc(p.title)}</title>\n    <link href="${SITE_URL}cams-corner/${p.slug}/" />\n    <id>${SITE_URL}cams-corner/${p.slug}/</id>\n` +
    `    <updated>${p.date}T00:00:00Z</updated>\n    <author><name>Cameron MacNair</name></author>\n    <summary>${esc(p.description)}</summary>\n  </entry>`).join('\n') +
  `\n</feed>\n`)

if (!fs.existsSync(path.join(dist, 'robots.txt'))) {
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`)
}

await vite.close()
console.log(`Prerendered ${routes.length} route(s): ${routes.map(routePath).join(', ')}`)
