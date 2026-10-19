import { renderToString } from 'react-dom/server'
import Page from './Pages.jsx'

// Used only by scripts/prerender.mjs at build time.
export const render = (route) => renderToString(<Page route={route} />)
export { listRoutes, routeMeta, routePath } from './lib/routes'
export { posts } from './lib/blog'
export { SITE_URL } from './lib/site'
