import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { mockCDs, mockUsers, mockMessages } from "@/lib/mockData";
import React from "react";

// Мокаємо framer-motion, щоб уникнути проблем з анімаціями у тестах
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <h1 {...props}>{children}</h1>,
    form: ({ children, onSubmit, ...props }: React.PropsWithChildren<React.FormHTMLAttributes<HTMLFormElement>>) => (
      <form onSubmit={onSubmit} {...props}>{children}</form>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Мокаємо Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) }),
    }),
  },
}));

// Мокаємо useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    loading: false,
    signOut: vi.fn(),
  }),
}));

// Імпортуємо компоненти після моків
import CatalogPage from "@/pages/CatalogPage";
import CartPage from "@/pages/CartPage";
import CDDetailPage from "@/pages/CDDetailPage";
import NotFound from "@/pages/NotFound";
import AuthPage from "@/pages/AuthPage";
import MessagesPage from "@/pages/MessagesPage";
import CheckoutPage from "@/pages/CheckoutPage";
import SellPage from "@/pages/SellPage";
import CDCard from "@/components/CDCard";
import Navbar from "@/components/Navbar";

// Хелпер для рендеру з роутером
const renderWithRouter = (ui: React.ReactElement, { route = "/" } = {}) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};

const renderWithRouterAndRoutes = (route: string) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/cd/:cdId" element={<CDDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  );
};

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
// COMP-001..010 — Компоненти та сторінки
// ============================================================

describe("CatalogPage: Рендер та фільтрація", () => {
  // COMP-001
  it("COMP-001: рендерить всі 8 активних CD-карток", () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText("Знайди свій")).toBeDefined();
    expect(screen.getByText("диск")).toBeDefined();
    // Перевіряємо наявність деяких дисків
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText("Random Access Memories")).toBeDefined();
    expect(screen.getByText("Kind of Blue")).toBeDefined();
  });

  // COMP-002
  it("COMP-002: показує заголовок маркетплейсу", () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.getByText("Маркетплейс CD-дисків в Україні")).toBeDefined();
  });

  // COMP-003
  it("COMP-003: фільтрує за жанром при кліку", () => {
    renderWithRouter(<CatalogPage />);
    const rockButton = screen.getByRole("button", { name: "Rock" });
    fireEvent.click(rockButton);
    // Rock має 2 диски: Nevermind та Океан Ельзи
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText("Океан Ельзи — Без меж")).toBeDefined();
    // Electronic диск не має бути видимий
    expect(screen.queryByText("Random Access Memories")).toBeNull();
  });

  // COMP-004
  it("COMP-004: пошук за виконавцем фільтрує картки", () => {
    renderWithRouter(<CatalogPage />);
    const searchInput = screen.getByPlaceholderText("Пошук по виконавцю...");
    fireEvent.change(searchInput, { target: { value: "Nirvana" } });
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.queryByText("Random Access Memories")).toBeNull();
  });

  // COMP-005
  it("COMP-005: показує 'Нічого не знайдено' при пустому результаті", () => {
    renderWithRouter(<CatalogPage />);
    const searchInput = screen.getByPlaceholderText("Пошук по виконавцю...");
    fireEvent.change(searchInput, { target: { value: "XXXXXXX" } });
    expect(screen.getByText("Нічого не знайдено")).toBeDefined();
  });

  // COMP-006
  it("COMP-006: показує кнопку 'Скинути фільтри' при активному фільтрі", () => {
    renderWithRouter(<CatalogPage />);
    expect(screen.queryByText("Скинути фільтри")).toBeNull();
    const rockButton = screen.getByRole("button", { name: "Rock" });
    fireEvent.click(rockButton);
    expect(screen.getByText("Скинути фільтри")).toBeDefined();
  });

  // COMP-007
  it("COMP-007: скидає фільтри при кліку 'Скинути фільтри'", () => {
    renderWithRouter(<CatalogPage />);
    const rockButton = screen.getByRole("button", { name: "Rock" });
    fireEvent.click(rockButton);
    expect(screen.queryByText("Random Access Memories")).toBeNull();

    const resetButton = screen.getByText("Скинути фільтри");
    fireEvent.click(resetButton);
    // Після скидання — всі диски знову видимі
    expect(screen.getByText("Random Access Memories")).toBeDefined();
  });

  // COMP-008
  it("COMP-008: рендерить сторінку продавця з його дисками", () => {
    renderWithRouter(<CatalogPage sellerId="u1" />);
    expect(screen.getByText("Олексій")).toBeDefined();
    // u1 має 3 диски: Nevermind, Kind of Blue, Interstellar OST
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText("Kind of Blue")).toBeDefined();
    expect(screen.getByText("Interstellar OST")).toBeDefined();
    // Диск іншого продавця не видно
    expect(screen.queryByText("Random Access Memories")).toBeNull();
  });
});

