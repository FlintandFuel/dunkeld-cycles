// Production domain. Used for canonical URLs, Open Graph, schema, sitemap and feed.
export const SITE_URL = 'https://www.dunkeldcycles.co.za/'

// Relative in production builds (works on a GitHub Pages sub-path and on the final domain;
// prerendered blog pages add a <base> tag so './' always resolves to the site root).
// '/' only in the dev server, which serves every route from the root.
export const BASE = import.meta.env.DEV && !import.meta.env.SSR ? '/' : './'
