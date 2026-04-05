export const GENRES = [
  "Rock", "Pop", "Jazz", "Classical", "Electronic",
  "Hip-Hop", "Folk", "Metal", "Indie", "Soundtrack"
] as const;

export type Genre = typeof GENRES[number];

export interface CDProduct {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  price: number;
  year: number;
  condition: "Новий" | "Б/У відмінний" | "Б/У хороший";
  coverUrl: string;
  sellerId: string;
  sellerName: string;
  active: boolean;
  description: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  cdRefId?: string;
  timestamp: string;
}

export interface CartItem {
  cd: CDProduct;
  quantity: number;
}

const covers = [
  "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
];

export const mockUsers: User[] = [
  { id: "u1", name: "Олексій", joinedAt: "2024-01-15" },
  { id: "u2", name: "Марина", joinedAt: "2024-03-20" },
  { id: "u3", name: "Дмитро", joinedAt: "2024-06-10" },
];

export const mockCDs: CDProduct[] = [
  { id: "cd1", title: "Nevermind", artist: "Nirvana", genre: "Rock", price: 350, year: 1991, condition: "Б/У відмінний", coverUrl: covers[0], sellerId: "u1", sellerName: "Олексій", active: true, description: "Класичний альбом гранжу у відмінному стані." },
  { id: "cd2", title: "Random Access Memories", artist: "Daft Punk", genre: "Electronic", price: 500, year: 2013, condition: "Новий", coverUrl: covers[1], sellerId: "u2", sellerName: "Марина", active: true, description: "Запечатаний новий диск." },
  { id: "cd3", title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz", price: 420, year: 1959, condition: "Б/У хороший", coverUrl: covers[2], sellerId: "u1", sellerName: "Олексій", active: true, description: "Легендарний джазовий альбом." },
  { id: "cd4", title: "Future Nostalgia", artist: "Dua Lipa", genre: "Pop", price: 280, year: 2020, condition: "Новий", coverUrl: covers[3], sellerId: "u3", sellerName: "Дмитро", active: true, description: "Хіт 2020 року, новий у плівці." },
  { id: "cd5", title: "Master of Puppets", artist: "Metallica", genre: "Metal", price: 380, year: 1986, condition: "Б/У відмінний", coverUrl: covers[4], sellerId: "u2", sellerName: "Марина", active: true, description: "Метал-класика, диск у ідеальному стані." },
  { id: "cd6", title: "Океан Ельзи — Без меж", artist: "Океан Ельзи", genre: "Rock", price: 300, year: 2016, condition: "Новий", coverUrl: covers[5], sellerId: "u3", sellerName: "Дмитро", active: true, description: "Український рок, новий диск." },
  { id: "cd7", title: "Interstellar OST", artist: "Hans Zimmer", genre: "Soundtrack", price: 450, year: 2014, condition: "Новий", coverUrl: covers[0], sellerId: "u1", sellerName: "Олексій", active: true, description: "Саундтрек до фільму Інтерстеллар." },
  { id: "cd8", title: "OK Computer", artist: "Radiohead", genre: "Indie", price: 400, year: 1997, condition: "Б/У хороший", coverUrl: covers[1], sellerId: "u2", sellerName: "Марина", active: true, description: "Альтернативний рок 90-х." },
];

export const mockMessages: Message[] = [
  { id: "m1", fromUserId: "u1", toUserId: "u2", text: "Привіт! Чи є ще цей диск?", cdRefId: "cd5", timestamp: "2025-03-01T10:00:00" },
  { id: "m2", fromUserId: "u2", toUserId: "u1", text: "Так, ще є! Готова відправити.", timestamp: "2025-03-01T10:15:00" },
];
