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
 * Gmail's node kinds for fancy-flow.
 *
 * Install this on every host. The TypeScript executors live in the js
 * package's `./flow` subpath; PHP and Python hosts run their own and need only
 * this.
 */

export * from "./service.js";
export * from "./kinds/message-send.js";

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { gmailMessageKind } from "./kinds/message-send.js";

/** Every Gmail kind, for a host that registers the lot. */
export const GMAIL_KINDS: NodeKindDefinition[] = [
  gmailMessageKind,
];
