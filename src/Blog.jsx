/**
 * Cam's Corner: blog index, single post and author page.
 *
 * These are real URLs, prerendered to static HTML at build time (scripts/prerender.mjs),
 * then hydrated in the browser. Head tags and schema come from lib/routes.js.
 */
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Nav, Footer, FadeUp, PrimaryButton, SecondaryButton, IconArrow, IconInstagram, img, HUBTIGER_BOOKING_URL, stagger, fadeUp } from './App.jsx'
import { AUTHOR, posts, getPost, formatDate, assetUrl } from './lib/blog'
import { BASE } from './lib/site'
import { PATHS, routeMeta } from './lib/routes'

const authorHref = BASE + PATHS.author
const indexHref = BASE + PATHS.index
const postHref = (slug) => BASE + PATHS.post(slug)

// The static HTML already carries the full <head>; in the dev server (no prerender) set the essentials here.
function usePageMeta(route) {
  const { title, description } = routeMeta(route)
  useEffect(() => {
    document.title = title
    document.head.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}

function BlogShell({ children }) {
  return (
    <div className="bg-[#111111] min-h-screen flex flex-col">
      <Nav home={false} />
      <main className="flex-1 pt-[72px] sm:pt-20">{children}</main>
      <Footer />
    </div>
  )
}

function Eyebrow({ children, onNavy = false }) {
  return <span className={`font-display text-sm uppercase tracking-[0.3em] ${onNavy ? "text-white" : "text-lime"}`}>{children}</span>
}

function AuthorPhoto({ className = '' }) {
  return (
    <img
      src={img(AUTHOR.photo)}
      alt={AUTHOR.photoAlt}
      width="1920"
      height="1080"
      loading="lazy"
      className={`object-cover object-[72%_50%] ${className}`}
    />
  )
}

function AuthorBox() {
  return (
    <aside aria-labelledby="author-box-title" className="mt-14 rounded-2xl border border-white/10 bg-charcoal p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <AuthorPhoto className="size-24 sm:size-28 shrink-0 rounded-full border border-white/15" />
        <div>
          <p id="author-box-title" className="font-display text-sm uppercase tracking-[0.25em] text-lime">Written by</p>
          <p className="mt-1 font-display text-3xl font-bold uppercase text-white">{AUTHOR.name}</p>
          <p className="mt-3 text-base leading-relaxed text-white/80">{AUTHOR.bioShort}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-base">
            <a href={authorHref} className="inline-flex min-h-[44px] items-center font-semibold text-lime underline underline-offset-4 hover:text-white">More about Cameron</a>
            <a href={AUTHOR.pinnacleUrl} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center font-semibold text-lime underline underline-offset-4 hover:text-white">Pinnacle Edge Coaching</a>
          </div>
        </div>
      </div>
    </aside>
  )
}

function PostCard({ post }) {
  return (
    <motion.article variants={fadeUp} className="group overflow-hidden rounded-2xl border border-white/10 bg-charcoal transition-colors hover:border-lime/40">
      <a href={postHref(post.slug)} className="block h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={assetUrl(post.image)}
            alt={post.imageAlt}
            width="1600"
            height="900"
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <p className="text-sm text-white/70">
            <time dateTime={post.date}>{formatDate(post.date)}</time> &middot; {post.readingMinutes} min read
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-white group-hover:text-lime transition-colors">{post.title}</h2>
          <p className="mt-3 text-base leading-relaxed text-white/80">{post.description}</p>
        </div>
      </a>
    </motion.article>
  )
}

export function BlogIndex() {
  usePageMeta({ name: 'index' })
  return (
    <BlogShell>
      <section className="relative overflow-hidden bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <FadeUp>
            <Eyebrow onNavy>Cam&apos;s Corner</Eyebrow>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[1.02] text-white">Training Advice</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              Practical advice for riders and multisport athletes, from professional triathlete and endurance coach{' '}
              <a href={authorHref} className="font-semibold text-white underline underline-offset-4 decoration-lime hover:text-lime">Cameron MacNair</a>.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="bg-[#111111] py-16 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          {posts.length ? (
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </motion.div>
          ) : (
            <FadeUp>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-2xl border border-white/10 bg-charcoal overflow-hidden">
                <img src={img('cameron-seated.webp')} alt="Cameron MacNair resting beside his time trial bike after a training session" width="800" height="450" loading="lazy" className="size-full object-cover aspect-[16/10] md:aspect-auto" />
                <div className="p-8 sm:p-10">
                  <h2 className="font-display text-4xl font-bold uppercase leading-tight text-white">Cameron&apos;s first article is on the way</h2>
                  <p className="mt-4 text-lg leading-relaxed text-white/80">
                    Training tips, race preparation and bike advice are coming soon. In the meantime, you can find out more about how Cameron coaches.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <PrimaryButton href={authorHref} external={false}>About Cameron</PrimaryButton>
                  </div>
                </div>
              </div>
            </FadeUp>
          )}
        </div>
      </section>
    </BlogShell>
  )
}

