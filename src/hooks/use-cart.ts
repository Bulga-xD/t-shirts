import { CartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  decreaseItem: (productId: string) => void;
  clearCart: () => void;
  removeItem: (productId: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          //

          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.productId
          );
          const updatedItems = [...state.items];

          if (existingItemIndex > -1) {
            const existingItem = state.items[existingItemIndex];
            const updateItem = {
              ...existingItem,
              qty: existingItem.qty! + 1,
            };
            updatedItems[existingItemIndex] = updateItem;
          } else {
            updatedItems.push({ ...product, qty: 1 });
          }

          return { ...state, items: updatedItems };
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

          return { ...state, items: updatedItems };
        }),
      clearCart: () =>
        set((state) => {
          return { items: [] };
        }),
      removeItem: (productId) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.productId !== productId),
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
