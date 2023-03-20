import { defineModule } from '@kestrel/kit'
import { customers as customerRoutes } from './customers.router'
import { customers } from './customers.schema'

// The customers table is pointed at by orders and carts; the customer's export and erase are @kestrel/privacy's (they read orders, carts and emails)
export const customersModule = defineModule({
  name: 'customers',
  dependsOn: ['auth', 'core', 'custom-fields', 'db', 'rpc', 'webhooks'],
  tables: { customers },
  router: { customers: customerRoutes },
})
