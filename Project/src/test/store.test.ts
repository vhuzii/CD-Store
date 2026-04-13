import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "@/lib/store";
import { mockCDs, mockUsers, mockMessages } from "@/lib/mockData";

// Скидаємо стор перед кожним тестом
beforeEach(() => {
  useAppStore.setState({
    currentUser: null,
    cds: mockCDs,
    cart: [],
    messages: mockMessages,
    users: mockUsers,
  });
});

// ============================================================
// STORE-001..015 — Zustand Store
// ============================================================

describe("Store: Початковий стан", () => {
  // STORE-001
  it("STORE-001: currentUser за замовчуванням null", () => {
    expect(useAppStore.getState().currentUser).toBeNull();
  });

  // STORE-002
  it("STORE-002: cds містить mockCDs (8 дисків)", () => {
    expect(useAppStore.getState().cds).toHaveLength(8);
    expect(useAppStore.getState().cds).toEqual(mockCDs);
  });

  // STORE-003
  it("STORE-003: cart порожній за замовчуванням", () => {
    expect(useAppStore.getState().cart).toEqual([]);
  });

  // STORE-004
  it("STORE-004: messages містить mockMessages", () => {
    expect(useAppStore.getState().messages).toEqual(mockMessages);
  });

  // STORE-005
  it("STORE-005: users містить mockUsers (3 користувача)", () => {
    expect(useAppStore.getState().users).toHaveLength(3);
  });
});

describe("Store: Авторизація", () => {
  // STORE-006
  it("STORE-006: login встановлює currentUser за userId", () => {
    useAppStore.getState().login("u1");
    expect(useAppStore.getState().currentUser).toEqual(mockUsers[0]);
    expect(useAppStore.getState().currentUser?.name).toBe("Олексій");
  });

  // STORE-007
  it("STORE-007: login з неіснуючим userId не змінює стан", () => {
    useAppStore.getState().login("nonexistent");
    expect(useAppStore.getState().currentUser).toBeNull();
  });

  // STORE-008
  it("STORE-008: logout скидає currentUser та очищує cart", () => {
    useAppStore.getState().login("u1");
    useAppStore.getState().addToCart(mockCDs[0]);
    expect(useAppStore.getState().cart).toHaveLength(1);

    useAppStore.getState().logout();
    expect(useAppStore.getState().currentUser).toBeNull();
    expect(useAppStore.getState().cart).toEqual([]);
  });

  // STORE-009
  it("STORE-009: register створює нового користувача та авторизує", () => {
    useAppStore.getState().register("Тест Юзер");
    const state = useAppStore.getState();
    expect(state.currentUser).not.toBeNull();
    expect(state.currentUser?.name).toBe("Тест Юзер");
    expect(state.users).toHaveLength(4);
    expect(state.users[3].name).toBe("Тест Юзер");
  });
});

describe("Store: Корзина", () => {
  // STORE-010
  it("STORE-010: addToCart додає диск у корзину", () => {
    useAppStore.getState().addToCart(mockCDs[0]);
    const cart = useAppStore.getState().cart;
    expect(cart).toHaveLength(1);
    expect(cart[0].cd.id).toBe("cd1");
    expect(cart[0].quantity).toBe(1);
  });

  // STORE-011
  it("STORE-011: addToCart не додає дублікат", () => {
    useAppStore.getState().addToCart(mockCDs[0]);
    useAppStore.getState().addToCart(mockCDs[0]);
    expect(useAppStore.getState().cart).toHaveLength(1);
  });

  // STORE-012
  it("STORE-012: removeFromCart видаляє товар з корзини", () => {
    useAppStore.getState().addToCart(mockCDs[0]);
    useAppStore.getState().addToCart(mockCDs[1]);
    expect(useAppStore.getState().cart).toHaveLength(2);

    useAppStore.getState().removeFromCart("cd1");
    expect(useAppStore.getState().cart).toHaveLength(1);
    expect(useAppStore.getState().cart[0].cd.id).toBe("cd2");
  });

  // STORE-013
  it("STORE-013: clearCart очищує всю корзину", () => {
    useAppStore.getState().addToCart(mockCDs[0]);
    useAppStore.getState().addToCart(mockCDs[1]);
    useAppStore.getState().clearCart();
    expect(useAppStore.getState().cart).toEqual([]);
  });
});

describe("Store: Управління CD-дисками", () => {
  // STORE-014
  it("STORE-014: addCD додає новий диск для авторизованого користувача", () => {
    useAppStore.getState().login("u1");
    useAppStore.getState().addCD({
      title: "Тест Альбом",
      artist: "Тест Виконавець",
      genre: "Rock",
      price: 100,
      year: 2024,
      condition: "Новий",
      description: "Опис",
      coverUrl: "https://example.com/cover.jpg",
    });
    const cds = useAppStore.getState().cds;
    expect(cds).toHaveLength(9);
    const newCD = cds[8];
    expect(newCD.title).toBe("Тест Альбом");
    expect(newCD.sellerId).toBe("u1");
    expect(newCD.sellerName).toBe("Олексій");
    expect(newCD.active).toBe(true);
  });

  // STORE-015
  it("STORE-015: addCD не додає диск для неавторизованого", () => {
    useAppStore.getState().addCD({
      title: "Тест",
      artist: "Тест",
      genre: "Rock",
      price: 100,
      year: 2024,
      condition: "Новий",
      description: "",
      coverUrl: "",
    });
    expect(useAppStore.getState().cds).toHaveLength(8);
  });

  // STORE-016
  it("STORE-016: toggleCDActive змінює стан active диска для власника", () => {
    useAppStore.getState().login("u1");
    expect(useAppStore.getState().cds.find(cd => cd.id === "cd1")?.active).toBe(true);

    useAppStore.getState().toggleCDActive("cd1");
    expect(useAppStore.getState().cds.find(cd => cd.id === "cd1")?.active).toBe(false);

    useAppStore.getState().toggleCDActive("cd1");
    expect(useAppStore.getState().cds.find(cd => cd.id === "cd1")?.active).toBe(true);
  });

  // STORE-017
  it("STORE-017: toggleCDActive не змінює чужий диск", () => {
    useAppStore.getState().login("u3"); // Дмитро
    useAppStore.getState().toggleCDActive("cd1"); // належить u1
    expect(useAppStore.getState().cds.find(cd => cd.id === "cd1")?.active).toBe(true);
  });
});

describe("Store: Повідомлення", () => {
  // STORE-018
  it("STORE-018: sendMessage додає повідомлення для авторизованого", () => {
    useAppStore.getState().login("u1");
    useAppStore.getState().sendMessage("u2", "Привіт!");
    const msgs = useAppStore.getState().messages;
    expect(msgs).toHaveLength(3);
    const last = msgs[2];
    expect(last.fromUserId).toBe("u1");
    expect(last.toUserId).toBe("u2");
    expect(last.text).toBe("Привіт!");
  });

  // STORE-019
  it("STORE-019: sendMessage з cdRefId", () => {
    useAppStore.getState().login("u1");
    useAppStore.getState().sendMessage("u2", "Є цей диск?", "cd5");
    const msgs = useAppStore.getState().messages;
    const last = msgs[msgs.length - 1];
    expect(last.cdRefId).toBe("cd5");
  });

  // STORE-020
  it("STORE-020: sendMessage не працює без авторизації", () => {
    useAppStore.getState().sendMessage("u2", "Текст");
    expect(useAppStore.getState().messages).toHaveLength(2);
  });
});
