import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import Page from './Pages.jsx'
import { matchRoute } from './lib/routes'
import { BASE } from './lib/site'

// Blog pages are real URLs (/cams-corner/, /cams-corner/<slug>/, /authors/cameron-macnair/),
// prerendered at build time. Anything else is the home page.
const rootPath = new URL(BASE, document.baseURI).pathname
const route = matchRoute(decodeURIComponent(window.location.pathname).slice(rootPath.length))

if (route.name === 'home' && window.location.hash.length > 1) {
  // Arriving from a blog page at /#about: scroll once the page has rendered.
  setTimeout(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView(), 50)
}

const tree = (
  <StrictMode>
    <Page route={route} />
  </StrictMode>
)
const rootEl = document.getElementById('root')
if (rootEl.hasChildNodes()) hydrateRoot(rootEl, tree)
else createRoot(rootEl).render(tree)
