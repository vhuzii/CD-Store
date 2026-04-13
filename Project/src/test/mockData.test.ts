import { describe, it, expect } from "vitest";
import {
  GENRES,
  mockCDs,
  mockUsers,
  mockMessages,
  type CDProduct,
  type User,
  type Message,
  type CartItem,
} from "@/lib/mockData";

// ============================================================
// DATA-001..007 — Mock Data
// ============================================================

describe("MockData: GENRES", () => {
  // DATA-001
  it("DATA-001: GENRES містить 10 жанрів", () => {
    expect(GENRES).toHaveLength(10);
  });

  // DATA-002
  it("DATA-002: GENRES містить основні жанри", () => {
    expect(GENRES).toContain("Rock");
    expect(GENRES).toContain("Pop");
    expect(GENRES).toContain("Jazz");
    expect(GENRES).toContain("Electronic");
    expect(GENRES).toContain("Metal");
    expect(GENRES).toContain("Classical");
    expect(GENRES).toContain("Hip-Hop");
    expect(GENRES).toContain("Folk");
    expect(GENRES).toContain("Indie");
    expect(GENRES).toContain("Soundtrack");
  });
});

describe("MockData: mockCDs", () => {
  // DATA-003
  it("DATA-003: mockCDs містить 8 дисків", () => {
    expect(mockCDs).toHaveLength(8);
  });

  // DATA-004
  it("DATA-004: кожен CD має всі обовʼязкові поля", () => {
    mockCDs.forEach((cd) => {
      expect(cd.id).toBeDefined();
      expect(cd.title).toBeTruthy();
      expect(cd.artist).toBeTruthy();
      expect(GENRES as readonly string[]).toContain(cd.genre);
      expect(cd.price).toBeGreaterThan(0);
      expect(cd.year).toBeGreaterThan(1900);
      expect(["Новий", "Б/У відмінний", "Б/У хороший"]).toContain(cd.condition);
      expect(cd.coverUrl).toBeTruthy();
      expect(cd.sellerId).toBeTruthy();
      expect(cd.sellerName).toBeTruthy();
      expect(typeof cd.active).toBe("boolean");
      expect(cd.description).toBeDefined();
    });
  });

  // DATA-005
  it("DATA-005: всі диски мають унікальні id", () => {
    const ids = mockCDs.map((cd) => cd.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // DATA-006
  it("DATA-006: всі початкові диски активні", () => {
    expect(mockCDs.every((cd) => cd.active)).toBe(true);
  });
});

describe("MockData: mockUsers", () => {
  // DATA-007
  it("DATA-007: mockUsers містить 3 користувача з унікальними id", () => {
    expect(mockUsers).toHaveLength(3);
    const ids = mockUsers.map((u) => u.id);
    expect(new Set(ids).size).toBe(3);
    expect(mockUsers[0].name).toBe("Олексій");
    expect(mockUsers[1].name).toBe("Марина");
    expect(mockUsers[2].name).toBe("Дмитро");
  });
});

describe("MockData: mockMessages", () => {
  // DATA-008
  it("DATA-008: mockMessages містить 2 повідомлення", () => {
    expect(mockMessages).toHaveLength(2);
    expect(mockMessages[0].fromUserId).toBe("u1");
    expect(mockMessages[0].toUserId).toBe("u2");
    expect(mockMessages[0].cdRefId).toBe("cd5");
    expect(mockMessages[1].cdRefId).toBeUndefined();
  });
});
