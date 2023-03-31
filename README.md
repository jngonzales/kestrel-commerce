<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/images/logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs/images/logo-light.svg">
    <img src="docs/images/logo.svg" alt="Kestrel" width="72">
  </picture>
</p>

<h1 align="center">Kestrel Commerce</h1>

<p align="center"><b>Self-hosted commerce. Admin, checkout, Storefront API and webhooks on one machine you own.</b></p>

<p align="center"><a href="apps/docs/content/docs/self-hosting/install.mdx"><b>Self-hosting guide</b></a> · <a href="docs/architecture.md"><b>Architecture</b></a> · <a href="docs/development.md"><b>Development</b></a></p>

<p align="center">
  <img src="docs/images/dashboard.png" alt="Kestrel admin dashboard" width="900">
</p>

<p align="center">
  <img src="docs/images/storefront.webp" alt="Kestrel storefront" width="900">
</p>

## Preview

https://github.com/user-attachments/assets/3b3fefb0-d05c-4a4f-b212-15e7b576b8fb
## What it is

Kestrel is a commerce platform you run yourself. One Node process serves the admin, the checkout, the Storefront API and the webhook endpoints; storefronts are separate and can be anything that speaks the API, including the bundled Liquid theme renderer.

- Admin: products, variants, collections, orders, customers, discounts, gift cards, custom fields, translations, files, channels, apps
- Tenancy: one shop by default, or many shops by host with `TENANCY_MODE=multi`
- Payments: hosted checkout with bank transfer, cash on delivery, or Stripe; provider keys are stored encrypted in the database
- Extensibility: embedded apps registered by URL, scoped API tokens, signed webhooks, an app SDK and a Storefront SDK
- Storefront: Astro renders Liquid themes against the Storefront API; themes live in `templates/storefront`
- Database: PostgreSQL in production; `DATABASE_URL=pglite:<folder>` runs an embedded PGlite for local work

## Requirements

- Node 24.22.0 or newer (`.node-version`)
- pnpm 10.7.1 (`corepack enable`)
- PostgreSQL 16 or newer for a real install, or nothing for PGlite

## Quick start from this repository

```sh
pnpm install
cp .env.example .env
```

Edit `.env`:

| Variable | What it does |
| --- | --- |
| `DATABASE_URL` | `postgres://user:pass@host:5432/db`, or `pglite:.pglite` for an embedded database |
| `KESTREL_SECRET` | Signs sessions, preview links and provider keys. Use a long random string |
| `APP_URL` | Public origin of this app, for example `http://127.0.0.1:3100` |
| `TENANCY_MODE` | `single` (default) or `multi` |
| `DEFAULT_SHOP_NAME` | Name given to the first shop |
| `STOREFRONT_URL` | Storefront origin used by hosted checkout when Settings has none |
| `MARKETPLACE_URL` | Marketplace service the admin talks to for apps |

Migrations run at boot. Start the admin:

```sh
pnpm --filter "@kestrel/admin-ui" dev -- --port 3100 --host 127.0.0.1
```

`APP_URL` must match the browser origin exactly. The Vite default is IPv6 `::1`; with `APP_URL=http://localhost:3100` and a browser on `http://127.0.0.1:3100`, Better Auth rejects the origin and sign-in returns 403. Bind the host and set `APP_URL` to the same origin.

Open http://127.0.0.1:3100, create the owner account, name the shop.

Other entry points:

```sh
pnpm dev              # admin plus bundled storefront through scripts/dev.mjs
pnpm --filter @kestrel/docs dev   # documentation site
pnpm build            # production build of the admin
pnpm test             # workspace tests, e2e excluded
```

## Repository layout

```
apps/        admin-ui, docs, stripe, shippo, reviews, cj-dropshipping
modules/     commerce core: catalog, orders, payments, checkout, tenancy, email, files, ...
packages/    app SDK, app-bridge, CLI, marketplace SDK, storefront SDK, create-kestrel
templates/   storefront (Astro + Liquid themes)
deploy/      Docker, Compose and Dokploy templates
```

## Storefront

The bundled storefront renders Liquid themes through Astro. Themes live in `templates/storefront/themes`; the default theme is `ks-bootshop`. The storefront talks to the Storefront API with a public token created in the admin under Settings, Channels.

## Tests

```sh
pnpm test
```

This runs every workspace test suite except `@kestrel/e2e`. The e2e suite has its own script, `pnpm e2e`.

## Documentation

- `apps/docs` is the documentation site, published from `apps/docs/content/docs`
- `docs/architecture.md`, `docs/invariants.md`, `docs/development.md` cover the internals
- `docs/RELEASING.md` covers a release
