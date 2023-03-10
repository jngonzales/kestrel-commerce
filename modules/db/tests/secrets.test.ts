import assert from 'node:assert/strict'
import test, { afterEach, describe } from 'node:test'
import { decryptSecret, encryptSecret, sessionSecret } from '../src/secrets'

const saved = { ...process.env }
afterEach(() => {
  process.env = { ...saved }
})

describe('sessionSecret', () => {
  test('is BETTER_AUTH_SECRET when set, so installs that already use it keep their sessions', () => {
    process.env.BETTER_AUTH_SECRET = 'old-session-secret'
    process.env.KESTREL_SECRET = 'kestrel'
    assert.equal(sessionSecret(), 'old-session-secret')
  })

  test('is derived from KESTREL_SECRET otherwise, and differs from it', () => {
    delete process.env.BETTER_AUTH_SECRET
    process.env.KESTREL_SECRET = 'kestrel'
    const secret = sessionSecret()
    assert.match(secret ?? '', /^[0-9a-f]{64}$/)
    assert.equal(sessionSecret(), secret)
    process.env.KESTREL_SECRET = 'another'
    assert.notEqual(sessionSecret(), secret)
  })

  test('an empty BETTER_AUTH_SECRET (an unset compose variable) counts as unset', () => {
    process.env.BETTER_AUTH_SECRET = ''
    process.env.KESTREL_SECRET = 'kestrel'
    assert.match(sessionSecret() ?? '', /^[0-9a-f]{64}$/)
  })

  test('is undefined when neither is set, so a build without secrets still loads', () => {
    delete process.env.BETTER_AUTH_SECRET
    delete process.env.KESTREL_SECRET
    assert.equal(sessionSecret(), undefined)
  })

  test('is not the key stored secrets are encrypted with', () => {
    delete process.env.BETTER_AUTH_SECRET
    process.env.KESTREL_SECRET = 'kestrel'
    assert.equal(decryptSecret(encryptSecret('hello')), 'hello')
    assert.notEqual(sessionSecret(), 'kestrel')
  })
})
