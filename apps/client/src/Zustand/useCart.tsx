import type { cartItemType, zustandCartItemsType } from "@repo/types";
import { create } from "zustand";

import { persist } from "zustand/middleware";

type cartStore = {
  cart: zustandCartItemsType;
  addToCart: (product: cartItemType) => void;
  removeFromCart: (product: cartItemType) => void;
  resetCart: () => void;
};

const useCart = create<cartStore>()(
  persist(
    (set) => ({
      cart: {},

      addToCart: (product: cartItemType) => {
        set((state: cartStore) => {
          const key: string =
            product.id +
            "_" +
            "size:" +
            product.selectedSize +
            "_" +
            "selectedColor:" +
            product.selectedColor;

          if (!state.cart[key]) {
            const newProduct = {
              ...product,

              key,
            };

            return { cart: { ...state.cart, [key]: newProduct } };
          } else {
            const currentQuantity = state.cart[key].quantity;
            const newQuantity = currentQuantity + product.quantity;
            const newProduct = {
              ...state.cart[key],
              quantity: newQuantity,
              key,
            };
            return { cart: { ...state.cart, [key]: newProduct } };
          }
        });
      },
      removeFromCart: (product: cartItemType) =>
        set((state: cartStore) => {
          if (product.key) {
            const key = product.key;

            const { [key]: _, ...others } = state.cart;

            return { cart: others };
          } else {
            return { cart: state.cart };
          }
        }),
      resetCart: () => set({ cart: {} }),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCart;
