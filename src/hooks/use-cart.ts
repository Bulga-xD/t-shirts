import axios from "axios";
import { CartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  decreaseItem: (productId: string, size: string) => void;
  clearCart: () => void;
  removeItem: (productId: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.productId && item.size === product.size
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

          return newState;
        }),
      decreaseItem: (productId, size) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === productId && item.size == size
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

          return newState;
        }),
      clearCart: () =>
        set((state) => {
          const newState = { items: [] };

          // Sync with DB if user is authenticated

          return newState;
        }),
      removeItem: (productId) =>
        set((state) => {
          const newState = {
            items: state.items.filter((item) => item.productId !== productId),
          };

          // Sync with DB if user is authenticated

          return newState;
        }),
    }),
    {
      name: "userCart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
