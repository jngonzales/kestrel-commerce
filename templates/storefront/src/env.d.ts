interface ImportMetaEnv {
  /** Kestrel origin (set by `pnpm dev` from the repo root) */
  readonly KESTREL_URL?: string
  /** Kestrel origin as buyers' browsers reach it (cart, checkout), when it differs from KESTREL_URL */
  readonly KESTREL_PUBLIC_URL?: string
  /** pk_… from the admin; optional in single-tenant mode */
  readonly KESTREL_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
