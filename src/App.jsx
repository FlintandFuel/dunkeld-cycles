/**
 * DUNKELD CYCLES — landing page
 *
 * Positioning angle: credibility-first trust, not last-minute convenience —
 * Johannesburg's trusted bicycle workshop & bike shop, led by William and a
 * committed team. Dark editorial aesthetic breaks entirely from the
 * white-background LBS norm.
 *
 * Top trust signals: 4.8 rating from 117+ named Google reviews, authorised
 * Trek & Scott dealer (while servicing every brand), 20 years trading,
 * SMS/WhatsApp updates at every step of a service.
 *
 * Note: review count is kept qualitative ("117+ reviews") rather than citing
 * small specific numbers (e.g. "14 reviews"), which read as underwhelming.
 *
 * Primary CTA rationale: "Book a Service" via WhatsApp — mirrors how William
 * actually operates (reviews confirm he replies personally), removing the
 * friction of a form. Office phone 011 341 0627 as secondary contact channel.
 *
 * Font pairing: Barlow Condensed (display) — race-poster boldness echoing bib
 * numbers and team-kit typography. DM Sans (body) — warm, legible, 18px.
 *
 * Accent colour: #73b845 (lime). Used surgically — primary CTA backgrounds
 * (near-black text #102008 for AA contrast), section labels, quote marks,
 * neon button lines, spotlight card hover glow. Restricted to large text on
 * navy (#1e3e84) backgrounds (4:1 contrast ratio); safe for any size on
 * near-black (#111111, 7.4:1).
 */

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion'
import './index.css'

const img = (filename) => `${import.meta.env.BASE_URL}images/${filename}`

const WHATSAPP_NUMBER = '27810186912'
const PHONE = '0113410627'
const HUBTIGER_BOOKING_URL = 'https://bookings.hubtiger.com/bikes?shop=HUB.96D2C6B5A5484DDAAF1BE5618670D0AA60E5EE7213C748BEAF249FFF49BB704F.TIGER&lang=en'
const waLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const NAV_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Workshop', href: '#workshop' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'The Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

// ─── Motion presets ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

function FadeUp({ children, delay = 0, className = '' }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}

