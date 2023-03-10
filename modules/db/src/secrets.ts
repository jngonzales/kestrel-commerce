// Secrets stored in the database (storage and email credentials): AES-256-GCM with a key derived from
// KESTREL_SECRET under its own label. Format: v1.{iv}.{tag}.{ciphertext}, base64url.
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto'

const LABEL = 'kestrel:stored-secret:v1'

/** The instance secret for everything Kestrel encrypts or signs itself */
export function kestrelSecret() {
  const secret = process.env.KESTREL_SECRET
  if (!secret) throw new Error('KESTREL_SECRET is not set')
  return secret
}

/**
 * The secret Better Auth signs sessions with. BETTER_AUTH_SECRET when set (installs that predate the single
 * secret keep their sessions), else derived from KESTREL_SECRET under its own label. Undefined when neither is set.
 */
export function sessionSecret() {
  if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET
  const secret = process.env.KESTREL_SECRET
  return secret ? createHmac('sha256', secret).update('kestrel:session:v1').digest('hex') : undefined
}

function key() {
  return createHmac('sha256', kestrelSecret()).update(LABEL).digest()
}

export function encryptSecret(plain: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  return ['v1', iv, cipher.getAuthTag(), data]
    .map((p) => (typeof p === 'string' ? p : p.toString('base64url')))
    .join('.')
}

export function decryptSecret(stored: string) {
  const [version, iv, tag, data] = stored.split('.')
  if (version !== 'v1' || !iv || !tag || !data) throw new Error('Unrecognized stored secret')
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64url'))
  decipher.setAuthTag(Buffer.from(tag, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(data, 'base64url')), decipher.final()]).toString('utf8')
}
