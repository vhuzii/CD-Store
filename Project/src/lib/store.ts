import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CDProduct, CartItem, Message, User, mockCDs, mockMessages, mockUsers } from './mockData';

interface AppState {
  currentUser: User | null;
  cds: CDProduct[];
  cart: CartItem[];
  messages: Message[];
  users: User[];

  setCurrentUser: (user: User | null) => void;
  login: (userId: string) => void;
  logout: () => void;
  register: (name: string) => void;

  addToCart: (cd: CDProduct) => void;
  removeFromCart: (cdId: string) => void;
  clearCart: () => void;

  addCD: (cd: Omit<CDProduct, 'id' | 'sellerId' | 'sellerName' | 'active'>) => void;
  toggleCDActive: (cdId: string) => void;

  sendMessage: (toUserId: string, text: string, cdRefId?: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      cds: mockCDs,
      cart: [],
      messages: mockMessages,
      users: mockUsers,

      setCurrentUser: (user) => set({ currentUser: user }),

      login: (userId) => {
        const user = get().users.find(u => u.id === userId);
        if (user) set({ currentUser: user });
      },

      logout: () => set({ currentUser: null, cart: [] }),

      register: (name) => {
        const newUser: User = {
          id: crypto.randomUUID(),
          name,
          joinedAt: new Date().toISOString().split('T')[0],
        };
        set(s => ({ users: [...s.users, newUser], currentUser: newUser }));
      },

      addToCart: (cd) => {
        set(s => {
          const existing = s.cart.find(i => i.cd.id === cd.id);
          if (existing) return s;
          return { cart: [...s.cart, { cd, quantity: 1 }] };
        });
      },

      removeFromCart: (cdId) => {
        set(s => ({ cart: s.cart.filter(i => i.cd.id !== cdId) }));
      },

      clearCart: () => set({ cart: [] }),

      addCD: (cdData) => {
        const user = get().currentUser;
        if (!user) return;
        const newCD: CDProduct = {
          ...cdData,
          id: crypto.randomUUID(),
          sellerId: user.id,
          sellerName: user.name,
          active: true,
        };
        set(s => ({ cds: [...s.cds, newCD] }));
      },

      toggleCDActive: (cdId) => {
        set(s => ({
          cds: s.cds.map(cd =>
            cd.id === cdId && cd.sellerId === s.currentUser?.id
              ? { ...cd, active: !cd.active }
              : cd
          ),
        }));
      },

      sendMessage: (toUserId, text, cdRefId) => {
        const user = get().currentUser;
        if (!user) return;
        const msg: Message = {
          id: crypto.randomUUID(),
          fromUserId: user.id,
          toUserId,
          text,
          cdRefId,
          timestamp: new Date().toISOString(),
        };
        set(s => ({ messages: [...s.messages, msg] }));
      },
    }),
    {
      name: 'cd-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        cart: state.cart,
        cds: state.cds,
        messages: state.messages,
      }),
    }
  )
);
