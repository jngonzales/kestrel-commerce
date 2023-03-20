import { configureRpc, createProcedures } from '@kestrel/rpc'
import { appService } from '@kestrel/apps'
import { auth, isSuperAdmin } from '@kestrel/auth'
import { hasScope } from '@kestrel/core/scopes'
import { resolveAdminShop, resolveApiToken } from '@kestrel/tenancy'

export { createContext, type Context } from '@kestrel/rpc'

// What rpc needs to recognise a request. Registered here, once, because api is the layer that knows about logins, API
// tokens and shops: rpc itself depends on none of them, so a module below auth or tenancy can have routes too.
declare module '@kestrel/rpc' {
  interface Register {
    session: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>
  }
}

configureRpc({
  session: (headers) => auth.api.getSession({ headers }),
  adminShop: ({ session, user }) =>
    resolveAdminShop({ userId: user.id, activeShopId: session.activeOrganizationId, superAdmin: isSuperAdmin(user) }),
  token: async (bearer) => (await resolveApiToken(bearer)) ?? (await appService.resolveAccessToken(bearer)),
  hasScope,
})

export const {
  pub,
  authed,
  admin,
  adminOrToken,
  scoped,
  paymentsApp,
  aiApp,
  carrierApp,
  shopManager,
  webhookManager,
  superAdminOnly,
} = createProcedures()