// Spotlight card — mouse-tracked radial glow on border and surface
function SpotlightCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const [pos, setPos] = useState({ x: -9999, y: -9999 })
  const [active, setActive] = useState(false)

  const onMouseMove = (e) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => { setActive(false); setPos({ x: -9999, y: -9999 }) }}
      style={{
        border: `1px solid ${active ? 'rgba(115,184,69,0.35)' : 'rgba(255,255,255,0.1)'}`,
        transition: 'border-color 0.3s',
      }}
      className={`group relative rounded-2xl overflow-hidden ${className}`}
    >
      {/* Spotlight surface glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: active
            ? `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(115,184,69,0.1), transparent 70%)`
            : 'transparent',
          transition: 'background 0.2s',
          pointerEvents: 'none',
          zIndex: 0,
          borderRadius: 'inherit',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function IconWhatsApp(props) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.04 3C9.4 3 4 8.36 4 15c0 2.34.66 4.53 1.8 6.4L4 29l7.78-1.74A11.9 11.9 0 0 0 16.04 27C22.68 27 28 21.64 28 15S22.68 3 16.04 3zm0 21.6c-1.96 0-3.84-.55-5.46-1.5l-.39-.23-4.62 1.03 1.06-4.5-.25-.41A9.46 9.46 0 0 1 6.5 15c0-5.27 4.3-9.55 9.54-9.55 5.25 0 9.54 4.28 9.54 9.55 0 5.26-4.29 9.6-9.54 9.6zm5.27-7.13c-.29-.15-1.7-.84-1.97-.93-.27-.1-.46-.15-.65.14-.2.3-.75.93-.92 1.12-.17.2-.34.22-.63.08-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-1.99-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.65-1.57-.9-2.15-.24-.57-.48-.49-.65-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3 .15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.7-.7 1.94-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.56-.34z" />
    </svg>
  )
}
function IconPhone(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2z" />
    </svg>
  )
}
function IconArrow(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}
function IconStar(props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M10 1.5l2.6 5.45 5.9.79-4.27 4.2 1.04 5.93L10 15.06l-5.27 2.81 1.04-5.93-4.27-4.2 5.9-.79z" />
    </svg>
  )
}
function IconQuote(props) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M2 24V14.6C2 6.8 6.6 1.4 14.4 0l1.7 3.6C10.7 5 8.3 8 8.1 12h6.3v12H2zm17.5 0V14.6c0-7.8 4.6-13.2 12.4-14.6L33.6 3.6C28.2 5 25.8 8 25.6 12h6.3v12H19.5z" />
    </svg>
  )
}
function IconPin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function IconClock(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" />
    </svg>
  )
}
function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" {...props}>
      <path d="M16 3h-2.5A4.5 4.5 0 0 0 9 7.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7.8c0-.97.78-1.55 1.7-1.55H16z" />
    </svg>
  )
}
function IconChevron(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

// ─── Buttons with neon border animation ─────────────────────────────────────
function PrimaryButton({ href, onClick, children, className = '' }) {
  const Tag = href ? 'a' : 'button'
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick }
  return (
    <Tag
      {...linkProps}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-lime px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-[#102008] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(115,184,69,0.5)] ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
      <span className="absolute inset-x-0 bottom-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" aria-hidden="true" />
      <span className="relative flex items-center gap-2">
        {children}
        <IconArrow className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Tag>
  )
}

function SecondaryButton({ href, onClick, children, className = '', icon: Icon = IconWhatsApp, external = true }) {
  const Tag = href ? 'a' : 'button'
  const linkProps = href ? { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : { onClick }
  return (
    <Tag
      {...linkProps}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/5 px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors duration-200 hover:border-lime/50 hover:text-lime ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
      <span className="absolute inset-x-0 bottom-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" aria-hidden="true" />
      <span className="relative flex items-center gap-2">
        <Icon className="size-5" />
        {children}
      </span>
    </Tag>
  )
}

// ─── Nav ────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#111111]/92 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.4)]' : 'bg-transparent'}`}>
      <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 sm:px-8 h-[72px] sm:h-20">
        <a href="#top" className="shrink-0" aria-label="Dunkeld Cycles, home">
          <img
            src={img('logo-main.png')}
            alt="Dunkeld Cycles"
            className="h-[56px] sm:h-[68px] max-h-[80px] w-auto"
          />
        </a>

        <div className="hidden min-[1100px]:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="font-display text-lg uppercase tracking-wider text-white/80 transition-colors hover:text-lime">
              {link.label}
            </a>
          ))}
          <a
            href={HUBTIGER_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-lime px-5 py-2.5 min-h-[40px] font-display text-sm font-semibold uppercase tracking-wide text-[#102008] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
            <span className="relative">Book Your Bike In</span>
          </a>
        </div>

        <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="min-[1100px]:hidden flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="size-5"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[60] flex flex-col bg-[#0d1a3a] min-[1100px]:hidden">
            <div className="flex items-center justify-between px-6 h-[72px]">
              <img src={img('logo-main.png')} alt="Dunkeld Cycles" className="h-[52px] w-auto" />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" className="size-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
              {NAV_LINKS.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setOpen(false)} className="font-display text-4xl uppercase tracking-wide text-white hover:text-lime transition-colors">{link.label}</a>
              ))}
              <a href={HUBTIGER_BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center justify-center min-h-[44px] rounded-full bg-lime px-8 py-4 font-display text-xl font-semibold uppercase tracking-wide text-[#102008]">
                Book Your Bike In
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), { stiffness: 90, damping: 28 })
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [5, -5]), { stiffness: 90, damping: 28 })
  const glareX = useTransform(mouseX, [0, 1], [15, 85])
  const glareY = useTransform(mouseY, [0, 1], [15, 85])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.06) 0%, transparent 55%)`

  const handleMouseMove = (e) => {
    if (reduced || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }
  const handleMouseLeave = () => { mouseX.set(0.5); mouseY.set(0.5) }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#111111] pt-[72px] sm:pt-20"
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-[700px] w-[700px] rounded-full bg-navy/20 blur-[130px]" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-16 sm:px-8 lg:py-24 grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
        <div>
          <FadeUp>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-[4.2rem] xl:text-6xl font-bold uppercase leading-[0.98] tracking-tight text-white">
              From first rides to race day, we've got you covered
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-5 max-w-xl text-lg sm:text-xl leading-relaxed text-white/80">
              Advice and expert care for every bike. Authorised Trek and Scott dealer. We service
              every brand.
            </p>
          </FadeUp>
          <FadeUp delay={0.22}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <PrimaryButton href={HUBTIGER_BOOKING_URL}>
                Book a Service
              </PrimaryButton>
              <SecondaryButton href={`tel:${PHONE}`} icon={IconPhone} external={false}>
                Call Us
              </SecondaryButton>
            </div>
          </FadeUp>
          <FadeUp delay={0.28}>
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                No. 10, Dunkeld West Shopping Centre<br />
                011 341 0627
              </p>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Instagram" className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/30 text-white hover:text-lime hover:border-lime/50 transition-colors">
                  <IconInstagram className="size-6" />
                </a>
                <a href="https://www.facebook.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Follow on Facebook" className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/30 text-white hover:text-lime hover:border-lime/50 transition-colors">
                  <IconFacebook className="size-6" />
                </a>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* 3D floating image — desktop */}
        <div className="hidden lg:block">
          <motion.div
            style={{
              rotateX: reduced ? 0 : rotateX,
              rotateY: reduced ? 0 : rotateY,
              transformPerspective: 1300,
            }}
            className="relative overflow-hidden rounded-2xl shadow-[0_48px_96px_-24px_rgba(0,0,0,0.75)]"
          >
            <img
              src={img('hero1.webp')}
              alt="Dunkeld Cycles shop entrance on Jan Smuts Avenue, Dunkeld West"
              className="w-full aspect-[4/3] object-cover block"
              draggable={false}
            />
            {/* Glare highlight that tracks mouse */}
            <motion.div style={{ background: glare }} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
            {/* Bottom fade into page background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/40 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Image — mobile (no 3D, stacks below text) */}
        <div className="lg:hidden group overflow-hidden rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
          <img src={img('hero1.webp')} alt="Dunkeld Cycles shop entrance" className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      </div>

      <motion.div animate={reduced ? {} : { y: [0, 7, 0] }} transition={reduced ? {} : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/35" aria-hidden="true">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-8 w-px bg-white/25" />
      </motion.div>
    </section>
  )
}

