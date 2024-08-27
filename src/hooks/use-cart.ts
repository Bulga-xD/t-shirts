import { CartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { auth } from "@/auth";
import { db } from "@/database/client";

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  decreaseItem: (productId: string) => void;
  clearCart: () => void;
  removeItem: (productId: string) => void;
  syncCartWithDb: () => Promise<void>;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.productId
          );
          const updatedItems = [...state.items];

          if (existingItemIndex > -1) {
            const existingItem = state.items[existingItemIndex];
            const updatedItem = {
              ...existingItem,
              qty: existingItem.qty! + 1,
            };
            updatedItems[existingItemIndex] = updatedItem;
          } else {
            updatedItems.push({ ...product, qty: 1 });
          }

          const newState = { ...state, items: updatedItems };

          // Sync with DB if user is authenticated
          get().syncCartWithDb();

          return newState;
        }),
      decreaseItem: (productId) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === productId
          );

          const existingItem = state.items[existingItemIndex];
          const updatedItems = [...state.items];

          if (existingItem?.qty === 1) {
            updatedItems.splice(existingItemIndex, 1);
          } else {
            const updatedItem = {
              ...existingItem,
              qty: existingItem?.qty! - 1,
            };
            updatedItems[existingItemIndex] = updatedItem;
          }

          const newState = { ...state, items: updatedItems };

          // Sync with DB if user is authenticated
          get().syncCartWithDb();

          return newState;
        }),
      clearCart: () =>
        set((state) => {
          const newState = { items: [] };

          // Sync with DB if user is authenticated
          get().syncCartWithDb();

          return newState;
        }),
      removeItem: (productId) =>
        set((state) => {
          const newState = {
            items: state.items.filter((item) => item.productId !== productId),
          };

          // Sync with DB if user is authenticated
          get().syncCartWithDb();

          return newState;
        }),
      syncCartWithDb: async () => {
        const session = await auth();
        if (!session) return;

        const userId = session.user.id;
        if (!userId) return;

        const state = get();

        try {
          await db.cart.upsert({
            where: { userId },
            update: { items: state.items },
            create: {
              userId,
              items: state.items,
              itemsPrice: calculateItemsPrice(state.items),
              shippingPrice: calculateShippingPrice(state.items),
              totalPrice: calculateTotalPrice(state.items),
            },
          });
        } catch (error) {
          console.error("Failed to sync cart with DB", error);
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

function calculateItemsPrice(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.qty!, 0);
}

function calculateShippingPrice(items: CartItem[]): number {
  return 10;
}

function calculateTotalPrice(items: CartItem[]): number {
  return calculateItemsPrice(items) + calculateShippingPrice(items);
}
