import { AUTHOR, posts, getPost } from './blog'
import { SITE_URL } from './site'

// Route paths are relative to the site root, with a trailing slash.
export const PATHS = {
  index: 'cams-corner/',
  author: `authors/${AUTHOR.slug}/`,
  post: (slug) => `cams-corner/${slug}/`,
}

export function matchRoute(rel = '') {
  const p = rel.replace(/^\/+/, '')
  if (/^cams-corner\/?$/.test(p)) return { name: 'index' }
  const post = p.match(/^cams-corner\/([^/]+)\/?$/)
  if (post) return { name: 'post', slug: decodeURIComponent(post[1]) }
  if (p === `authors/${AUTHOR.slug}` || p === PATHS.author) return { name: 'author' }
  return { name: 'home' }
}

export const routePath = (route) =>
  route.name === 'index' ? PATHS.index : route.name === 'author' ? PATHS.author : route.name === 'post' ? PATHS.post(route.slug) : ''

export const absoluteUrl = (p = '') => (/^https?:/.test(p) ? p : SITE_URL + p.replace(/^\.?\/+/, ''))

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Dunkeld Cycles',
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}images/logo-main.png` },
}

// Everything that goes in <head> for a blog route. Used by the prerender script and, in dev, by the client.
export function routeMeta(route) {
  const canonical = SITE_URL + routePath(route)
  if (route.name === 'index') {
    return {
      title: "Training Advice from Cameron MacNair | Cam's Corner | Dunkeld Cycles",
      description: 'Practical training and race preparation advice from professional triathlete and endurance coach Cameron MacNair, brought to you by Dunkeld Cycles in Johannesburg.',
      image: absoluteUrl('images/cameron-seated.webp'),
      canonical,
      type: 'website',
    }
  }
  if (route.name === 'author') {
    return {
      title: `${AUTHOR.name}, Professional Triathlete and Endurance Coach | Dunkeld Cycles`,
      description: 'Meet Cameron MacNair, professional triathlete and endurance coach at Pinnacle Edge Coaching, and read his training advice in Cam’s Corner.',
      image: absoluteUrl(`images/${AUTHOR.photo}`),
      canonical,
      type: 'profile',
      jsonLd: {
        '@type': 'Person',
        name: AUTHOR.name,
        jobTitle: AUTHOR.jobTitle,
        url: canonical,
        image: absoluteUrl(`images/${AUTHOR.photo}`),
        sameAs: [AUTHOR.pinnacleUrl, AUTHOR.instagramUrl],
      },
    }
  }
  const post = getPost(route.slug)
  if (!post) {
    return { title: 'Article not found | Dunkeld Cycles', description: "We couldn't find that article.", canonical, type: 'website', noindex: true }
  }
  return {
    title: `${post.title} | Cam's Corner | Dunkeld Cycles`,
    description: post.description,
    image: absoluteUrl(post.image),
    canonical,
    type: 'article',
    jsonLd: {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.date,
      image: absoluteUrl(post.image),
      mainEntityOfPage: canonical,
      author: { '@type': 'Person', name: AUTHOR.name, url: SITE_URL + PATHS.author },
      publisher: PUBLISHER,
    },
  }
}

export const listRoutes = () => [
  { name: 'index' },
  { name: 'author' },
  ...posts.map((p) => ({ name: 'post', slug: p.slug })),
]
