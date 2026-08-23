/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/message-send.json by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/message-send.json (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */

/**
 * Send an email from a connected Gmail account.
 *
 * POST /gmail/v1/users/{userId}/messages/send —
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
 *
 * Notice what is NOT here: no key, no base URL, no mode check, no retry loop,
 * no fake/real branch. This describes the request; callConnector resolves the
 * connection, picks the estate, and either calls Gmail or calls the faker.
 *
 * sideEffects: unsafe-to-replay.
 */

import {
  callConnector,
  type ConnectorResult,
  type RequestedMode,
  type Transport,
} from "@particle-academy/fancy-connector-core";
import { GMAIL } from "../service.js";

export const MESSAGE_SEND_OPERATION = "message_send";

export type MessageSendOptions = {
  /** The node's resolved config. Keys: userId, to, cc, subject, body. */
  config: Record<string, unknown>;
  credentials?: Record<string, string | undefined>;
  mode?: RequestedMode;
  connectionId?: string | null;
  input?: unknown;
  attempts?: number;
  /** Override the transport. The only way to exercise this without a network. */
  transport?: Transport;
};

export async function gmailMessageSend(options: MessageSendOptions): Promise<ConnectorResult> {
  const config = options.config ?? {};

  if (config.userId === undefined || config.userId === null || config.userId === "") {
    throw new Error(`message_send: "userId" is required (Send as).`);
  }

  if (config.to === undefined || config.to === null || config.to === "") {
    throw new Error(`message_send: "to" is required (To).`);
  }

  if (config.subject === undefined || config.subject === null || config.subject === "") {
    throw new Error(`message_send: "subject" is required (Subject).`);
  }

  if (config.body === undefined || config.body === null || config.body === "") {
    throw new Error(`message_send: "body" is required (Message).`);
  }

  return callConnector(GMAIL, {
    operation: MESSAGE_SEND_OPERATION,
    config,
    input: options.input,
    ...(options.credentials === undefined ? {} : { credentials: options.credentials }),
    ...(options.mode === undefined ? {} : { mode: options.mode }),
    ...(options.connectionId === undefined ? {} : { connectionId: options.connectionId }),
    ...(options.attempts === undefined ? {} : { attempts: options.attempts }),
    ...(options.transport === undefined ? {} : { transport: options.transport }),
    request: {
      method: "POST",
      path: `/gmail/v1/users/${encodeURIComponent(String(config.userId))}/messages/send`,
      json: {
        "raw": composeMessage(config),
      },
    },
  });
}


/**
 * The whole message, RFC 2822 and base64url — which is what the provider takes.
 *
 * base64url is NOT base64: `+` and `/` become `-` and `_` and the `=` padding
 * is stripped. A message whose bytes happen to avoid those two characters
 * encodes identically either way, so reaching for the standard function is a
 * bug that ships and waits for an address containing the byte that differs.
 */
function composeMessage(config: Record<string, unknown>): string {
  const lines: string[] = [];

  for (const [name, value] of [
    ["To", config.to],
    ["Cc", config.cc],
    ["Subject", config.subject],
  ] as const) {
    const text = value === undefined || value === null ? "" : String(value);
    // An optional header left empty is omitted entirely: `Cc:` with nothing
    // after it is a malformed header, not an empty one.
    if (!text) continue;

    if (/[\r\n]/.test(text)) {
      // Refused, not sanitised. A subject carrying `\r\nBcc: …` would add
      // headers of the sender's choosing from a field a form fills, and
      // silently dropping half of somebody's subject line is its own surprise.
      throw new Error(
        `${name} contains a newline, which would inject another header into the message.`,
      );
    }

    lines.push(`${name}: ${text}`);
  }

  // The body's own newlines are normalised to CRLF too: a bare LF inside a
  // message is what a strict receiver rejects, and authors paste bare LFs.
  const body = String(config.body ?? "").replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");

  // Headers, ONE BLANK LINE, then the body. Without the blank line the body is
  // parsed as more headers and the mail arrives empty, with no error anywhere.
  const message = `${lines.join("\r\n")}\r\n\r\n${body}`;

  return Buffer.from(message, "utf8")
    .toString("base64")
    .split("+")
    .join("-")
    .split("/")
    .join("_")
    .split("=")
    .join("");
}