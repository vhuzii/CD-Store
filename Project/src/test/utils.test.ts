import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

// ============================================================
// UTIL-001..002 — Utils
// ============================================================

describe("Utils: cn()", () => {
  // UTIL-001
  it("UTIL-001: обʼєднує CSS-класи", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  // UTIL-002
  it("UTIL-002: мерджить tailwind-класи без конфліктів", () => {
    const result = cn("px-4 py-2", "px-6");
    expect(result).toBe("py-2 px-6");
  });
});
