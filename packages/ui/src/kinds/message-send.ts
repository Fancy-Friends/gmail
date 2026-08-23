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
 * Gmail message — Send an email from a connected Gmail account.
 *
 * https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send
 *
 * `unsafe-to-replay`.
 */

import type { NodeKindDefinition } from "@particle-academy/fancy-flow/engine";
import { defineConnectorKind, summarize, type OutputField } from "@particle-academy/fancy-flow/connectors";
import { gmailMeta } from "../service.js";

export const GMAIL_MESSAGE_KIND = "@particle-academy/gmail_message";
export const GMAIL_MESSAGE_OPERATION = "message_send";

export const GMAIL_MESSAGE_META = gmailMeta("action", "send an email", "https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/send");

/**
 * What this node emits — the "ingredients" a downstream node can reference.
 *
 * fancy-flow reads `outputShape` off the kind and offers it in the variable
 * picker, so declaring it is the whole of the work: an author configuring the
 * next node picks `{{ $json.data.id }}` off a list instead of typing a path
 * and hoping.
 */
export const GMAIL_MESSAGE_OUTPUT: OutputField[] = [
  {
    "path": "data.id",
    "type": "string",
    "description": "Gmail's id for the sent message."
  },
  {
    "path": "data.threadId",
    "type": "string",
    "description": "The thread it landed in. Gmail groups by subject and references, so a reply to an existing conversation shares this."
  },
  {
    "path": "data.labelIds",
    "type": "array",
    "description": "Labels Gmail applied, typically SENT."
  }
];

export const gmailMessageKind: NodeKindDefinition = defineConnectorKind(GMAIL_MESSAGE_META, {
  name: GMAIL_MESSAGE_KIND,
  aliases: ["gmail_message"],
  label: "Gmail message",
  description: "Send an email from a connected Gmail account.",
  inputs: [{ id: "in" }],
  outputs: [{ id: "out" }],
  sideEffects: "unsafe-to-replay",
  outputShape: GMAIL_MESSAGE_OUTPUT,
  configSchema: [
    {
      "type": "text",
      "key": "userId",
      "label": "Send as",
      "required": true,
      "default": "me",
      "description": "Whose mailbox to send from. `me` is the connected account and is almost always what you want."
    },
    {
      "type": "text",
      "key": "to",
      "label": "To",
      "required": true,
      "description": "Recipient address. Several can be given, comma separated, exactly as an email client accepts them."
    },
    {
      "type": "text",
      "key": "cc",
      "label": "Cc",
      "description": "Copied recipients, comma separated. Left empty the header is omitted entirely rather than sent blank."
    },
    {
      "type": "text",
      "key": "subject",
      "label": "Subject",
      "required": true
    },
    {
      "type": "textarea",
      "key": "body",
      "label": "Message",
      "required": true,
      "description": "The plain-text body. It is sent as text/plain; UTF-8, so accented characters and emoji survive."
    }
  ],
  defaultConfig: {
    "mode": "auto"
  },
  renderBody: ({ config }) =>
    summarize(GMAIL_MESSAGE_META, config as Record<string, unknown>, "send an email"),
});
