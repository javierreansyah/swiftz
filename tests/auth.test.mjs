import test from "node:test";
import assert from "node:assert/strict";
import { getApprovedRequestToken } from "../features/auth/callback.ts";

test("authentication only accepts the approved token requested by this browser", () => {
  const approved = new URLSearchParams("approved=true&request_token=own-token");
  assert.equal(getApprovedRequestToken(approved, "own-token"), "own-token");
  assert.equal(getApprovedRequestToken(approved, null), null);
  assert.equal(getApprovedRequestToken(approved, "different-token"), null);
  assert.equal(
    getApprovedRequestToken(new URLSearchParams("approved=true"), "own-token"),
    null,
  );
  assert.equal(
    getApprovedRequestToken(
      new URLSearchParams("approved=false&request_token=own-token"),
      "own-token",
    ),
    null,
  );
});