export function PostPage({ slug }) {
  const post = getPost(slug)
  usePageMeta({ name: 'post', slug })

  if (!post) {
    return (
      <BlogShell>
        <section className="bg-navy py-24">
          <div className="mx-auto max-w-[760px] px-6 sm:px-8">
            <h1 className="font-display text-5xl font-bold uppercase text-white">Article not found</h1>
            <p className="mt-4 text-lg text-white/85">That article may have moved or is not published yet.</p>
            <div className="mt-8"><PrimaryButton href={indexHref} external={false}>Back to all articles</PrimaryButton></div>
          </div>
        </section>
      </BlogShell>
    )
  }

  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)
  return (
    <BlogShell>
      <article className="bg-[#111111] py-12 sm:py-20">
        <div className="mx-auto max-w-[760px] px-6 sm:px-8">
          <a href={indexHref} className="inline-flex min-h-[44px] items-center gap-2 text-base font-semibold text-lime hover:text-white">
            <IconArrow className="size-4 rotate-180" /> Back to all articles
          </a>
          {!post.published && (
            <p className="mt-4 rounded-lg border border-lime/50 bg-lime/10 px-4 py-3 text-base text-white">Draft preview. This article is not published on the live site.</p>
          )}
          <header className="mt-6">
            <h1 className="font-display text-4xl sm:text-6xl font-bold uppercase leading-[1.04] text-white">{post.title}</h1>
            <p className="mt-4 text-base text-white/75">
              By <a href={authorHref} className="font-semibold text-white underline underline-offset-4 decoration-lime hover:text-lime">{AUTHOR.name}</a>
              {' '}&middot; <time dateTime={post.date}>{formatDate(post.date)}</time> &middot; {post.readingMinutes} min read
            </p>
          </header>
          <img src={assetUrl(post.image)} alt={post.imageAlt} width="1600" height="900" className="mt-8 w-full aspect-[16/9] rounded-2xl object-cover" />
          <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />

          <div className="mt-12 rounded-2xl bg-navy p-6 sm:p-8">
            <p className="font-display text-2xl font-bold uppercase text-white">Bike due a check?</p>
            <p className="mt-2 text-base leading-relaxed text-white/85">The workshop team at Dunkeld Cycles can look after it before your next ride or race.</p>
            <div className="mt-5 flex flex-wrap gap-4">
              <PrimaryButton href={HUBTIGER_BOOKING_URL}>Book a service</PrimaryButton>
              <SecondaryButton href={BASE + '#workshop'} icon={IconArrow} external={false}>See the workshop</SecondaryButton>
            </div>
          </div>

          <AuthorBox />
        </div>
      </article>

      {more.length > 0 && (
        <section className="bg-charcoal py-16 sm:py-20">
          <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
            <h2 className="font-display text-4xl font-bold uppercase text-white">More from Cameron</h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {more.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}
    </BlogShell>
  )
}

export function AuthorPage() {
  usePageMeta({ name: 'author' })
  return (
    <BlogShell>
      <section className="bg-navy py-16 sm:py-24">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <FadeUp>
            <AuthorPhoto className="w-full max-w-[460px] mx-auto lg:max-w-none aspect-[4/5] rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)]" />
          </FadeUp>
          <FadeUp delay={0.08}>
            <Eyebrow onNavy>{AUTHOR.jobTitle}</Eyebrow>
            <h1 className="mt-3 font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-[1.02] text-white">{AUTHOR.name}</h1>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/85">
              {AUTHOR.bio.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PrimaryButton href={indexHref} external={false}>Read His Training Articles</PrimaryButton>
              <SecondaryButton href={AUTHOR.pinnacleUrl} icon={IconArrow}>Pinnacle Edge Coaching</SecondaryButton>
              <a href={AUTHOR.instagramUrl} target="_blank" rel="noopener" aria-label="Cameron MacNair on Instagram" className="flex size-12 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-lime hover:text-lime">
                <IconInstagram className="size-6" />
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </BlogShell>
  )
}
