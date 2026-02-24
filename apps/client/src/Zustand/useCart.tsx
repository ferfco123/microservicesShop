import { create } from "zustand";

import { persist } from "zustand/middleware";

export type CartProduct = {
  quantity: number;
  size: string;
  color: string;
  id: string;
  name: string;
  price: number;
  img: string;
};
export type CartProductsType = CartProduct[];

type cartStore = {
  cart: CartProductsType;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (product: CartProduct) => void;
  resetCart: () => void;
};

const useCart = create<cartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product: CartProduct) => {
        set((state) => {
          const existingProduct = state.cart.find(
            (p) =>
              p.id === product.id &&
              p.color === product.color &&
              p.size === product.size,
          );
          if (existingProduct) {
            const total = existingProduct.quantity;
            existingProduct.quantity = total + product.quantity;
            return { cart: [...state.cart] };
          } else {
            return { cart: [...state.cart, product] };
          }
        });
      },
      removeFromCart: (product) =>
        set((state) => {
          const itemToDelete = state.cart.findIndex(
            (p) =>
              p.id === product.id &&
              p.size === product.size &&
              p.color === product.color,
          );
          if (itemToDelete === -1) return state;
          const newArray = structuredClone(state.cart);
          newArray.splice(itemToDelete, 1);
          console.log("new", newArray);
          return { cart: [...newArray] };
        }),
      resetCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);

export default useCart;
