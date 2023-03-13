import assert from 'node:assert/strict'
import test, { describe } from 'node:test'
import { isSubdomainSlug, isUnderRoot, parseRootDomain, subdomainSlug, subdomainUrl } from '../src/subdomains'

const root = parseRootDomain('kestrel.app')!

describe('parseRootDomain', () => {
  test('reads a bare host, a URL or a host with a port', () => {
    assert.deepEqual(root, { host: 'kestrel.app', port: '', protocol: 'https' })
    assert.deepEqual(parseRootDomain(' HTTP://Kestrel.app/ '), { host: 'kestrel.app', port: '', protocol: 'http' })
    assert.deepEqual(parseRootDomain('localhost:4321', 'http://localhost:3000'), {
      host: 'localhost',
      port: '4321',
      protocol: 'http',
    })
  })

  test('the written protocol beats the app URL', () => {
    assert.equal(parseRootDomain('https://kestrel.app', 'http://localhost:3000')?.protocol, 'https')
    assert.equal(parseRootDomain('kestrel.app', 'https://admin.kestrel.app')?.protocol, 'https')
  })

  test('unset or invalid is null', () => {
    for (const bad of [undefined, '', '  ', 'a..b', 'bad host.com', '-x.com', 'kestrel.app:port']) {
      assert.equal(parseRootDomain(bad), null, String(bad))
    }
  })
})

describe('subdomainSlug', () => {
  test('a single label under the root is the slug', () => {
    assert.equal(subdomainSlug('acme.kestrel.app', root), 'acme')
    assert.equal(subdomainSlug('ACME-2.Kestrel.app', root), 'acme-2')
  })

  test('the root, deeper hosts, reserved labels and other hosts are not shops', () => {
    for (const host of [
      'kestrel.app',
      'a.b.kestrel.app',
      'www.kestrel.app',
      'admin.kestrel.app',
      'acme.example.com',
      'acmekestrel.app',
    ]) {
      assert.equal(subdomainSlug(host, root), null, host)
    }
  })
})

test('isSubdomainSlug rejects what is not a hostname label', () => {
  assert.ok(isSubdomainSlug('acme'))
  for (const bad of ['', 'Acme', 'my_shop', '-acme', 'acme-', 'a.b', 'admin', 'default', 'a'.repeat(64)]) {
    assert.equal(isSubdomainSlug(bad), false, bad)
  }
})

test('isUnderRoot covers the root and everything below it', () => {
  assert.ok(isUnderRoot('kestrel.app', root))
  assert.ok(isUnderRoot('x.y.kestrel.app', root))
  assert.equal(isUnderRoot('notkestrel.app', root), false)
})

test('subdomainUrl keeps the protocol and port', () => {
  assert.equal(subdomainUrl('acme', root), 'https://acme.kestrel.app')
  assert.equal(subdomainUrl('acme', parseRootDomain('http://localhost:4321')!), 'http://acme.localhost:4321')
})
