#!/usr/bin/env node
// The compiled CLI (pnpm --filter create-kestrel build; it is built before the package is packed). From a checkout,
// `pnpm --filter create-kestrel dev -- <options>` runs the TypeScript directly.
try {
  await import('../dist/main.mjs')
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND' || !String(error.message).includes('dist/main.mjs')) throw error
  console.error('create-kestrel is not built. Run: pnpm --filter create-kestrel build')
  process.exitCode = 1
}
