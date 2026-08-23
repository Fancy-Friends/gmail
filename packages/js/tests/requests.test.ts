/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/actions/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/actions/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */

/**
 * What Gmail actually receives.
 *
 * Every assertion below is about the request rather than the response, and
 * none of it touches the network: the transport is a stub that records what it
 * was handed.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import type { PreparedRequest } from "@particle-academy/fancy-connector-core";

import { gmailMessageSend } from "../src/actions/message-send.js";

/** Capture the prepared request instead of sending it. */
function capture() {
  const seen: PreparedRequest[] = [];

  return {
    seen,
    transport: async (request: PreparedRequest) => {
      seen.push(request);

      return { status: 200, body: JSON.stringify({ id: "captured" }), headers: {} };
    },
  };
}

const CREDENTIALS = {
  "clientId": "test_clientId",
  "clientSecret": "test_clientSecret",
  "accessToken": "test_accessToken",
  "refreshToken": "test_refreshToken"
};

test("message_send sends POST /gmail/v1/users/{userId}/messages/send", async () => {
  const { seen, transport } = capture();

  await gmailMessageSend({
    config: {
      "userId": "example-userId",
      "to": "example-to",
      "cc": "example-cc",
      "subject": "example-subject",
      "body": "example-body"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen.length, 1);
  assert.equal(seen[0]!.method, "POST");
  assert.ok(new URL(seen[0]!.url).pathname.endsWith("/gmail/v1/users/example-userId/messages/send"), seen[0]!.url);

  assert.deepEqual(JSON.parse(String(seen[0]!.body ?? "{}")), {
    "raw": "VG86IGV4YW1wbGUtdG8NCkNjOiBleGFtcGxlLWNjDQpTdWJqZWN0OiBleGFtcGxlLXN1YmplY3QNCg0KZXhhbXBsZS1ib2R5"
  });
});

test("the credential is placed the way the provider wants it", async () => {
  const { seen, transport } = capture();

  await gmailMessageSend({
    config: {
      "userId": "example-userId",
      "to": "example-to",
      "cc": "example-cc",
      "subject": "example-subject",
      "body": "example-body"
    },
    credentials: CREDENTIALS,
    mode: "live",
    transport,
  });

  assert.equal(seen[0]!.headers.Authorization, "Bearer test_accessToken");
});

test("a missing required field is refused BEFORE anything is sent", async () => {
  // Nothing was attempted, so there is nothing to classify — and the message names
  // the field, rather than letting the provider answer three frames later with
  // "invalid request".
  const { seen, transport } = capture();

  await assert.rejects(
    gmailMessageSend({
      config: {
        "to": "example-to",
        "cc": "example-cc",
        "subject": "example-subject",
        "body": "example-body"
      },
      credentials: CREDENTIALS,
      mode: "live",
      transport,
    }),
    new RegExp("userId"),
  );

  assert.equal(seen.length, 0, "the request must not have been sent");
});