describe("CDDetailPage: Сторінка деталей", () => {
  // COMP-009
  it("COMP-009: показує деталі існуючого CD", () => {
    renderWithRouterAndRoutes("/cd/cd1");
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText("Nirvana")).toBeDefined();
    expect(screen.getByText("350 ₴")).toBeDefined();
    expect(screen.getByText(/Рік: 1991/)).toBeDefined();
    expect(screen.getByText(/Б\/У відмінний/)).toBeDefined();
    expect(screen.getByText("Класичний альбом гранжу у відмінному стані.")).toBeDefined();
  });

  // COMP-010
  it("COMP-010: показує 'Диск не знайдено' для неіснуючого id", () => {
    renderWithRouterAndRoutes("/cd/nonexistent");
    expect(screen.getByText("Диск не знайдено")).toBeDefined();
  });

  // COMP-011
  it("COMP-011: не показує кнопки для неавторизованого користувача", () => {
    renderWithRouterAndRoutes("/cd/cd1");
    expect(screen.queryByText("Додати до корзини")).toBeNull();
    expect(screen.queryByText("Написати")).toBeNull();
  });

  // COMP-012
  it("COMP-012: показує кнопки для авторизованого (не власника)", () => {
    useAppStore.setState({ currentUser: mockUsers[1] }); // Марина, cd1 належить u1
    renderWithRouterAndRoutes("/cd/cd1");
    expect(screen.getByText("Додати до корзини")).toBeDefined();
    expect(screen.getByText("Написати")).toBeDefined();
  });

  // COMP-013
  it("COMP-013: не показує кнопки для власника диска", () => {
    useAppStore.setState({ currentUser: mockUsers[0] }); // Олексій — власник cd1
    renderWithRouterAndRoutes("/cd/cd1");
    expect(screen.queryByText("Додати до корзини")).toBeNull();
  });
});

describe("CartPage: Корзина", () => {
  // COMP-014
  it("COMP-014: показує повідомлення для неавторизованого", () => {
    renderWithRouter(<CartPage />);
    expect(screen.getByText("Увійдіть, щоб переглянути корзину")).toBeDefined();
  });

  // COMP-015
  it("COMP-015: показує порожню корзину для авторизованого", () => {
    useAppStore.setState({ currentUser: mockUsers[0] });
    renderWithRouter(<CartPage />);
    expect(screen.getByText("Корзина порожня")).toBeDefined();
  });

  // COMP-016
  it("COMP-016: показує товари в корзині та суму", () => {
    useAppStore.setState({
      currentUser: mockUsers[0],
      cart: [
        { cd: mockCDs[0], quantity: 1 }, // 350₴
        { cd: mockCDs[1], quantity: 1 }, // 500₴
      ],
    });
    renderWithRouter(<CartPage />);
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText("Random Access Memories")).toBeDefined();
    expect(screen.getByText("850 ₴")).toBeDefined(); // Всього
  });
});

describe("AuthPage: Авторизація", () => {
  // COMP-017
  it("COMP-017: рендерить сторінку входу з кнопкою Google", () => {
    renderWithRouter(<AuthPage />);
    expect(screen.getByText("Вхід")).toBeDefined();
    expect(screen.getByText("Увійти через Google")).toBeDefined();
    expect(screen.getByText("Увійдіть через Google, щоб купувати та продавати CD")).toBeDefined();
  });
});