// ─── Featured review (replaces trust bar) ───────────────────────────────────
function FeaturedReview() {
  return (
    <section className="bg-[#111111] py-14 sm:py-16 border-y border-white/10">
      <div className="mx-auto max-w-[860px] px-6 sm:px-8 text-center">
        {/* Entrance shot — pairs with the hero's interior shot so prospects see both inside and outside before the testimonial */}
        <div className="mb-8 -mt-2 overflow-hidden rounded-xl shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
          <img src={img('entrance1.webp')} alt="Dunkeld Cycles shop entrance" className="w-full aspect-[16/9] object-cover" />
        </div>
        <FadeUp>
          <div className="flex items-center justify-center gap-1.5 text-lime mb-5" aria-label="Five star Google review">
            {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="size-5" />)}
            <span className="ml-2 text-sm font-semibold text-white/60 uppercase tracking-wider">4.8 &middot; 117+ Google reviews</span>
          </div>
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase leading-[1.15] tracking-wide text-white">
            "He saved my day, my Race to the Sun and my marriage. Thanks William. You are a legend."
          </blockquote>
          <p className="mt-4 text-base text-white/55">Nasr Gie</p>
          <div className="mt-8">
            <PrimaryButton href={HUBTIGER_BOOKING_URL}>
              Book Your Bike In
            </PrimaryButton>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── About Us (merged "The Shop" + William's note) ──────────────────────────
function AboutUs() {
  return (
    <section id="about" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div>
            <FadeUp>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">About Us</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
                Built on relationships,<br />not just repairs
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                Dunkeld Cycles has been Johannesburg's go-to bike shop for close to twenty years.
                We're an authorised Trek and Scott dealer for new bikes, but the workshop services
                every brand that rolls through the door, from a child's first bicycle to a carbon
                race machine.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Looking for something specific that is not on the floor? The team can source any
                brand of bicycle for you, and can also facilitate a trade-in on your current bike.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="mt-6 flex flex-wrap items-center gap-8">
                <img src={img('Trek_Logo.png')} alt="Trek" className="h-[100px] w-auto brightness-0 invert" />
                <img src={img('scott-logo.png')} alt="Scott" className="h-[100px] w-auto brightness-0 invert" />
              </div>
              <div className="mt-4">
                <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'm looking for a bike — can you help?")}>
                  Enquire About A Bike
                </PrimaryButton>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.08}>
            <div className="grid grid-cols-2 gap-3">
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('about-trek2.webp')} alt="Trek bikes on the shop floor" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('about-scott1.webp')} alt="Scott bikes on the shop floor" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('about3.webp')} alt="Full bike range at Dunkeld Cycles" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('about4.webp')} alt="Kids bikes at Dunkeld Cycles" className="w-full aspect-square object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
          </FadeUp>
        </div>

        {/* William's note + Friday ride — moved here from the old "Meet the Team" section */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start border-t border-white/10 pt-14 lg:pt-20">
          <FadeUp>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)] sm:max-w-[50%] sm:mx-auto lg:max-w-none lg:mx-0">
              <img
                src={img('william.png')}
                alt="William, owner of Dunkeld Cycles"
                className="w-full aspect-[4/5] object-cover object-top"
              />
            </div>
          </FadeUp>

          <div>
            <FadeUp delay={0.08}>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Meet William</span>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                William has been riding competitively since a very young age, building a
                successful career as a professional road and track cyclist. After an injury
                forced him to retire from racing, he channelled his lifelong passion for cycling
                into helping others. Today, he combines his extensive experience and technical
                expertise to provide exceptional bike servicing and support, ensuring every rider
                and every bike performs at its best.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                The team is hands-on, committed, and go out of their way for whatever your bike
                specifically needs. No cookie-cutter service, no shortcuts.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Fancy a ride? Join the Friday morning club ride, 5am from the shop, open to all riders, no drop. Contact William to join the WhatsApp Ride Group.
              </p>
            </FadeUp>
          </div>
        </div>

        {/* Optional "cute" close — client-approved, kept short and at the very end */}
        <FadeUp delay={0.1} className="mt-14 lg:mt-16">
          <p className="max-w-2xl text-lg sm:text-xl italic leading-relaxed text-white/70">
            Has your bike been sitting in a garage for three years? Racing in four days? Bought a
            second-hand bike? Just reached your 3,000km milestone? If yes, it may be time to book
            a service with Dunkeld Cycles.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Our Workshop (confirmed direction — replaces "Six Ways to Get You Back on the Bike") ──
const SERVICE_CATEGORIES = [
  {
    title: 'Servicing',
    items: ['Wash, Lube & Polish', 'Standard Service', 'Major Service', 'Full Service — Road HT/RD', 'Full Service — Dual Suspension / TT', "Kids' Bike Servicing (Standard & Gears)"],
  },
  {
    title: 'Wheels & Components',
    items: ['Wheel Building & Truing', 'Wheel Balancing', 'Wheel Hub Service', 'Bottom Bracket & Headset Service'],
  },
  {
    title: 'Suspension',
    items: ['Fork/Shox Servicing — full strip, clean, inspection & rebuild, in-house'],
  },
  {
    title: 'Builds',
    items: ['Semi-Assembled & New Bike Builds'],
  },
  {
    title: 'Transport & Travel',
    items: [
      'Bike Boxing: for travelling with or shipping a bike (race travel, relocations and more)',
      'Courier Service: local collection and delivery of your bike',
    ],
  },
  {
    items: [
      <>Indoor bike trainer service with <a href="tel:+27825697634" className="underline hover:text-lime transition-colors">Ruan</a>.</>,
      'Trade-in facilitation.',
      'Pickup & delivery available (cost applies).',
    ],
  },
]

