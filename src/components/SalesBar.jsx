import { useState, useEffect } from 'react'

// ─── localStorage key ─────────────────────────────────────
const LS_KEY = 'sb_start'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

// ─── Timer logic ──────────────────────────────────────────
// On first load: record Date.now() under 'sb_start'.
// On every subsequent load: read that value.
// Expiry = sb_start + 7 days. Never resets across refreshes
// or return visits unless localStorage is manually cleared.
function getExpiry() {
  let start = parseInt(localStorage.getItem(LS_KEY), 10)
  if (!start || isNaN(start)) {
    start = Date.now()
    localStorage.setItem(LS_KEY, String(start))
  }
  return start + SEVEN_DAYS_MS
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function msToUnits(ms) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const s = Math.floor(ms / 1000)
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

function CountUnit({ value, label }) {
  return (
    <div className="flex items-end gap-[3px]">
      <span className="font-mono font-bold text-sm tabular-nums bg-white/10 rounded px-1.5 py-0.5 min-w-[28px] text-center leading-tight">
        {pad(value)}
      </span>
      <span className="text-[10px] text-white mb-0.5">{label}</span>
    </div>
  )
}

export default function SalesBar() {
  const [visible, setVisible] = useState(true)
  const [remaining, setRemaining] = useState(null)

  useEffect(() => {
    const expiry = getExpiry()

    const tick = () => setRemaining(expiry - Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!visible || remaining === null) return null

  const expired = remaining <= 0
  const { days, hours, minutes, seconds } = msToUnits(remaining)

  return (
    <div
      role="complementary"
      aria-label="Special offer"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#3D3A36] text-white shadow-[0_-2px_16px_rgba(0,0,0,0.25)]"
    >
      {expired ? (
        // ── Expired state ──────────────────────────────────
        <div className="flex items-center justify-center px-4 py-4">
          <a
            href="https://calendly.com/flintandfuelcreative"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white hover:text-white/80 transition-colors"
            style={{ fontFamily: 'inherit' }}
          >
            This offer has closed. Still interested? Let&apos;s talk &rarr;
          </a>
        </div>
      ) : (
        // ── Active state ───────────────────────────────────
        <div className="max-w-[1180px] mx-auto px-4 md:px-8">

          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-x-6 gap-y-2 py-3">

            {/* Badge + pricing */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 min-w-0">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" aria-hidden="true" />
                This site is ready for you
              </span>

              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-white text-sm line-through">R7 500</span>
                <span className="text-white text-lg font-bold leading-none">R5 000</span>
              </div>

              <span className="text-white text-[12px] hidden sm:inline whitespace-nowrap">
                Live within 24 hours of payment
              </span>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-white text-[11px] uppercase tracking-widest mr-1 hidden xs:inline">
                Ends
              </span>
              <CountUnit value={days}    label="d" />
              <span className="text-white text-sm font-light">:</span>
              <CountUnit value={hours}   label="h" />
              <span className="text-white text-sm font-light">:</span>
              <CountUnit value={minutes} label="m" />
              <span className="text-white text-sm font-light">:</span>
              <CountUnit value={seconds} label="s" />
            </div>

            {/* CTA + dismiss */}
            <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
              <a
                href="https://pay.yoco.com/r/4ZWKn6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[40px] text-[11px] font-bold tracking-[0.16em] uppercase px-5 py-2 bg-[#C4805A] text-white hover:bg-[#b3704d] active:bg-[#a06245] transition-colors duration-150 whitespace-nowrap rounded-sm"
              >
                Claim This Site
              </a>

              <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss offer bar"
                className="flex items-center justify-center min-h-[40px] min-w-[40px] text-white hover:text-white/60 transition-colors duration-150"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" fill="none" aria-hidden="true">
                  <path d="M1 1l10 10M11 1L1 11"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile-only: secondary note */}
          <p className="sm:hidden text-center text-white text-[11px] pb-2 -mt-1">
            Live within 24 hours of payment
          </p>

        </div>
      )}
    </div>
  )
}