describe("MessagesPage: Повідомлення", () => {
  // COMP-018
  it("COMP-018: показує повідомлення для неавторизованого", () => {
    renderWithRouter(<MessagesPage />);
    expect(screen.getByText("Увійдіть, щоб переглянути повідомлення")).toBeDefined();
  });

  // COMP-019
  it("COMP-019: показує список розмов для авторизованого", () => {
    useAppStore.setState({ currentUser: mockUsers[0] }); // u1 має повідомлення з u2
    renderWithRouter(<MessagesPage />);
    expect(screen.getByText("Повідомлення")).toBeDefined();
    expect(screen.getByText("Марина")).toBeDefined(); // Співрозмовник u2
  });
});

describe("NotFound: Сторінка 404", () => {
  // COMP-020
  it("COMP-020: рендерить сторінку 404", () => {
    renderWithRouterAndRoutes("/this-page-does-not-exist");
    expect(screen.getByText("404")).toBeDefined();
    expect(screen.getByText("Повернутися в магазин")).toBeDefined();
  });
});

describe("CDCard: Картка диска", () => {
  // COMP-021
  it("COMP-021: рендерить інформацію про диск", () => {
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    expect(screen.getByText("Nevermind")).toBeDefined();
    expect(screen.getByText(/Nirvana/)).toBeDefined();
    expect(screen.getByText("350 ₴")).toBeDefined();
    expect(screen.getByText("Rock")).toBeDefined();
    expect(screen.getByText("Б/У відмінний")).toBeDefined();
  });

  // COMP-022
  it("COMP-022: показує ім'я продавця при showSeller=true", () => {
    renderWithRouter(<CDCard cd={mockCDs[0]} showSeller={true} />);
    expect(screen.getByText("Продавець: Олексій")).toBeDefined();
  });

  // COMP-023
  it("COMP-023: приховує ім'я продавця при showSeller=false", () => {
    renderWithRouter(<CDCard cd={mockCDs[0]} showSeller={false} />);
    expect(screen.queryByText("Продавець: Олексій")).toBeNull();
  });

  // COMP-024
  it("COMP-024: не показує кнопку 'Купити' для неавторизованого", () => {
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    expect(screen.queryByText("Купити")).toBeNull();
  });

  // COMP-025
  it("COMP-025: показує кнопку 'Купити' для авторизованого не-власника", () => {
    useAppStore.setState({ currentUser: mockUsers[1] }); // Марина, cd1 belongs to u1
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    expect(screen.getByText("Купити")).toBeDefined();
  });

  // COMP-026
  it("COMP-026: не показує кнопку 'Купити' для власника диска", () => {
    useAppStore.setState({ currentUser: mockUsers[0] }); // Олексій — власник cd1
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    expect(screen.queryByText("Купити")).toBeNull();
  });

  // COMP-027
  it("COMP-027: змінює текст на 'В корзині' якщо диск вже в корзині", () => {
    useAppStore.setState({
      currentUser: mockUsers[1],
      cart: [{ cd: mockCDs[0], quantity: 1 }],
    });
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    expect(screen.getByText("В корзині")).toBeDefined();
    expect(screen.queryByText("Купити")).toBeNull();
  });

  // COMP-028
  it("COMP-028: зображення має lazy loading та коректний alt", () => {
    renderWithRouter(<CDCard cd={mockCDs[0]} />);
    const img = screen.getByAltText("Nevermind - Nirvana");
    expect(img).toBeDefined();
    expect(img.getAttribute("loading")).toBe("lazy");
  });
});

describe("Navbar: Навігація", () => {
  // COMP-029
  it("COMP-029: рендерить логотип та посилання для неавторизованого", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText("CD Маркет")).toBeDefined();
    expect(screen.getByText("Каталог")).toBeDefined();
    expect(screen.getByText("Увійти")).toBeDefined();
    // Авторизовані посилання не відображаються
    expect(screen.queryByText("Продати")).toBeNull();
    expect(screen.queryByText("Чат")).toBeNull();
    expect(screen.queryByText("Вийти")).toBeNull();
  });
});

describe("CheckoutPage: Оформлення", () => {
  // COMP-030
  it("COMP-030: показує 'Корзина порожня' при порожній корзині", () => {
    useAppStore.setState({ currentUser: mockUsers[0], cart: [] });
    renderWithRouter(<CheckoutPage />);
    expect(screen.getByText("Корзина порожня")).toBeDefined();
  });
});
