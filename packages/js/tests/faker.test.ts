/**
 * GENERATED FILE — do not edit.
 *
 * Emitted from provider/fixtures/ by weaver's generator.
 * A hand-edit here is destroyed by the next protocol sync, which is worse than
 * being rejected, because it works until it silently does not. Fix
 * provider/fixtures/ (or weaver's template/) and regenerate:
 *
 *     npm run provider -- gmail
 */

/**
 * The golden fixtures.
 *
 * Deterministic on purpose: the same seed produces the same bytes in
 * TypeScript, PHP and Python, so this file and its twins in the other packages
 * assert the SAME values. That turns the faker into a parity test rather than
 * a convenience — which matters, because cross-runtime drift does not fail
 * loudly. It completes, down one path, with no error.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { fakeRequest } from "@particle-academy/fancy-connector-core";

import { gmailFaker } from "../src/faker.js";

test("message_send fakes the shape Gmail publishes", () => {
  const config = {};

  const faked = gmailFaker("message_send", fakeRequest("gmail", "message_send", config));

  assert.deepEqual(faked, {
    "id": "f09aa8e415493ec7",
    "threadId": "f09aa8e415493ec7",
    "labelIds": [
      "SENT"
    ]
  });
});

test("an operation with no fixture throws rather than inventing a shape", () => {
  assert.throws(() => gmailFaker("no_such_operation", fakeRequest("gmail", "no_such_operation", {})), /no fake response/);
});
