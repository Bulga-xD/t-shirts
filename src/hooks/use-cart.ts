import { CartItem } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type CartState = {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  decreaseItem: (productId: string, sizeId: string, colorId: string) => void;
  clearCart: () => void;
  removeItem: (productId: string, sizeId: string, colorId: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === product.productId &&
              item.variants.some(
                (v) =>
                  v.sizeId === product.variants[0]?.sizeId &&
                  v.colorId === product.variants[0]?.colorId
              )
          );
          const updatedItems = [...state.items];

          if (existingItemIndex > -1) {
            const existingItem = state.items[existingItemIndex];
            const updatedItem = {
              ...existingItem,
              qty: existingItem.qty + 1,
            };
            updatedItems[existingItemIndex] = updatedItem;
          } else {
            updatedItems.push({ ...product, qty: 1 });
          }

          return { ...state, items: updatedItems };
        }),
      decreaseItem: (productId, sizeId, colorId) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === productId &&
              item.variants.some(
                (v) => v.sizeId === sizeId && v.colorId === colorId
              )
          );

          if (existingItemIndex === -1) return state;

          const existingItem = state.items[existingItemIndex];
          const updatedItems = [...state.items];

          if (existingItem.qty === 1) {
            updatedItems.splice(existingItemIndex, 1);
          } else {
            const updatedItem = {
              ...existingItem,
              qty: existingItem.qty - 1,
            };
            updatedItems[existingItemIndex] = updatedItem;
          }

          return { ...state, items: updatedItems };
        }),
      clearCart: () => set({ items: [] }),
      removeItem: (productId, sizeId, colorId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.variants.some(
                  (v) => v.sizeId === sizeId && v.colorId === colorId
                )
              )
          ),
        })),
    }),
    {
      name: "userCart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
