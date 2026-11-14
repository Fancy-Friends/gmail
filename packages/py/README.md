# Gmail

[![Fancified](art/fancified.svg)](https://particle.academy)

Gmail for [fancy-flow][flow] — as **four imported, versioned packages**, one
per runtime. Not vendored source: a copy cannot be upgraded, and third-party APIs
change.

[flow]: https://github.com/Particle-Academy/fancy-flow

| Runtime | Package | Install |
|---|---|---|
| Authoring surface (every host) | `@particle-academy/gmail-ui` | `npm install @particle-academy/gmail-ui` |
| Node | `@particle-academy/gmail-js` | `npm install @particle-academy/gmail-js` |
| PHP 8.4+ | `particle-academy/gmail-php` | `composer require particle-academy/gmail-php` |
| Python 3.11+ | `fancy-gmail` | `pip install fancy-gmail` |

The `ui` package is the editor surface and is React on every host — a PHP or
Python project installs it *and* its own runtime package, and never the `js` one.

## What it costs you

One dependency: `@particle-academy/fancy-connector-core` (or
`particle-academy/fancy-connector-core` on Composer), which the `js` and `php`
packages pull in themselves. The Python package has **zero** runtime
dependencies.

**No Gmail SDK.** Plain HTTP, deliberately: a vendor SDK is third-party code
subject to the kit's full approval bar, and one per provider is hundreds of
dependencies nobody is tracking.

## Setting it up

Everything below is generated from `provider/manifest.json`, so it cannot disagree with what the packages do.

### On Gmail's side

1. **Create (or reuse) the Google Cloud project for **your app's name**** — Every Google connector shares ONE consent grant (oauth.grant "google"), so use one project and one OAuth client for all of them: one consent and one refresh token per person. ([developers.google.com](https://developers.google.com/workspace/guides/create-project))
2. **Enable the Gmail API** — Console: APIs & Services, Library; open the Gmail API and click Enable. ([developers.google.com](https://developers.google.com/workspace/guides/enable-apis))
3. **Configure the consent screen** — Console: Google Auth platform, Branding (app name **your app's name**, support email, contact email), then Audience: Internal for people inside your Google Workspace organisation only, or External (while it is in testing, add each tester under Test users). Then Data Access, Add or Remove Scopes, and add `https://www.googleapis.com/auth/gmail.send` beside the scopes of any other Google connector you use. You cannot remove the consent screen once it is configured. ([developers.google.com](https://developers.google.com/workspace/guides/configure-oauth-consent))
4. **Create a Web application OAuth client** — Console: Google Auth platform, Clients, Create Client; type Web application. Under Authorized redirect URIs click Add URI and paste **your host's OAuth redirect URL**, then Create. Copy the client ID and client secret when the client is created. ([developers.google.com](https://developers.google.com/workspace/guides/create-credentials))
5. **Connect an account and check it works** — Connect one Google account through **your app's name**'s OAuth flow, then run the check below. ([developers.google.com](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send))

Every step in full — who does it, what to paste, which credentials it yields, and how you know it worked — is in [SETUP.md](SETUP.md).

### Credentials

A Gmail connection holds 4 values.

**Two kinds of value, and mixing them up matters.** A `provider` credential is ONE value for the whole installation — an OAuth app's client secret serves every connected account. An `account` credential is one per connected account. A host that stores the second where it stores the first lets one account's credentials reach another's.

| Field | Scope | Secret | Where it comes from |
|---|---|---|---|
| **OAuth client ID** | per installation | not secret | From Google Cloud Console -> APIs & Services -> Credentials. ONE value for the whole installation, not per connected account. |
| **OAuth client secret** | per installation | **secret** | The client secret for the same OAuth app. One value for the whole installation. |
| **Access token** | per connected account | **secret** | Per connected Google account, and it expires after ONE HOUR. The host refreshes it with the refresh token. |
| **Refresh token** | per connected account | **secret** | Per connected Google account. Google issues one only when the consent request asks for offline access; without it the connection dies within the hour. |

### Authorising

Gmail uses OAuth2 (authorization_code). The package DECLARES the exchange; the HOST performs it — a consent screen needs a browser, a redirect URI and somewhere to persist the result, and all three belong to the host.

- **Authorize URL** — https://accounts.google.com/o/oauth2/v2/auth
- **Token URL** — https://oauth2.googleapis.com/token
- **Scopes** — `https://www.googleapis.com/auth/gmail.send`
- **Access token lifetime** — 3600 seconds (1 hours). A host that never refreshes works all afternoon and is broken by morning.

**One consent grant, shared** (`grant: "google"`). Every connector declaring the same grant can run on ONE OAuth client, with one consent and one refresh token per person.

- **Authorize with** `access_type=offline`, `include_granted_scopes=true`. Ask for a feature's scopes when it is first used; the new token covers every scope granted before. A refresh token comes back only on the FIRST exchange, so keep the stored one when an exchange returns none.
- **Revoke** — POST https://oauth2.googleapis.com/revoke with `token`. **It removes the WHOLE grant**: every connector sharing it, not only this one. A per-feature disconnect stops using that feature's scopes locally; only a full disconnect revokes.
- **Identify the account by `sub`**: request `openid`, then verify the token response's id_token (issuer `https://accounts.google.com` or `accounts.google.com`, keys at https://www.googleapis.com/oauth2/v3/certs, audience = `clientId`). Never key a connection by email.
- **No restricted scopes** in this connector.

The refresh tokens do **not** rotate: the same one is reusable, so a refresh may safely be retried and may run concurrently. Stated rather than assumed, because the opposite — a provider that spends the token and revokes the grant on a replay — looks identical until it happens.

### The estate

**Gmail has no test estate, and somebody checked.** Everything this connector does is real. Use the faker to build against it.

> Gmail has no sandbox. A send is a real email to a real address -- point this at your own inbox before pointing it at anybody else's. The faker is the only way to develop against it without delivering mail.

## What it can do

### Actions

#### `message_send` — Gmail message

Send an email from a connected Gmail account.

`POST /gmail/v1/users/{userId}/messages/send` · **unsafe to replay** — a retried durable run does it TWICE

| Input | Required | What it is |
|---|---|---|
| `userId` | yes | Whose mailbox to send from. `me` is the connected account and is almost always what you want. |
| `to` | yes | Recipient address. Several can be given, comma separated, exactly as an email client accepts them. |
| `cc` | no | Copied recipients, comma separated. Left empty the header is omitted entirely rather than sent blank. |
| `subject` | yes | Subject |
| `body` | yes | The plain-text body. It is sent as text/plain; UTF-8, so accented characters and emoji survive. |

## Run it before you have credentials

Every operation ships a **faker**, whether or not Gmail has a sandbox. Set a
node's mode to `fake` and it returns the shape Gmail actually publishes — the
same field names, deterministically — so you can wire the downstream nodes before
touching an account, a key, or a network.

## This repository is generated

`provider/` is the source. Everything under `packages/` is emitted from it and
**must not be hand-edited** — CI regenerates and diffs on every push, and the
next protocol sync destroys anything it finds. See [`AGENTS.md`](AGENTS.md).

## Two namespaces, which do not match on purpose

The repo is `github.com/Fancy-Friends/gmail`; the packages publish under
`particle-academy`. Nothing derives one from the other — the names come from
weaver's `friends.json` and nowhere else.

## Licence

MIT.
