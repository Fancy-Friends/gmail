/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ + triggers/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ + triggers/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */

/**
 * Gmail's node kinds with their TypeScript executors attached — for hosts that
 * EXECUTE on TS.
 *
 * The authoring surface in @particle-academy/gmail-ui carries no executor: the
 * editor is React on every host, so a PHP or Python project installs the ui
 * package and never this one.
 */

import type { NodeExecutor, NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import {
  idempotencyKeyFor,
  NO_IDEMPOTENCY_KEY_WARNING,
  resolveConnection,
  triggerEvent,
  type RequestedMode,
} from "@particle-academy/fancy-connector-core";
import { GMAIL } from "./service.js";

import {
  gmailMessageKind,
} from "@particle-academy/gmail-ui";

import { gmailMessageSend } from "./actions/message-send.js";

export const gmailMessageExecutor: NodeExecutor = async (ctx) => {
  const config = ((ctx.node.data as { config?: Record<string, unknown> })?.config ?? {});

  const result = await gmailMessageSend({
    config,
    input: ctx.inputs?.in,
  });

  ctx.emit({
    type: "log",
    level: "info",
    nodeId: ctx.node.id,
    message: `gmail message_send ${(result.data as { id?: string })?.id} (${result.mode})`,
  });

  return { __port: "out", value: result };
};

/** The kinds a TypeScript host registers. */
export const GMAIL_RUNNABLE_KINDS: NodeKindDefinition[] = [
  { ...gmailMessageKind, executor: gmailMessageExecutor },
];
