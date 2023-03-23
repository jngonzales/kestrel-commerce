// What the Storefront API guides assume is already in scope: a client and the values a checkout form collects.
import * as sdk from '@kestrel/storefront-sdk'

declare const baseUrl: string
declare const publishableKey: string
const kestrel = sdk.createStorefrontClient({ baseUrl, publishableKey })
type Checkout = Parameters<typeof kestrel.checkout.complete>[0]
declare const merchandiseId: string
declare const email: string
declare const code: string
declare const shippingAddress: Checkout['shippingAddress']
declare const shippingRateId: Checkout['shippingRateId']
declare const paymentMethodId: Checkout['paymentMethodId']
