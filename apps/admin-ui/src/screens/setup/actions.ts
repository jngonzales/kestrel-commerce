import { publicFn } from '@/lib/server-fn'
import { setupInput } from '@kestrel/auth/contract'
import { completeSetup } from '@kestrel/auth/setup'

export type SetupResult = { error?: string }

export const runSetup = publicFn({ method: 'POST' })
  .validator((values: unknown) => values)
  .handler(async ({ data }): Promise<SetupResult> => {
    const parsed = setupInput.safeParse(data)
    if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid details' }
    try {
      await completeSetup(parsed.data)
      return {}
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Setup failed' }
    }
  })
