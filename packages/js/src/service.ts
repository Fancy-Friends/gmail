/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/manifest.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/manifest.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */

/**
 * Gmail, as one service descriptor shared by every Gmail operation.
 *
 * @particle-academy/fancy-connector-core carries what is true of ALL
 * connectors. This carries what is true of Gmail: its base URL, its auth
 * scheme, its idempotency header, and its faker.
 *
 * ## The sandbox trap, written down where it is used
 *
 * Gmail has no sandbox. A send is a real email to a real address -- point this
 * at your own inbox before pointing it at anybody else's. The faker is the
 * only way to develop against it without delivering mail.
 */

import type { ConnectorMode, PreparedRequest, ServiceDescriptor } from "@particle-academy/fancy-connector-core";

import { gmailFaker } from "./faker.js";

/**
 * The connector API version this package was GENERATED against.
 *
 * A literal, never imported. An imported constant lets an upgrade rewrite the
 * very claim it exists to detect, after which the copy agrees with itself
 * forever.
 */
export const CONNECTOR_API_VERSION = 1;

export const GMAIL_BASE_URLS = {
  "live": "https://gmail.googleapis.com"
} as const;

/** Credential keys a remote call cannot proceed without. */
export const GMAIL_REQUIRES = [
  "accessToken",
  "refreshToken",
  "clientId",
  "clientSecret"
] as const;

/**
 * Apply Gmail's auth scheme to an outgoing request.
 *
 *
 *
 * The mode is passed in because for some providers auth and estate are the
 * same decision expressed in the URL; here it is unused, and saying so is
 * cheaper than wondering later whether it was forgotten.
 */
export function gmailAuthorize(
  credentials: Record<string, string | undefined>,
  request: PreparedRequest,
  _mode: ConnectorMode,
): void {
  request.headers.Authorization = `Bearer ${credentials.accessToken ?? ""}`;
}

/** The Gmail service, for the TypeScript runtime. */
export const GMAIL: ServiceDescriptor = {
  service: "gmail",
  title: "Gmail",
  sandbox: "none",
  baseUrls: { ...GMAIL_BASE_URLS },
  requires: [...GMAIL_REQUIRES],
  authorize: gmailAuthorize,
  faker: gmailFaker,
};
