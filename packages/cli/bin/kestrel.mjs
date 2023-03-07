#!/usr/bin/env node
// The compiled CLI (pnpm --filter kestrel build; it is built before the package is packed). From a checkout,
// `pnpm --filter kestrel dev -- <options>` runs the TypeScript directly.
try {
  await import('../dist/main.mjs')
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND' || !String(error.message).includes('dist/main.mjs')) throw error
  console.error('kestrel is not built. Run: pnpm --filter kestrel build')
  process.exitCode = 1
}
