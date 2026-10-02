import test from "node:test";
import assert from "node:assert/strict";
import { ESLint } from "eslint";

const eslint = new ESLint();

test("lint protects client directive ordering while accepting valid client modules", async () => {
  const bad = await eslint.lintText(
    'import { useState } from "react"; "use client"; export function Example() { return useState(0); }',
    { filePath: "features/movies/lint-fixture.ts" },
  );
  assert.ok(
    bad[0].messages.some(
      (message) =>
        message.ruleId === "no-restricted-syntax" &&
        message.message.includes("start of the module"),
    ),
  );
  const good = await eslint.lintText(
    '"use client"; import { useState } from "react"; export function Example() { return useState(0); }',
    { filePath: "features/movies/lint-fixture.ts" },
  );
  assert.equal(good[0].errorCount, 0);
});

test("lint enforces feature ownership and named application exports", async () => {
  const feature = await eslint.lintText(
    'import { RootLayout } from "@/app/layout"; export default function Example() { return RootLayout; }',
    { filePath: "features/movies/lint-fixture.ts" },
  );
  assert.ok(
    feature[0].messages.some(
      (message) => message.ruleId === "no-restricted-imports",
    ),
  );
  assert.ok(
    feature[0].messages.some(
      (message) => message.ruleId === "no-restricted-syntax",
    ),
  );
  const infrastructure = await eslint.lintText(
    'import { useAuth } from "@/features/auth/auth-provider"; export function Example() { return useAuth; }',
    { filePath: "lib/lint-fixture.ts" },
  );
  assert.ok(
    infrastructure[0].messages.some(
      (message) => message.ruleId === "no-restricted-imports",
    ),
  );
  const barrel = await eslint.lintText('export * from "./types";', {
    filePath: "features/search/lint-fixture.ts",
  });
  assert.ok(
    barrel[0].messages.some(
      (message) => message.ruleId === "no-restricted-syntax",
    ),
  );
});
