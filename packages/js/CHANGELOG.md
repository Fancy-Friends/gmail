# Changelog

All notable changes to `@particle-academy/gmail-ui`, `@particle-academy/gmail-js`,
`particle-academy/gmail-php` and `fancy-gmail`.

The four packages share one version, because they are generated from one
`provider/` definition and a version that meant something different in each
would be a version nobody could reason about.

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
