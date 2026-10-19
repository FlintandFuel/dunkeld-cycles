import { marked } from 'marked'
import { BASE } from './site'

// Posts are Markdown files in src/content/posts, edited through Pages CMS (see .pages.yml).
const files = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true })

export const AUTHOR = {
  slug: 'cameron-macnair',
  name: 'Cameron MacNair',
  jobTitle: 'Professional Triathlete and Endurance Coach',
  photo: 'cameron-riding.webp',
  photoAlt: 'Cameron MacNair, professional triathlete and endurance coach',
  pinnacleUrl: 'https://pinnacleedgecoaching.co.za/',
  instagramUrl: 'https://www.instagram.com/cameronmacnair/',
  bioShort:
    'Cameron MacNair is a professional triathlete with Springbok colours and a pro podium at IRONMAN 70.3 Mossel Bay. He has coached since 2019 through Pinnacle Edge Coaching.',
  bio: [
    'Cameron grew up racing cross-country mountain bikes around South Africa and took up triathlon in 2017. He now races professionally, with Springbok colours and a podium in the pro category at IRONMAN 70.3 Mossel Bay.',
    'He has coached since 2019 and holds a BA in Sports Development and Management. His athletes range from first-time 10km runners to age-group podium contenders and Comrades finishers.',
    'His articles share the training he’s tested in his own racing.',
  ],
}

const unquote = (v) => v.trim().replace(/^(['"])(.*)\1$/, '$2')

function parseFrontMatter(raw) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  let listKey = null
  for (const line of m[1].split('\n')) {
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && listKey) { data[listKey].push(unquote(item[1])); continue }
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (!kv) continue
    const [, key, val] = kv
    if (val === '') { data[key] = []; listKey = key; continue }
    listKey = null
    if (val.startsWith('[')) data[key] = val.slice(1, -1).split(',').map(unquote).filter(Boolean)
    else if (val === 'true' || val === 'false') data[key] = val === 'true'
    else data[key] = unquote(val)
  }
  return { data, body: m[2] }
}

export const assetUrl = (p = '') =>
  /^https?:/.test(p) ? p : `${BASE}${p.replace(/^\.?\/+/, '')}`

const stripMd = (s) => s.replace(/[#>*_`[\]()!-]/g, ' ')

const allPosts = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw)
    const file = path.split('/').pop().replace(/\.md$/, '')
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const date = String(data.date || file.slice(0, 10)).slice(0, 10)
    const words = stripMd(body).split(/\s+/).filter(Boolean).length
    return {
      slug,
      title: data.title || slug,
      date,
      description: data.description || '',
      image: data.image || '',
      imageAlt: data.image_alt || '',
      tags: data.tags || [],
      published: data.published !== false,
      readingMinutes: Math.max(1, Math.round(words / 200)),
      html: marked.parse(body),
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

// Drafts (published: false) only show in the dev server, so they can be previewed locally.
// VITE_INCLUDE_DRAFTS=true builds them too (used to test the prerender).
const showDrafts = (import.meta.env.DEV && !import.meta.env.SSR) || import.meta.env.VITE_INCLUDE_DRAFTS === 'true'
export const posts = allPosts.filter((p) => p.published || showDrafts)
export const getPost = (slug) => posts.find((p) => p.slug === slug)
export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
