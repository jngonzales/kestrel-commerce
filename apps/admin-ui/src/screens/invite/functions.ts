import { publicFn } from '@/lib/server-fn'
import { getOpenInvitation, userExists } from '@kestrel/tenancy'
import { enabledSocialProviders } from '@kestrel/auth'
import { getAdminContext } from '@/lib/session.functions'

export const loadInvitation = publicFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const [invitation, access] = await Promise.all([getOpenInvitation(id), getAdminContext()])
    if (!invitation) return { invitation: null, session: null, existingUser: false, providers: enabledSocialProviders }
    const existingUser = access.session ? true : await userExists(invitation.email)
    return { invitation, session: access.session, existingUser, providers: enabledSocialProviders }
  })
