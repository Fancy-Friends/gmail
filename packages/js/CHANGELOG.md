# Changelog

All notable changes to `@particle-academy/gmail-ui`, `@particle-academy/gmail-js`,
`particle-academy/gmail-php` and `fancy-gmail`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

## [0.3.0] — 2026-08-24

### Added

- **The README now says how to SET THIS CONNECTOR UP**, in the package itself.

Until now it explained what the four packages are, what they cost and why the
repo is generated — and said nothing about credentials, scopes, sandboxes or
operations. Somebody who installed it could not learn from it which credentials
a connection needs, where a human GETS them, which scopes to request, or what
the connector can actually do. All of that was already in the definition; the
one document a consumer reads was the one that omitted everything actionable.

The new **Setting it up** section carries:

- every credential, with the text saying where the value comes from, whether it
  is **per installation** or **per connected account**, and whether it is secret;
- the OAuth authorize and token URLs and the exact scopes, verbatim;
- the access-token lifetime, and where refresh tokens ROTATE, the two things a
  host must not do — retry a failed refresh, or refresh concurrently — because a
  replay revokes the entire grant and nothing in the failure says why;
- the estate in this provider's own terms, including the cases where a
  successful-looking run reaches nobody, or reaches the real one;
- every action and trigger with its method, path, inputs, and whether it is safe
  to replay;
- a trigger's provider-side setup, which nobody can derive from anything else.

It is **generated from `provider/manifest.json`**, so it cannot drift from what
the packages do — which is the point at a few hundred providers, where a
hand-written setup section is a few hundred documents going quietly stale.

No code changed. This release exists because a registry and an installing agent
read the PUBLISHED artifact, and the artifact carried the old README.

## [0.2.0] — 2026-08-24

### Changed

- **`@particle-academy/gmail-ui` is now an OPTIONAL PEER dependency of `@particle-academy/gmail-js`, not a hard one.**

`./flow` needs it; nothing else does. It was a hard dependency, and because
`@particle-academy/gmail-ui` itself peer-depends on `fancy-flow` — which npm 7+ installs
automatically — `npm install @particle-academy/gmail-js` pulled the **entire flow engine**
onto disk for a consumer who only wanted to call the API. Roughly **18 MB
became 874 KB**, and the package works exactly as before:

```js
import { gmail… } from "@particle-academy/gmail-js";
// an injected transport, no flow engine anywhere
```

**This is breaking if you use `@particle-academy/gmail-js/flow`.** Add `@particle-academy/gmail-ui` to your own
dependencies — it was always being installed for you, and now it is declared.
Everything importing only the main entry point is unaffected.

The fix is on this edge rather than on `@particle-academy/gmail-ui` → `fancy-flow`: the ui package
genuinely requires fancy-flow, since it calls `defineConnectorKind`, and marking
that peer optional would be a lie about what it needs.

## [0.1.0] — 2026-08-23

First release. Provider nine, and the second Google connector.

### Added

- `message_send` — send an email from a connected account.
  `POST /gmail/v1/users/{userId}/messages/send`.
- A faker for it, so the node runs on a canvas without sending mail.

### Gmail does not take `to`, `subject` and `body`

It takes **one opaque string**. Quoting Google's own discovery document, the
`Message.raw` field is *"the entire email message in an RFC 2822 formatted and
base64url encoded string"*.

Nobody hand-writes RFC 2822, so a connector exposing `raw` directly would be
useless. The generated code composes the message from the fields you fill —
which is the first time the vocabulary has built **one value out of several**.

**base64url is not base64.** `+` and `/` become `-` and `_`, and the `=` padding
is stripped. A runtime reaching for its standard base64 function produces a
string Gmail rejects — or, when the message's bytes happen to avoid the two
substituted characters, one it *accepts*, right up until an address contains the
byte that differs. The parity suite proves all three runtimes emit the same
bytes for the same message.

### A header cannot inject another header

A subject carrying a newline would otherwise add headers of the sender's
choosing — `Bcc:` being the interesting one — from a field a web form fills. The
composer **refuses** such a value rather than sanitising it, because silently
dropping half of somebody's subject line is its own surprise.

An empty optional header is omitted entirely, rather than sent as `Cc:` with
nothing after it.

### The scope is `gmail.send`, and that was a real choice

The discovery document lists `https://mail.google.com/` **first** for this
method — full read, write and delete across the entire mailbox. Taking the first
entry would let an automation delete somebody's mail in order to send one
message. `gmail.send` cannot read a single message.

### No sandbox, and no idempotency

`sandbox` is `none` — **checked**. There is one API and a test mailbox is a real
mailbox: anything this sends is delivered, to a real person.

`messages.send` takes no idempotency key. So it is `unsafe-to-replay` with no
way to make it safe, and a retried durable run sends a **second email** — the
least recallable side effect in this estate so far.

### Access tokens last one hour

Google's do. A connection that is never refreshed stops working within the day,
which is why `refreshToken` is required rather than optional.

[0.1.0]: https://github.com/Fancy-Friends/gmail/releases/tag/v0.1.0
[0.2.0]: https://github.com/Fancy-Friends/gmail/releases/tag/v0.2.0
[0.3.0]: https://github.com/Fancy-Friends/gmail/releases/tag/v0.3.0
