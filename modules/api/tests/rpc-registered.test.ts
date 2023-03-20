// The routes stand on resolvers that modules/api registers when its router is loaded. This pins that: loading the router
// leaves @kestrel/rpc configured, and the entry point's startup assertion passes.
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Set before the modules load: @kestrel/db picks its database when it is first imported
process.env.DATABASE_URL = 'pglite:memory'
process.env.KESTREL_SECRET = 'test-secret-test-secret-test-secret-0123'

const { assertRpcConfigured } = await import('@kestrel/rpc')

test('the resolvers are registered by loading the router', async () => {
  assert.throws(() => assertRpcConfigured(), /has no resolvers/)
  await import('../src/router')
  assert.doesNotThrow(() => assertRpcConfigured())
})
