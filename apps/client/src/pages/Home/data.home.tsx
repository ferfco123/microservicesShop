import {
  Footprints,
  Glasses,
  Hand,
  Handbag,
  Shirt,
  ShoppingBasket,
  Venus,
} from "lucide-react";

type itemType = {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
type itemsType = itemType[];

export const categoryItems: itemsType = [
  { title: "All", icon: ShoppingBasket },
  { title: "T-Shirt", icon: Shirt },

  { title: "Shoes", icon: Footprints },

  { title: "Accesories", icon: Glasses },

  { title: "Bags", icon: Handbag },

  { title: "Dresses", icon: Venus },

  { title: "Jackets", icon: Shirt },
  { title: "Gloves", icon: Hand },
];

type productType = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: [string, ...string[]];
  colors: [string, ...string[]];
  images: Record<string, string>;
};
export type productsType = productType[];

export const products: any = [
  {
    id: "rxytd ga",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "purple", "green"],
    images: { gray: "/1g.png", purple: "/1p.png", green: "/1gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
  {
    id: "rxytd gs",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/2g.png", green: "/2gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
  {
    id: "rxytd gd",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "blue", "green"],
    images: { gray: "/3b.png", blue: "/3bl.png", green: "/3gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
  {
    id: "rxytd gf",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "purple", "green"],
    images: { gray: "/1g.png", purple: "/1p.png", green: "/1gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
  {
    id: "rxytd gg",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "green"],
    images: { gray: "/2g.png", green: "/gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
  {
    id: "rxytd gh",
    name: "product1111",
    shortDescription: "evwbvjhwwe cnef cvvsrvrbe ebebeb",
    description:
      "wreivnwtjvn wtwtbe ecarcarfq qcecxqc beynjrumjrij ecq3rc efcwrv eyheh wewfvwr",
    price: 125,
    sizes: ["s", "m", "l", "xl"],
    colors: ["gray", "blue", "green"],
    images: { gray: "/3b.png", blue: "/3bl.png", green: "/3gr.png" },
    categorySlug: "t-shirt",
    createdAt: "ggggg",
    updatedAt: "eeeee",
  },
];