function Workshop() {
  return (
    <section id="workshop" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">What We Do</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            Our Workshop
          </h2>
          <p className="mt-3 max-w-2xl text-xl sm:text-2xl font-display uppercase tracking-wide text-white/90">
            Knows exactly what you need
          </p>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Every bike gets a hands-on assessment from an experienced mechanic, so you know
            exactly what is needed, and the cost, before any work begins. A quick tune-up or a full
            rebuild, you will know what's happening. Every bike gets a quality check before you
            get your bike back.
          </p>
        </FadeUp>

        {/* 2-col sticky-scroll layout — photo strip stays, category cards slide past as you scroll */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-10 items-start">
          {/* Sticky workshop photos */}
          <div className="hidden lg:block sticky top-[92px] space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_56px_rgba(0,0,0,0.45)]">
              <img src={img('service-2.png')} alt="Bike service in progress at Dunkeld Cycles workshop" className="w-full h-auto object-cover object-top" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img src={img('what-we-do1.webp')} alt="Mechanic working on a bike in the Dunkeld Cycles workshop" className="w-full aspect-square object-cover" />
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img src={img('workshop2.webp')} alt="Workshop mechanic with a finished bike" className="w-full aspect-square object-cover" />
              </div>
            </div>
          </div>

          {/* Mobile photos (non-sticky) */}
          <div className="lg:hidden grid grid-cols-2 gap-3">
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img src={img('service-2.png')} alt="Dunkeld Cycles workshop" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <img src={img('workshop3.webp')} alt="Hands-on bike service in progress" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Category cards — each animates in independently as it scrolls into view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICE_CATEGORIES.map((category, i) => (
              <FadeUp key={category.title || i} delay={i < 2 ? i * 0.08 : 0} className={category.items.length === 1 ? 'sm:col-span-1' : ''}>
                <SpotlightCard className="h-full">
                  <div className="h-full bg-white/[0.06] p-7 sm:p-8 rounded-2xl">
                    {category.title && <h3 className="font-display text-2xl uppercase tracking-wide text-white">{category.title}</h3>}
                    <ul className={`space-y-1.5 text-base leading-relaxed text-white/70 ${category.title ? 'mt-3' : ''}`}>
                      {category.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-lime">&bull;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.1} className="mt-10">
          <p className="text-lg leading-relaxed text-white/75 lg:whitespace-nowrap">
            Every service ends with a test ride, our two-step quality check before your bike is ready for collection.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-10 flex justify-center">
          <PrimaryButton href={HUBTIGER_BOOKING_URL}>
            Book Your Bike In
          </PrimaryButton>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Bike Fit / Cycle-It ────────────────────────────────────────────────────
function BikeFit() {
  return (
    <section className="relative bg-[#111111] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
          <FadeUp>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Bike Fitting</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold uppercase leading-[1.02] text-white">
              Your perfect position,<br />dialled in
            </h2>
            <div className="mt-6 group overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_56px_rgba(0,0,0,0.45)] sm:max-w-[50%] sm:mx-auto lg:max-w-none lg:mx-0">
              <img src={img('cycle-it.JPG')} alt="Professional bike fitting session at Dunkeld Cycles" className="w-full aspect-[1/1] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-lg leading-relaxed text-white/80">
              A proper bike fit changes everything. Less pain, more power, and the kind of comfort that lets you ride longer and harder. Dunkeld Cycles partners with <a href="https://cycleit.co.za/" target="_blank" rel="noopener noreferrer" className="underline hover:text-lime transition-colors">Cycle-It Service and Fitting</a> to offer professional bike fitting conveniently in store.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Whether you have just bought a new bike or want to get more out of the one you ride, a fit session is often the best upgrade you can make.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a href="https://cycleit.co.za/" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#FF9B19] px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-[#102008] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(255,155,25,0.5)]">
                <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <span className="relative flex items-center gap-2">
                  Book A Fit
                  <IconArrow className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
            </div>
            <a href="https://cycleit.co.za/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block">
              <img src={img('cycle-it-logo.png')} alt="Cycle-It" className="h-[100px] w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Gear & Accessories ─────────────────────────────────────────────────────
function GearAccessories() {
  const items = [
    { src: 'gear.webp', alt: 'Helmets from leading brands', label: 'Helmets' },
    { src: 'shoes.webp', alt: 'Cycling shoes from Lake, Specialized and more', label: 'Shoes' },
    { src: 'parts1.webp', alt: 'Parts and accessories wall', label: 'Parts' },
    { src: 'accessories2.webp', alt: 'Chain lubes, sealants and maintenance products', label: 'Maintenance' },
    { src: 'accessories3.webp', alt: 'Bags, packs and cycling storage', label: 'Storage' },
    { src: 'nutrition.webp', alt: 'Race-day nutrition and recovery products', label: 'Nutrition' },
    { src: 'bike-racks1.webp', alt: 'Bike racks for car and home', label: 'Bike Racks' },
    { src: 'clothing1.webp', alt: 'Cycling clothing and apparel', label: 'Clothing' },
    { src: 'gear1-kids-bikes.webp', alt: 'Kids bikes and accessories', label: 'Kids Bikes' },
  ]

  return (
    <section className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Gear & Accessories</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            Everything under one roof
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Helmets, shoes, bike racks, clothing, bags, chain lube, sealant, nutrition, race-day fuel and everything in between. If it goes on the bike or on the rider, it is available.
          </p>
        </FadeUp>

        {/* TODO: this section's photos are flagged by the client as needing replacement — swap for new photography once shot */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item) => (
            <motion.div key={item.label} variants={fadeUp}>
              <div className="group overflow-hidden rounded-2xl border border-white/10">
                <div className="relative">
                  <img src={img(item.src)} alt={item.alt} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-3 left-3 font-display text-base uppercase tracking-wider text-white">{item.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.1} className="mt-10 flex justify-center">
          <PrimaryButton href={waLink('Hi Dunkeld Cycles, quick question about gear and accessories.')}>
            Ask Us What&apos;s In Stock
          </PrimaryButton>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Our Brands ──────────────────────────────────────────────────────────────
const GEAR_BRANDS = [
  { src: 'thule-logo.svg', alt: 'Thule' },
  { src: 'wahoo-logo.png', alt: 'Wahoo' },
  { src: 'garmin-logo.png', alt: 'Garmin' },
  { src: 'tririg-logo.png', alt: 'TriRig' },
  { src: 'rapha-logo.png', alt: 'Rapha' },
  { src: 'oakley-logo.png', alt: 'Oakley' },
]

function OurBrands() {
  return (
    <section className="relative bg-[#111111] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Our Brands</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            New bikes, from names you trust
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Authorised Trek and Scott dealer. Walk in unsure, ride out on the right bike for you.
          </p>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-x-16 gap-y-10">
            <img src={img('Trek_Logo.png')} alt="Trek" className="h-[360px] w-auto brightness-0 invert" />
            <img src={img('scott-logo.png')} alt="Scott" className="h-[360px] w-auto brightness-0 invert" />
          </div>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-10 flex justify-center sm:justify-start">
          <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'm looking for a new bike — can you help?")}>
            Enquire About A Bike
          </PrimaryButton>
        </FadeUp>

        <div className="mt-16 lg:mt-20 border-t border-white/10 pt-14 lg:pt-16">
          <FadeUp>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Gear</span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-[1.02] text-white">
              Brands to enhance your ride
            </h3>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="mt-10 flex flex-wrap items-center gap-x-12 gap-y-8">
              {GEAR_BRANDS.map((brand) => (
                <img key={brand.alt} src={img(brand.src)} alt={brand.alt} className="h-[50px] w-auto brightness-0 invert" />
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Why Riders Choose Us ────────────────────────────────────────────────────
const WHY_CHOOSE_US = [
  'Qualified, experienced mechanics',
  'Practical advice, no unnecessary repairs',
  'Premium brands, every discipline serviced',
  'Personal service',
  'Family-owned and run since 2019',
  'A combined 205 years of cycling and workshop experience',
]

function WhyChooseUs() {
  return (
    <section className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Why Riders Choose Us</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            What sets the shop apart
          </h2>
        </FadeUp>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {WHY_CHOOSE_US.map((reason) => (
            <motion.li key={reason} variants={fadeUp} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <IconStar className="size-5 shrink-0 text-lime mt-0.5" />
              <span className="text-lg text-white/85">{reason}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

// ─── How It Works ────────────────────────────────────────────────────────────
const HOW_IT_WORKS_STEPS = [
  {
    n: '01',
    title: 'Book In',
    text: (
      <>
        <a href={HUBTIGER_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="text-lime underline hover:text-white transition-colors">Click here to book</a>
        <br />
        Message us on WhatsApp or call to lock in a slot.
      </>
    ),
  },
  { n: '02', title: 'We Assess', text: 'A mechanic inspects your bike and we assess exactly what is needed.' },
  { n: '03', title: 'We Contact You', text: "We message before any extra work, so there's never a surprise on collection." },
  { n: '04', title: 'Service & Quality Check', text: 'The work gets done, then every bike is quality checked.' },
  { n: '05', title: 'Collect & Ride', text: "We'll message you the moment it's ready to collect." },
]

function HowItWorks() {
  return (
    <section className="relative bg-[#111111] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">How It Works</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            From drop-off to ride-off
          </h2>
        </FadeUp>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {HOW_IT_WORKS_STEPS.map((step) => (
            <motion.div key={step.n} variants={fadeUp}>
              <span className="font-display text-sm tracking-[0.25em] text-lime">{step.n}</span>
              <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-white">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-white/70">{step.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.1} className="mt-10 flex justify-center">
          <PrimaryButton href={HUBTIGER_BOOKING_URL}>
            Ready To Get Back On Your Bike? Book A Service
          </PrimaryButton>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Coffee Bar ─────────────────────────────────────────────────────────────
function CoffeeBar() {
  return (
    <section className="relative bg-lime py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
          <FadeUp>
            <div className="group overflow-hidden rounded-2xl border border-black/10 shadow-[0_24px_56px_rgba(0,0,0,0.25)] sm:max-w-[50%] sm:mx-auto lg:max-w-none lg:mx-0">
              <img src={img('coffee1.webp')} alt="Fresh coffee being made at the Dunkeld Cycles coffee bar" className="w-full aspect-[1/1] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-[#102008]">The Coffee Bar</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold uppercase leading-[1.02] text-[#102008]">
              Grab a coffee<br />Stay a while
            </h2>
            <p className="mt-5 text-lg font-medium leading-relaxed text-[#102008]/80">
              Drop your bike off, or just drop in. Grab a coffee at the counter, find a seat, and enjoy the kind of conversations that only happen when riders get together.
            </p>
            <p className="mt-4 text-lg font-medium leading-relaxed text-[#102008]/80">
              We're a bike shop with a quiet coffee corner, not a busy coffee shop with a bike corner. So swap ride stories, plan the next route, or just take a break from Jan Smuts Avenue.
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Social proof ────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "I left feeling confident, valued, and ready for race day. 100% recommend, they're the only shop I'll ever trust with my bikes.",
    name: 'Cobus Rautenbach',
    context: 'Drove from Secunda for a pre-Ironman 70.3 Mossel Bay service',
  },
  {
    quote: 'William goes above and beyond to keep customers happy. Attention all cyclists: do yourself a favour and treat your bike to a service at Dunkeld Cycles.',
    name: 'Elze-Mari Kruger',
  },
  {
    quote: 'Brilliant service. Walked in on a Thursday stressed about my bike, walked out on Friday with everything sorted, and a clear explanation of every single thing they had done.',
    name: 'Jonathan Faber',
  },
]

function SocialProof() {
  return (
    <section id="reviews" className="relative bg-[#111111] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">In Their Words</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] lg:whitespace-nowrap text-white">
            Every review tells the same story
          </h2>
        </FadeUp>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <motion.div key={item.name} variants={fadeUp}>
              <SpotlightCard className="h-full">
                <div className="h-full bg-[#1a1a1a] p-7 sm:p-8 rounded-2xl flex flex-col">
                  <IconQuote className="size-8 text-lime" />
                  <p className="mt-4 flex-1 text-lg sm:text-xl leading-relaxed text-white/90">{item.quote}</p>
                  <div className="mt-6 flex items-center gap-1 text-lime" aria-label="Five star review">
                    {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="size-4" />)}
                  </div>
                  <p className="mt-2 font-display text-xl uppercase tracking-wide text-white">{item.name}</p>
                  {item.context && <p className="mt-1 text-sm text-white/50">{item.context}</p>}
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        <FadeUp delay={0.1} className="mt-10 flex justify-center">
          {/* Google Reviews link — replace with the business's actual Google Maps/Reviews URL */}
          <a
            href="https://www.google.com/search?q=Dunkeld+Cycles+Dunkeld+West+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 py-3 min-h-[44px] font-display text-base font-semibold uppercase tracking-wider text-white/75 transition-colors duration-200 hover:border-lime/40 hover:text-lime"
          >
            <IconStar className="size-4 text-lime" />
            Read our reviews on Google
            <IconArrow className="size-4 opacity-60 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── The Team Behind The 5-Star Reviews ─────────────────────────────────────
function Team() {
  return (
    <section id="team" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="grid grid-cols-2 gap-3 sm:max-w-[70%] sm:mx-auto lg:max-w-none lg:mx-0">
            {[
              { src: 'team1.webp', alt: 'A member of the Dunkeld Cycles workshop team' },
              { src: 'team2.webp', alt: 'A member of the Dunkeld Cycles workshop team' },
              { src: 'team3.webp', alt: 'A member of the Dunkeld Cycles workshop team' },
              { src: 'team4.webp', alt: 'A member of the Dunkeld Cycles workshop team' },
            ].map((member) => (
              <motion.div key={member.src} variants={fadeUp} className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
                <img
                  src={img(member.src)}
                  alt={member.alt}
                  className="w-full aspect-[4/5] object-cover object-top"
                />
              </motion.div>
            ))}
          </motion.div>

          <div>
            <FadeUp delay={0.08}>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Meet The Team</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
                The team behind<br />the 5-star reviews
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/80">
                <p>
                  Behind every 5-star review is a crew of expert mechanics, not just a company name on the door. Each one brings their own experience to the workbench, and gets to know your bike and how you ride it.
                </p>
                <p>
                  Whoever works on your bike, you'll get a straight answer and updates, so you always know exactly what is happening and why.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Email capture (Cam's Corner) — not currently rendered, see App() below ──
// eslint-disable-next-line no-unused-vars
function EmailCapture() {
  const [status, setStatus] = useState('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    // Wire up to Mailchimp, Brevo or Formspree before launch:
    // fetch('https://formspree.io/f/your-id', { method: 'POST', body: new FormData(e.target) })
    setStatus('success')
  }

  return (
    <section className="relative bg-[#111111] py-16 sm:py-20">
      <div className="mx-auto max-w-[480px] px-6 sm:px-8 text-center">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Free From Cam</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold uppercase leading-[1.05] text-white">
            Cam's Corner
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Cam is our resident coach, and this is the exact race-day checklist he runs through with riders before every big event. What to check, service and pack the week before 94.7, Ironman 70.3 or Race to the Sun. No spam. Just the list.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-7 rounded-2xl border border-lime/40 bg-lime/10 px-6 py-8">
                <p className="font-display text-2xl uppercase tracking-wide text-lime">You're on the list</p>
                <p className="mt-2 text-base text-white/80">Keep an eye on your inbox. The checklist is on its way to {email || 'you'}.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4 text-left" noValidate>
                <label className="block">
                  <span className="block text-sm font-medium uppercase tracking-wider text-white/55 mb-2">First name</span>
                  <input type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" className="w-full min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-lime focus:bg-white/10" />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium uppercase tracking-wider text-white/55 mb-2">Email address</span>
                  <input type="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition-colors focus:border-lime focus:bg-white/10" />
                </label>
                <PrimaryButton onClick={handleSubmit} className="w-full justify-center mt-1">
                  Send Me The Checklist
                </PrimaryButton>
                <p className="text-sm text-white/40">Your details go to Dunkeld Cycles only, for updates and tips. Unsubscribe anytime.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contact + map ───────────────────────────────────────────────────────────
const MAPS_EMBED_SRC = 'https://www.google.com/maps?q=-26.131118,28.034626&output=embed'

function Contact() {
  return (
    <section id="contact" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Find Us</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] lg:whitespace-nowrap text-white">
            Bring your bike in, we'll take it from there
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Dunkeld West Shopping Centre, corner of Bompas and Jan Smuts. Parking at the back. Message William directly, call us, or drop in during business hours. Proudly serving Dunkeld, Rosebank, Sandton, Randburg, Parkhurst and Bryanston.
          </p>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <FadeUp delay={0.05}>
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-7 sm:p-8">
              <div className="flex gap-4">
                <IconPin className="size-6 shrink-0 text-lime mt-0.5" />
                <div>
                  <p className="font-display text-xl uppercase tracking-wide text-white">Address</p>
                  <p className="mt-1 text-base text-white/70">
                    No. 10, Dunkeld West Shopping Centre<br />
                    Jan Smuts Ave (cnr Bompas &amp; Jan Smuts)<br />
                    Dunkeld West, Randburg, 2190
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    Look for us around the back of the centre, not the Jan Smuts frontage, with ample on-site parking right outside. Jan Smuts itself can get busy at peak times, so allow a few extra minutes if you're dropping in around rush hour.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <IconClock className="size-6 shrink-0 text-lime mt-0.5" />
                <div>
                  <p className="font-display text-xl uppercase tracking-wide text-white">Hours</p>
                  <p className="mt-1 text-base text-white/70">
                    Monday to Friday: 07:30 &ndash; 17:00<br />
                    Saturday: 09:00 &ndash; 13:00<br />
                    Sunday: Closed
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    Public holidays: as advertised on our social media.
                  </p>
                </div>
              </div>
              <div className="mt-1 flex flex-col sm:flex-row gap-3">
                <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in.")}>
                  WhatsApp Us
                </PrimaryButton>
                <a
                  href={`tel:${PHONE}`}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/5 px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:border-lime/50 hover:text-lime"
                >
                  <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                  <IconPhone className="size-5" />
                  <span>011 341 0627</span>
                </a>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="h-full min-h-[340px] overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Dunkeld Cycles location map, Dunkeld West Shopping Centre"
                src={MAPS_EMBED_SRC}
                className="h-full w-full min-h-[340px]"
                style={{ border: 0, filter: 'grayscale(30%) contrast(1.05)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
// TODO: exact Hubtiger booking URL still needed from client — link the mention
// below once confirmed, rather than guess at a domain.
const FAQS = [
  {
    q: 'How long does a bike service take and can I wait in-store?',
    a: 'Most small services like punctures, bike washes and lube can be turned around the same day, just ask the team. Full services and bigger jobs are usually ready within one to two days, and the team will SMS or WhatsApp you the moment your bike is ready to collect.',
  },
  {
    q: 'Do I need to book in advance?',
    a: <>Booking ahead on WhatsApp gets you the best slot, especially in the weeks before 94.7 or Ironman 70.3. Same-day turnaround is often possible too, depending on the day's schedule, so message the team directly and they'll tell you what's realistic. For specialist hub servicing, <a href={HUBTIGER_BOOKING_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-lime transition-colors">click here to book</a>.</>,
  },
  {
    q: 'Do you service all bike brands, or only Trek and Scott?',
    a: 'Dunkeld Cycles is an authorised Trek and Scott dealer, but the workshop services every brand and discipline: road, MTB, gravel, e-bike and triathlon machines all get the same level of care.',
  },
  {
    q: 'What is included in a full service versus a standard service?',
    a: 'A standard service covers gear and brake adjustment, a safety check and a clean: ideal for keeping a regularly ridden bike honest between bigger services. A full service strips, inspects, cleans and rebuilds the drivetrain, brakes, headset and bearings, so the bike comes back feeling new. The team will tell you straight which one your bike actually needs, not which one costs more.',
  },
  {
    q: 'Is Dunkeld Cycles the nearest Trek and Scott dealer to Sandton and Rosebank?',
    a: 'Yes. Dunkeld Cycles is in Dunkeld West Shopping Centre on Jan Smuts Avenue, making it the closest authorised Trek and Scott dealer for riders in Dunkeld, Rosebank, Sandton, Randburg, Parkhurst and Bryanston. It is a short drive from the M1.',
  },
  {
    q: 'How much does a bike service cost?',
    a: <>Pricing depends on the service type and parts required. The team will give you an honest assessment of what your bike actually needs before any work starts, and they will never recommend something it does not. Call <a href={`tel:${PHONE}`} className="underline hover:text-lime transition-colors">011 341 0627</a> or <a href={waLink("Hi Dunkeld Cycles, I'd like a quote.")} target="_blank" rel="noopener noreferrer" className="underline hover:text-lime transition-colors">WhatsApp</a> for a quote.</>,
  },
  {
    q: 'Is there on-site parking?',
    a: 'Yes. Dunkeld West Shopping Centre has on-site parking right outside the shop, a convenience most bike shops in the area cannot offer.',
  },
  {
    q: 'Do you have kids\' bikes, and is the shop family-friendly?',
    a: 'Yes to both. Dunkeld Cycles stocks a range of kids\' bikes from first-timers to junior riders, and the team is always happy to help fit out the whole family so parents and kids can ride together.',
  },
  {
    q: 'Is there somewhere to wait while my bike is being serviced?',
    a: 'Yes. Dunkeld Cycles has an in-store coffee bar where you can grab a fresh coffee and hang out while the team works on your bike, depending on scope of work. It is a space to sit, chat, swap ride stories and take a break. You will get WhatsApp updates at every step of the service, so you always know what is happening.',
  },
  {
    q: 'Can Dunkeld Cycles source a bike brand that is not in the shop?',
    a: 'Yes. While Dunkeld Cycles is an authorised Trek and Scott dealer, the team can source any brand of bicycle for you. Tell them what you are looking for and they will make it happen.',
  },
]

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button onClick={onToggle} aria-expanded={isOpen} className="group flex w-full items-start justify-between gap-6 py-5 text-left min-h-[44px]">
        <span className="font-display text-xl sm:text-2xl uppercase tracking-wide text-white transition-colors duration-200 group-hover:text-lime">{item.q}</span>
        <IconChevron className={`size-5 shrink-0 mt-1 text-lime transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }} className="overflow-hidden">
            <p className="pb-5 max-w-3xl text-base sm:text-lg leading-relaxed text-white/70">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  return (
    <section id="faq" className="relative bg-[#111111] py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Questions</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] lg:whitespace-nowrap text-white">
            What riders ask before they book
          </h2>
        </FadeUp>
        <FadeUp delay={0.08} className="mt-8">
          {FAQS.map((item, i) => (
            <FaqItem key={item.q} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative bg-charcoal pt-14">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* Columns: Visit | Hours | Brand */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <p className="font-display text-lg uppercase tracking-[0.2em] text-lime">Visit</p>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              No. 10, Dunkeld West Shopping Centre<br />
              Jan Smuts Ave (cnr Bompas &amp; Jan Smuts)<br />
              Dunkeld West, Randburg, 2190<br />
              Johannesburg
            </p>
            <img src={img('Stamp2.png')} alt="Jozi's Authentic Bike Shop, established 2006" className="mt-5 h-[100px] w-auto" />
          </div>

          <div>
            <p className="font-display text-lg uppercase tracking-[0.2em] text-lime">Hours</p>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Monday &ndash; Friday: 07:30 &ndash; 17:00<br />
              Saturday: 09:00 &ndash; 13:00<br />
              Sunday: Closed
            </p>
            <a href={`tel:${PHONE}`} className="mt-4 inline-flex items-center gap-2 text-base text-white/65 hover:text-lime transition-colors">
              <IconPhone className="size-4" />
              011 341 0627
            </a>
          </div>

          <div>
            <img src={img('logo-main.png')} alt="Dunkeld Cycles logo" className="h-[60px] w-auto" />
            <p className="mt-4 max-w-xs text-base leading-relaxed text-white/65">
              Johannesburg's most personal independent bike shop. Trek and Scott dealer, full-service workshop.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-lime" aria-label="4.8 star Google rating">
              {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="size-4" />)}
              <span className="ml-1 text-sm text-white/70">4.8 &middot; 117+ reviews</span>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <a href="https://www.instagram.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Dunkeld Cycles on Instagram" className="flex items-center justify-center rounded-full border border-lime/40 text-lime hover:border-lime hover:bg-lime/10 transition-colors" style={{ height: '60px', width: '60px' }}>
                <IconInstagram style={{ height: '26px', width: '26px' }} />
              </a>
              <a href="https://www.facebook.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Dunkeld Cycles on Facebook" className="flex items-center justify-center rounded-full border border-lime/40 text-lime hover:border-lime hover:bg-lime/10 transition-colors" style={{ height: '60px', width: '60px' }}>
                <IconFacebook style={{ height: '26px', width: '26px' }} />
              </a>
            </div>
          </div>
        </div>

        {/* Single-line bottom bar */}
        <div className="mt-10 border-t border-white/10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/35">
          <span>&copy; {new Date().getFullYear()} Dunkeld Cycles. All rights reserved.</span>
          <span>
            Website design by{' '}
            <a href="https://flintandfuel.co.za" target="_blank" rel="noopener" className="underline hover:text-white/60 transition-colors">
              Flint and Fuel Creative
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <div className="bg-[#111111]">
      <Nav />
      <Hero />
      <FeaturedReview />
      <AboutUs />
      <Workshop />
      <BikeFit />
      <GearAccessories />
      <OurBrands />
      <WhyChooseUs />
      <HowItWorks />
      <CoffeeBar />
      <SocialProof />
      <Team />
      {/* Cam's Corner (EmailCapture) removed for now — client wants to add more info about Cam before this goes back up */}
      <Contact />
      <Faq />
      <Footer />
    </div>
  )
}

export default App
