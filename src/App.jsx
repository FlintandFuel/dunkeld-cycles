/**
 * DUNKELD CYCLES — landing page
 *
 * Positioning angle: "Race-day trust" — the only Joburg LBS that speaks directly
 * to the rider's pre-race panic and answers it with one named human (William).
 * Dark editorial aesthetic breaks entirely from the white-background LBS norm.
 *
 * Top trust signals: 4.9 rating from 115+ named Google reviews, William named
 * 14+ times in reviews, authorised Trek dealer, 10+ years trading, SMS/WhatsApp
 * updates at every step of a service.
 *
 * Primary CTA rationale: "Book Your Bike In" via WhatsApp — mirrors how William
 * actually operates (reviews confirm he replies personally, even on race
 * weekends), removing the friction of a form for a time-pressed rider.
 * Office phone 011 341 0627 added as secondary contact channel.
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

// Placeholder WhatsApp number — replace with Dunkeld Cycles' real number before launch
const WHATSAPP_NUMBER = '27000000000'
const PHONE = '0113410627'
const waLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const NAV_LINKS = [
  { label: 'The Shop', href: '#shop' },
  { label: 'Services', href: '#services' },
  { label: 'Workshop', href: '#workshop' },
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

function SecondaryButton({ href, onClick, children, className = '' }) {
  const Tag = href ? 'a' : 'button'
  const linkProps = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick }
  return (
    <Tag
      {...linkProps}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-white/30 bg-white/5 px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors duration-200 hover:border-lime/50 hover:text-lime ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
      <span className="absolute inset-x-0 bottom-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-lime to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" aria-hidden="true" />
      <span className="relative flex items-center gap-2">
        <IconWhatsApp className="size-5" />
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
            href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in.")}
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
              <a href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in.")} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-4 inline-flex items-center justify-center min-h-[44px] rounded-full bg-lime px-8 py-4 font-display text-xl font-semibold uppercase tracking-wide text-[#102008]">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-lime">
              <IconStar className="size-4" />
              4.9 / 5 from 115+ Google reviews &middot; Trek &amp; Scott dealer
            </span>
          </FadeUp>
          <FadeUp delay={0.08}>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-7xl font-bold uppercase leading-[0.96] tracking-tight text-white">
              Your race is in<br />three days.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-5 max-w-xl text-lg sm:text-xl leading-relaxed text-white/80">
              William and the team have seen this before. Your bike goes back out race-ready,
              with an SMS update at every step, so you can focus on the start line.
            </p>
          </FadeUp>
          <FadeUp delay={0.22}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in for a service.")}>
                Book a Service
              </PrimaryButton>
              <SecondaryButton href={waLink('Hi Dunkeld Cycles, quick question for the team.')}>
                WhatsApp Us
              </SecondaryButton>
            </div>
          </FadeUp>
          <FadeUp delay={0.28}>
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-sm uppercase tracking-[0.2em] text-white/45">
                No. 6, Dunkeld West Shopping Centre &middot; 011 341 0627
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
              src={img('entrance.jpg')}
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
          <img src={img('entrance.jpg')} alt="Dunkeld Cycles shop entrance" className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105" />
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
        <FadeUp>
          <div className="flex items-center justify-center gap-1.5 text-lime mb-5" aria-label="Five star Google review">
            {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="size-5" />)}
            <span className="ml-2 text-sm font-semibold text-white/60 uppercase tracking-wider">4.9 &middot; 115+ Google reviews</span>
          </div>
          <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase leading-[1.15] tracking-wide text-white">
            "He saved my day, my Race to the Sun and my marriage. Thanks William. You are a legend."
          </blockquote>
          <p className="mt-4 text-base text-white/55">Nasr Gie &mdash; Google Review</p>
          <div className="mt-8">
            <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in for a service.")}>
              Book Your Bike In
            </PrimaryButton>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className="text-sm uppercase tracking-[0.2em] text-white/40">Follow us</span>
            <a href="https://www.instagram.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Follow Dunkeld Cycles on Instagram" className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 min-h-[44px] text-white/70 hover:text-lime hover:border-lime/40 transition-colors">
              <IconInstagram className="size-6" />
              <span className="font-display text-sm uppercase tracking-wider">Instagram</span>
            </a>
            <a href="https://www.facebook.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Follow Dunkeld Cycles on Facebook" className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 min-h-[44px] text-white/70 hover:text-lime hover:border-lime/40 transition-colors">
              <IconFacebook className="size-6" />
              <span className="font-display text-sm uppercase tracking-wider">Facebook</span>
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── The Shop (Trek + Scott + Sourcing) ─────────────────────────────────────
function TheShop() {
  return (
    <section id="shop" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div>
            <FadeUp>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">The Shop</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
                Authorised Trek &amp;<br />Scott dealer
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                Dunkeld Cycles has been Johannesburg's go-to bike shop since 2006. Twenty years of fitting riders to the right bike, giving honest advice, and building relationships that start with a first name.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                Looking for something specific that is not on the floor? The team can source any brand of bicycle for you. Tell them what you ride and what you need, and they will make it happen.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <p className="mt-6 text-base text-white/60">
                From a child's first bike to a carbon race machine, every rider gets the same attention.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-8">
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
                <img src={img('trek.webp')} alt="Trek bikes on the shop floor" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('scott.webp')} alt="Scott bikes on the shop floor" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('bike-range.webp')} alt="Full bike range at Dunkeld Cycles" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
                <img src={img('kids.webp')} alt="Kids bikes at Dunkeld Cycles" className="w-full aspect-square object-cover object-center transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Services ────────────────────────────────────────────────────────────────
const SERVICES = [
  { n: '01', title: 'Basic Service', text: 'Gears tuned, brakes sharp, tyres checked. The regular once-over that keeps your bike honest between the bigger jobs.' },
  { n: '02', title: 'Full Service', text: 'Strip, clean, rebuild. Drivetrain, brakes, headset and bearings get the full treatment, so your bike comes home feeling new.' },
  { n: '03', title: 'Race Prep', text: 'Three days to race day? William has seen this exact panic before, and he knows exactly what your bike needs to get you to the start line.' },
  { n: '04', title: 'Bike Fit', text: 'Professional bike fitting powered by Cycle-It. Your position, dialled in so every kilometre feels like it is supposed to.', link: 'https://cycle-it.co.za', linkLabel: 'Book Now' },
  { n: '05', title: 'New Bikes', text: 'Authorised Trek and Scott dealer, plus the accessories, apparel and gear to match. Walk in unsure, walk out on the right bike for you.' },
  { n: '06', title: 'Nutrition', text: 'Race-day fuel and everyday recovery, recommended by people who ride long days themselves and actually use what they sell.' },
]

function Services() {
  return (
    <section id="services" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">What We Do</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] lg:whitespace-nowrap text-white">
            Six ways to get you back on the bike
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Whatever you ride, there is a name attached to the work on your bike. Not a job number. A person who will tell you straight what it actually needs.
          </p>
        </FadeUp>

        {/* 2-col sticky-scroll layout — image stays, cards slide past as you scroll */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-8 lg:gap-10 items-start">
          {/* Sticky workshop image */}
          <div className="hidden lg:block sticky top-[92px]">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_56px_rgba(0,0,0,0.45)]">
              <img
                src={img('service-2.png')}
                alt="Bike service in progress at Dunkeld Cycles workshop"
                className="w-full h-auto object-cover object-top"
              />
            </div>
          </div>

          {/* Mobile image (non-sticky) */}
          <div className="lg:hidden overflow-hidden rounded-xl border border-white/10">
            <img src={img('service-2.png')} alt="Dunkeld Cycles workshop" className="w-full h-auto" />
          </div>

          {/* Cards — each animates in independently as it scrolls into view */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICES.map((service, i) => (
              <FadeUp key={service.title} delay={i < 2 ? i * 0.08 : 0}>
                <SpotlightCard className="h-full">
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="h-full bg-white/[0.06] p-7 sm:p-8 rounded-2xl">
                    <span className="font-display text-sm tracking-[0.25em] text-lime">{service.n}</span>
                    <h3 className="mt-3 font-display text-3xl uppercase tracking-wide text-white">{service.title}</h3>
                    <p className="mt-2 text-base sm:text-[17px] leading-relaxed text-white/70">{service.text}</p>
                    {service.link && (
                      <a href={service.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-display text-sm uppercase tracking-wider text-lime hover:text-white transition-colors">
                        {service.linkLabel || 'Learn more'} <IconArrow className="size-4" />
                      </a>
                    )}
                  </motion.div>
                </SpotlightCard>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp delay={0.1} className="mt-10 flex justify-center">
          <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in for a service.")}>
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
              Your perfect position,<br />dialled in.
            </h2>
            <div className="mt-6 group overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_56px_rgba(0,0,0,0.45)]">
              <img src={img('cycle-it.JPG')} alt="Professional bike fitting session at Dunkeld Cycles" className="w-full aspect-[1/1] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-lg leading-relaxed text-white/80">
              A proper bike fit changes everything. Less pain, more power, and the kind of comfort that lets you ride longer and harder. Dunkeld Cycles partners with Cycle-It to deliver professional bike fitting right here in the shop.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              Whether you have just bought a new bike or want to get more out of the one you ride, a fit session is the single best upgrade you can make.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <a href="https://cycle-it.co.za" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-lime px-7 py-4 min-h-[44px] font-display text-lg font-semibold uppercase tracking-wide text-[#102008] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(115,184,69,0.5)]">
                <span className="absolute inset-x-0 top-0 h-px w-3/4 mx-auto bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <span className="relative flex items-center gap-2">
                  Book A Fit
                  <IconArrow className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </a>
            </div>
            <a href="https://cycle-it.co.za" target="_blank" rel="noopener noreferrer" className="mt-5 inline-block">
              <img src={img('cycle-it-logo.png')} alt="Cycle-It" className="h-[100px] w-auto opacity-70 hover:opacity-100 transition-opacity" />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

// ─── Workshop ────────────────────────────────────────────────────────────────
function Workshop() {
  return (
    <section id="workshop" className="relative bg-[#111111] py-16 sm:py-24" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 94%, 0 100%)' }}>
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8 pb-10">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">The Workshop</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
            Where the work gets done
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Tools on the wall, bikes on the stands, wheels hanging overhead. This is where every service starts and ends. The team works with their hands, not job numbers, and they will message you at every step so you know exactly what is happening.
          </p>
        </FadeUp>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <FadeUp>
            <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <img src={img('workshop1.webp')} alt="Mechanic working on a bike in the Dunkeld Cycles workshop" className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <img src={img('workshop2.webp')} alt="Workshop mechanic with a finished bike" className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>
          <FadeUp delay={0.16}>
            <div className="group overflow-hidden rounded-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
              <img src={img('workshop3.webp')} alt="Hands-on bike service in progress" className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="mt-10 flex justify-center">
          <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in for a service.")}>
            Book A Service
          </PrimaryButton>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Gear & Accessories ─────────────────────────────────────────────────────
function GearAccessories() {
  const items = [
    { src: 'gear.webp', alt: 'Helmets from leading brands', label: 'Helmets' },
    { src: 'shoes.webp', alt: 'Cycling shoes from Lake, Specialized and more', label: 'Shoes' },
    { src: 'accessories.webp', alt: 'Parts and accessories wall', label: 'Parts' },
    { src: 'accessories2.webp', alt: 'Chain lubes, sealants and maintenance products', label: 'Maintenance' },
    { src: 'accessories3.webp', alt: 'Bags, packs and cycling storage', label: 'Storage' },
    { src: 'nutrition.webp', alt: 'Race-day nutrition and recovery products', label: 'Nutrition' },
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
            Helmets, shoes, bags, chain lube, sealant, nutrition, race-day fuel and everything in between. If it goes on the bike or on the rider, it is here.
          </p>
        </FadeUp>

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
            <div className="group overflow-hidden rounded-2xl border border-black/10 shadow-[0_24px_56px_rgba(0,0,0,0.25)]">
              <img src={img('coffee1.webp')} alt="Fresh coffee being made at the Dunkeld Cycles coffee bar" className="w-full aspect-[1/1] object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <span className="font-display text-sm uppercase tracking-[0.3em] text-[#102008]">The Coffee Bar</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold uppercase leading-[1.02] text-[#102008]">
              Grab a coffee.<br />Stay a while.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#102008]/80">
              Drop your bike off, or just drop in. There is fresh coffee, space to sit, and the kind of conversations that only happen when riders get together.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#102008]/80">
              Swap ride stories, plan the next route, or just take a break from Jan Smuts. This is a bike shop with room to breathe.
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
    context: 'Unprompted brand advocacy, posted to Google Reviews',
  },
  {
    quote: 'Brilliant service. Walked in on a Thursday stressed about my bike, walked out on Friday with everything sorted, and a clear explanation of every single thing they had done.',
    name: 'Jonathan Faber',
    context: 'Pre-race service, reviewed on Google',
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
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Riders arrive uncertain or under pressure and leave feeling like someone actually has their back. 4.9 out of 5 from 115+ Google reviews.
          </p>
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
                  <p className="mt-1 text-sm text-white/50">{item.context}</p>
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
            Read all 115+ reviews on Google
            <IconArrow className="size-4 opacity-60 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Meet the team ───────────────────────────────────────────────────────────
function Team() {
  return (
    <section id="team" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-start">
          <FadeUp>
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.4)]">
              <img
                src={img('william.png')}
                alt="William, owner of Dunkeld Cycles"
                className="w-full aspect-[4/5] object-cover object-top"
              />
            </div>
          </FadeUp>

          <div>
            <FadeUp delay={0.08}>
              <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Meet The Team</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] text-white">
                The name behind<br />14 five-star reviews
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-white/80">
                <p>
                  Open the reviews and one name keeps coming up: William. Not "the team", not "the staff". William, by name, because he remembers where you came from, what you ride, and what happened last time your bike came in.
                </p>
                <p>
                  He runs the shop with a crew of mechanics and riders who treat a child's first bicycle with the same respect as a carbon race machine, and who will message you mid-service so you know exactly what is happening and why.
                </p>
                <p className="rounded-xl border-l-4 border-lime bg-white/5 px-5 py-4 text-white">
                  "We use first names here. If you don't use words like Sir, we won't either."
                </p>
              </div>
              <div className="mt-7">
                <SecondaryButton href={waLink('Hi William, I had a question for you and the team.')}>
                  Say hello to William
                </SecondaryButton>
              </div>
            </FadeUp>
          </div>
        </div>

      </div>
    </section>
  )
}

// ─── Email capture ───────────────────────────────────────────────────────────
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
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Free From William</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold uppercase leading-[1.05] text-white">
            William's Pre-Race Checklist
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            The exact checklist William runs through before every race-day service. What to check, service and pack the week before 94.7, Ironman 70.3 or Race to the Sun. No spam. Just the list.
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
                <p className="text-sm text-white/40">Your details go to Dunkeld Cycles only, for race-season tips. Unsubscribe anytime.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Contact + map ───────────────────────────────────────────────────────────
const MAPS_EMBED_SRC = 'https://www.google.com/maps?q=' +
  encodeURIComponent('Dunkeld West Shopping Centre, Jan Smuts Ave, Dunkeld West, Randburg, 2196') +
  '&output=embed'

function Contact() {
  return (
    <section id="contact" className="relative bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <FadeUp>
          <span className="font-display text-sm uppercase tracking-[0.3em] text-lime">Find Us</span>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold uppercase leading-[1.02] lg:whitespace-nowrap text-white">
            Bring your bike in. We'll take it from here.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Dunkeld West Shopping Centre, corner of Bompas and Jan Smuts. Message William directly, call us, or drop in during opening hours.
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
                    No. 6, Dunkeld West Shopping Centre<br />
                    Jan Smuts Ave (cnr Bompas &amp; Jan Smuts)<br />
                    Dunkeld West, Randburg, 2196
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <IconClock className="size-6 shrink-0 text-lime mt-0.5" />
                <div>
                  <p className="font-display text-xl uppercase tracking-wide text-white">Opening Hours</p>
                  <p className="mt-1 text-base text-white/70">
                    Monday to Friday: 08:00 &ndash; 17:30<br />
                    Saturday: 09:00 &ndash; 13:00<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
              <div className="mt-1 flex flex-col sm:flex-row gap-3">
                <PrimaryButton href={waLink("Hi Dunkeld Cycles, I'd like to book my bike in.")}>
                  Book on WhatsApp
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
const FAQS = [
  {
    q: 'How long does a bike service take and can I wait in-store?',
    a: 'Most basic services and tune-ups are turned around the same day, often while you wait or browse the shop. Full services and bigger jobs are usually ready within one to two days, and the team will SMS or WhatsApp you the moment your bike is ready to collect.',
  },
  {
    q: 'Do I need to book in advance, or can I drop in before a race weekend?',
    a: 'Booking ahead on WhatsApp gets you the best slot, especially in the weeks before 94.7 or Ironman 70.3. That said, William and the team are known for squeezing riders in before big race weekends. Message William directly: he has seen the three-days-to-race panic before and knows how to handle it.',
  },
  {
    q: 'Do you service all bike brands, or only Trek and Scott?',
    a: 'Dunkeld Cycles is an authorised Trek and Scott dealer, but the workshop services every brand and discipline: road, MTB, gravel, e-bike and triathlon machines all get the same level of care, whether they are carbon race bikes or a child\'s first ride.',
  },
  {
    q: 'What is included in a full service versus a basic tune-up?',
    a: 'A basic tune-up covers gear and brake adjustment, a safety check and a clean: ideal for keeping a regularly ridden bike honest between bigger services. A full service strips, inspects, cleans and rebuilds the drivetrain, brakes, headset and bearings, so the bike comes back feeling new. William will tell you straight which one your bike actually needs, not which one costs more.',
  },
  {
    q: 'Is Dunkeld Cycles the nearest Trek and Scott dealer to Sandton and Rosebank?',
    a: 'Yes. Dunkeld Cycles is in Dunkeld West Shopping Centre on Jan Smuts Avenue, making it the closest authorised Trek and Scott dealer to Sandton, Rosebank, Hyde Park and the northern suburbs of Johannesburg. It is a short drive from the M1.',
  },
  {
    q: 'Do you service e-bikes and triathlon bikes?',
    a: 'Yes. The workshop services e-bikes, triathlon bikes, TT frames and all road, MTB and gravel disciplines. William and the team have hands-on experience preparing bikes for Ironman 70.3, Cape Epic, Race to the Sun and the 94.7 Cycle Challenge.',
  },
  {
    q: 'How much does a bike service cost?',
    a: 'Pricing depends on the service type and parts required. William and the team will give you an honest assessment of what your bike actually needs before any work starts, and they will never recommend something it does not. Call 011 341 0627 or WhatsApp for a quote.',
  },
  {
    q: 'Can I get a same-day service before the 94.7 Cycle Challenge or Ironman 70.3?',
    a: 'Yes. Dunkeld Cycles offers same-day race-prep services for riders in the lead-up to major events. Book your slot on WhatsApp or call 011 341 0627 as early in the week as possible for the best availability before race weekend.',
  },
  {
    q: 'Do you have kids\' bikes?',
    a: 'Yes. Dunkeld Cycles stocks a range of kids\' bikes from first-timers to junior riders. The team gives a child\'s first bike the same care and attention as any race machine, and they will help you find the right size and fit for your little one.',
  },
  {
    q: 'Is there somewhere to wait while my bike is being serviced?',
    a: 'Yes. Dunkeld Cycles has an in-store coffee bar where you can grab a fresh coffee and hang out while the team works on your bike. It is a space to sit, chat, swap ride stories and take a break. You will get WhatsApp updates at every step of the service, so you always know what is happening.',
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
              No. 6, Dunkeld West Shopping Centre<br />
              Jan Smuts Ave (cnr Bompas &amp; Jan Smuts)<br />
              Dunkeld West, Randburg, 2196<br />
              Johannesburg
            </p>
          </div>

          <div>
            <p className="font-display text-lg uppercase tracking-[0.2em] text-lime">Hours</p>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Monday &ndash; Friday: 08:00 &ndash; 17:30<br />
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
              Johannesburg's most personal independent bike shop. Trek and Scott dealer, full-service workshop, first names always.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-lime" aria-label="4.9 star Google rating">
              {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="size-4" />)}
              <span className="ml-1 text-sm text-white/70">4.9 &middot; 115+ reviews</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://www.instagram.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Dunkeld Cycles on Instagram" className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-white/70 hover:text-lime hover:border-lime/50 transition-colors">
                <IconInstagram className="size-7" />
              </a>
              <a href="https://www.facebook.com/dunkeldcycles/" target="_blank" rel="noopener noreferrer" aria-label="Dunkeld Cycles on Facebook" className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-white/20 text-white/70 hover:text-lime hover:border-lime/50 transition-colors">
                <IconFacebook className="size-7" />
              </a>
            </div>
            <img src={img('Stamp2.png')} alt="Jozi's Authentic Bike Shop, established 2006" className="mt-5 h-[80px] w-auto" />
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
      <TheShop />
      <Services />
      <BikeFit />
      <Workshop />
      <GearAccessories />
      <CoffeeBar />
      <SocialProof />
      <Team />
      <EmailCapture />
      <Contact />
      <Faq />
      <Footer />
    </div>
  )
}

export default App
