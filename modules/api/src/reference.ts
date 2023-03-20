// What the docs build reads to generate reference pages (apps/docs/scripts/generate-reference.ts), so those
// pages cannot drift from the code. Not used at runtime.
export { API_SCOPES, API_SCOPE_DESCRIPTIONS } from '@kestrel/core/schema'
export { SHOP_ROLES, SHOP_ROLE_DESCRIPTIONS } from '@kestrel/tenancy/schema'
export { ENV_VARS } from './env-vars'
export { appService } from '@kestrel/apps'
export { INVITATION_EXPIRES_IN_DAYS, LOGIN_CODE_ATTEMPTS, LOGIN_CODE_LENGTH, LOGIN_CODE_TTL_S } from '@kestrel/auth'
export { customFieldService } from '@kestrel/custom-fields'
export {
  RETENTION_MS,
  RETRY_DELAYS_S,
  TIMEOUT_MS,
  WEBHOOK_TEST_TOPIC,
  WEBHOOK_TOPICS,
  WEBHOOK_TOPIC_DESCRIPTIONS,
} from '@kestrel/webhooks'
export { webhookPayloads } from './webhook-payloads'
