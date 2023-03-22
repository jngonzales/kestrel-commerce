import type { Conn } from '@kestrel/db'
import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { createLogger } from '@kestrel/log'

const log = createLogger('kestrel')

type StartupGlobal = typeof globalThis & {
  kestrelBackgroundServices?: Promise<void>
  kestrelRejectionLogger?: true
}
const startupGlobal = globalThis as StartupGlobal

// A rejected promise nobody awaited (in a worker, a call to an app or an AI provider…) would make Node exit, taking
// checkout down with it: log it instead. Registered once, also across dev reloads.
if (!startupGlobal.kestrelRejectionLogger) {
  startupGlobal.kestrelRejectionLogger = true
  process.on('unhandledRejection', (reason) => log.error({ err: reason }, 'unhandled rejection'))
}

function startBackgroundServices() {
  startupGlobal.kestrelBackgroundServices ??= (async () => {
    // The embedded database (DATABASE_URL=pglite:…) is migrated here, before anything queries it
    const { db, prepareDatabase } = await import('@kestrel/db')
    await prepareDatabase()
    const [
      { startDeliveryWorker },
      { startPaymentsWorker },
      { startEmailWorker },
      { isMultiTenant },
      { appService, instanceSignature, marketplaceService, serverUrl },
    ] = await Promise.all([
      import('@kestrel/webhooks/worker'),
      import('@kestrel/payments/worker'),
      import('@kestrel/email'),
      import('@kestrel/tenancy'),
      import('@kestrel/apps'),
    ])
    startDeliveryWorker({ allowPrivateNetworks: !isMultiTenant, instanceSignature, resolveUrl: serverUrl }, db)
    startPaymentsWorker(db)
    startEmailWorker(db)
    marketplaceService.startMarketplaceSync()
    appService.registerBundledApps()
  })().catch((error) => {
    startupGlobal.kestrelBackgroundServices = undefined
    throw error
  })
  return startupGlobal.kestrelBackgroundServices
}

export default createServerEntry({
  async fetch(request, options) {
    await startBackgroundServices()
    return handler.fetch(request, options)
  },
})
