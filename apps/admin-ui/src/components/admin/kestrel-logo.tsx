import { cn } from 'cn'

// The Kestrel mark: a diamond ring with a solid core. Drawn in currentColor for the ring, brand accent for the
// core, so it holds on paper and on ink.
export function KestrelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M16 3.2 28.8 16 16 28.8 3.2 16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M16 10.9 21.1 16 16 21.1 10.9 16Z" fill="var(--brand, #c24e2a)" />
    </svg>
  )
}

// The ring draws itself while the core settles: the loading state for previews and empty panels.
// Stands still (dimmed) for people who prefer reduced motion.
export function KestrelLoader({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('kestrel-loader', className)}
      role="status"
      aria-label="Loading"
    >
      <style>{`
        .kestrel-loader .kestrel-ring { stroke-dasharray: 1; animation: kestrel-draw 1.8s ease-in-out infinite; }
        .kestrel-loader .kestrel-core { transform-origin: 16px 16px; animation: kestrel-core 1.8s ease-in-out infinite; }
        @keyframes kestrel-draw {
          0% { stroke-dashoffset: 1; }
          55% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1; }
        }
        @keyframes kestrel-core {
          0%, 100% { transform: scale(0.72); opacity: 0.55; }
          55% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kestrel-loader .kestrel-ring { animation: none; stroke-dashoffset: 0; opacity: 0.55; }
          .kestrel-loader .kestrel-core { animation: none; }
        }
      `}</style>
      <path
        className="kestrel-ring"
        pathLength={1}
        d="M16 3.2 28.8 16 16 28.8 3.2 16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path className="kestrel-core" d="M16 10.9 21.1 16 16 21.1 10.9 16Z" fill="var(--brand, #c24e2a)" />
    </svg>
  )
}

// The mark in a tile, matching the sidebar's shop identity.
export function KestrelBadge({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <div
      className={cn(
        'flex aspect-square shrink-0 items-center justify-center border border-current/25 bg-foreground/[0.03]',
        size === 'sm' ? 'size-8 rounded' : 'size-14 rounded-md',
      )}
    >
      <KestrelLogo className={size === 'sm' ? 'size-5!' : 'size-8!'} />
    </div>
  )
}

// Logo and wordmark, shown above the sign-in, setup, invite and app consent cards
export function KestrelBrand() {
  return (
    <div className="mb-7 flex flex-col items-center gap-3">
      <KestrelBadge size="lg" />
      <div className="font-display text-2xl font-semibold tracking-tight text-foreground">Kestrel</div>
    </div>
  )
}


