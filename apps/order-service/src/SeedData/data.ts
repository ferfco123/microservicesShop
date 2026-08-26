type usersType = {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  shippingAddress: string;
};
type productsType = {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  sizes: string[];
  colors: string[];
  images: Record<string, string>;

  createdAt: string;
  updatedAt: string;
  categorySlug: string;
};

export const products: productsType[] = [
  {
    id: 20,
    name: "Converse All Star",
    shortDescription: "Classic Chuck patch",
    description: "Soft cotton everyday t-shirt featuring the iconic  logo.",
    price: 18,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["blue", "yellow", "gray"],
    images: {
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035476/products/p3vqeteamvz1jhdahj40.png",
      gray: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035492/products/mryx9s2lg0pmntf1ipxm.jpg",
      yellow:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035484/products/gk0u3er4fufhr6qtd2qs.png",
    },
    createdAt: "2026-08-06T16:58:58.541Z",
    updatedAt: "2026-08-06T16:58:58.541Z",
    categorySlug: "t-shirt",
  },
  {
    id: 21,
    name: "Nike t-shirt",
    shortDescription: "Nike Just Do It Tee",
    description: "Iconic cotton t-shirt featuring classic Just Do It print.",
    price: 25,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["blue", "white", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035782/products/xelnqlpkgrszgqcc31xx.webp",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035769/products/x62rregtubxmow3wdw1q.jpg",
      white:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035774/products/uwjnzuc4si5sorszeldn.jpg",
    },
    createdAt: "2026-08-06T17:03:30.331Z",
    updatedAt: "2026-08-06T17:03:30.331Z",
    categorySlug: "t-shirt",
  },
  {
    id: 22,
    name: "Basic",
    shortDescription: "Basic Cotton T-Shirt",
    description: "Classic plain cotton t-shirt built for daily comfort and fit",
    price: 15,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["gray", "red", "black"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035930/products/ritt0ycpeg74w2pnlll4.webp",
      gray: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035924/products/d4hzpgn9z2lceghvtmco.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786035939/products/kvj4vwepzgdheytnyjwt.png",
    },
    createdAt: "2026-08-06T17:05:50.423Z",
    updatedAt: "2026-08-06T17:05:50.423Z",
    categorySlug: "t-shirt",
  },
  {
    id: 23,
    name: "Adidas t-shirt",
    shortDescription: "Adidas Graphic Tee",
    description: "Classic Adidas cotton t-shirt with signature printed logo",
    price: 23,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["red", "black", "white"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786036039/products/mkr64z2pucdcwdqj4rkl.png",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786036045/products/wzzyup68crydwlnfb7ft.webp",
      white:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786036054/products/f9baithnfogduya5qd6e.png",
    },
    createdAt: "2026-08-06T17:07:37.526Z",
    updatedAt: "2026-08-06T17:07:37.526Z",
    categorySlug: "t-shirt",
  },
  {
    id: 24,
    name: "Nike air max alpha",
    shortDescription: "Men's Training Shoes",
    description: "Men's Nike training shoes built for gym workouts and comfort",
    price: 125,
    sizes: ["40", "41", "42", "43", "44", "45"],
    colors: ["blue", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786036414/products/xxuetdgvr47ecl1i1m8q.avif",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786036404/products/nkafbzfk3uulskgmefgr.jpg",
    },
    createdAt: "2026-08-06T17:13:40.325Z",
    updatedAt: "2026-08-06T17:13:40.325Z",
    categorySlug: "shoes",
  },
  {
    id: 25,
    name: "Nike Air",
    shortDescription: "Nike Air sneakers",
    description: "Stylish Nike Air shoes featuring comfortable all-day cushion",
    price: 135,
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["gray", "black"],
    images: {
      gray: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037016/products/ktsdb6jggmgrog5f757e.jpg",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037054/products/kcnyg4cfbpue0fvojstz.webp",
    },
    createdAt: "2026-08-06T17:24:18.816Z",
    updatedAt: "2026-08-06T17:24:18.816Z",
    categorySlug: "shoes",
  },
  {
    id: 26,
    name: "Nike MC trainer",
    shortDescription: "Men's workout shoes",
    description: "Durable Nike trainers built for stability during workouts",
    price: 115,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["blue", "black"],
    images: {
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037273/products/z65wltektnihffltkyay.avif",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037285/products/oroorbc7muiw1lsjckdo.png",
    },
    createdAt: "2026-08-06T17:28:33.926Z",
    updatedAt: "2026-08-06T17:28:33.926Z",
    categorySlug: "shoes",
  },
  {
    id: 27,
    name: "Puma Suede",
    shortDescription: "Suede  sneakers",
    description: "Iconic unisex Puma Suede shoes designed for everyday wear",
    price: 95,
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44", "45"],
    colors: ["red", "blue"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037447/products/otf2f6ka3lpmelne3tut.jpg",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037455/products/yjxrcp6fsf1jkem58z7t.jpg",
    },
    createdAt: "2026-08-06T17:31:28.567Z",
    updatedAt: "2026-08-06T17:31:28.567Z",
    categorySlug: "shoes",
  },
  {
    id: 28,
    name: "Black Buckle Tote",
    shortDescription: "Black Buckle Handbag",
    description: "Elegant black handbag with gold buckles for everyday style",
    price: 255,
    sizes: ["l"],
    colors: ["red", "black"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037725/products/quouzwff3lnabztapm6b.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037734/products/cxjfo59n73rsy1mw9het.png",
    },
    createdAt: "2026-08-06T17:35:37.998Z",
    updatedAt: "2026-08-06T17:35:37.998Z",
    categorySlug: "bags",
  },
  {
    id: 29,
    name: "Miyaco Burgundy Tote",
    shortDescription: "Burgundy Charm Tote",
    description: "Elegant burgundy faux-leather tote bag with a fur pom-pom",
    price: 278,
    sizes: ["xl"],
    colors: ["red", "black"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037867/products/twfpzlhxdvvvqrkrovlu.avif",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786037928/products/sisxn84ed6ws7uozy8xr.png",
    },
    createdAt: "2026-08-06T17:38:56.285Z",
    updatedAt: "2026-08-06T17:38:56.285Z",
    categorySlug: "bags",
  },
  {
    id: 30,
    name: "Black Croc V Handbag",
    shortDescription: "Black Croc V Handbag",
    description: "Stylish black croc-texture handbag with gold V metal detail",
    price: 345,
    sizes: ["l"],
    colors: ["red", "black"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038063/products/nlpqinvzambyybszipgq.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038075/products/ht36l2ojejlailxeulcz.png",
    },
    createdAt: "2026-08-06T17:41:18.353Z",
    updatedAt: "2026-08-06T17:41:18.353Z",
    categorySlug: "bags",
  },
  {
    id: 31,
    name: "Men's Shiny Hooded Puffer Jacket",
    shortDescription: "High-gloss jacket",
    description: "High-gloss quilted winter jacket with a detachable hood ",
    price: 179,
    sizes: ["s", "m", "l"],
    colors: ["gray", "black", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038328/products/d8rt4ok4fwqtuj3uh81c.webp",
      gray: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038315/products/rhnedtwpt1j6ru0htt36.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038320/products/kv3x1d1cu5v9cddw2hf4.webp",
    },
    createdAt: "2026-08-06T17:46:07.495Z",
    updatedAt: "2026-08-06T17:46:07.495Z",
    categorySlug: "jackets",
  },
  {
    id: 32,
    name: "Men's Shiny Puffer",
    shortDescription: "Glossy winter jacket",
    description: "Men’s shiny insulated winter jacket with hood",
    price: 280,
    sizes: ["m", "l"],
    colors: ["blue", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038515/products/zdzvjkz5kqsan4ys32b9.png",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038507/products/zhd8n2cmgm9nenbo3sxv.jpg",
    },
    createdAt: "2026-08-06T17:48:37.826Z",
    updatedAt: "2026-08-06T17:48:37.826Z",
    categorySlug: "jackets",
  },
  {
    id: 33,
    name: "Patagonia Red Puffer",
    shortDescription: "Lightweight  jacket",
    description: "Classic quilted Patagonia puffer jacket with hood for warmth",
    price: 190,
    sizes: ["s", "m", "l"],
    colors: ["blue", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038682/products/v5ksadwxgp1xyyktpqro.png",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038671/products/ra7gt3kfekdyzzjttyec.jpg",
    },
    createdAt: "2026-08-06T17:51:35.629Z",
    updatedAt: "2026-08-06T17:51:35.629Z",
    categorySlug: "jackets",
  },
  {
    id: 34,
    name: "Snow gloves",
    shortDescription: "Gloves waterproof",
    description: "Waterproof winter gloves offering windproof  and warmth",
    price: 95,
    sizes: ["m", "l"],
    colors: ["blue", "green"],
    images: {
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038893/products/dlbju7xnsj9iupihpo6c.webp",
      green:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786038901/products/klib39o666rt8hifvxa1.webp",
    },
    createdAt: "2026-08-06T17:55:03.044Z",
    updatedAt: "2026-08-06T17:55:03.044Z",
    categorySlug: "gloves",
  },
  {
    id: 35,
    name: "Kids gloves",
    shortDescription: "Kids winter snow ski",
    description: "Keep your kids hands warm and dry all winter long",
    price: 65,
    sizes: ["xs", "s"],
    colors: ["blue", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039101/products/cc0idn3irrcjodccwd1a.webp",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039097/products/jqf3ku9evzzbtmopkirq.webp",
    },
    createdAt: "2026-08-06T17:58:25.936Z",
    updatedAt: "2026-08-06T17:58:25.936Z",
    categorySlug: "gloves",
  },
  {
    id: 36,
    name: "Ray-ban sunglasses",
    shortDescription: "Aviator sunglasses",
    description: "Aviator sunglasses in polish arista blue and green",
    price: 89,
    sizes: ["m"],
    colors: ["green", "blue"],
    images: {
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039334/products/dv6y8limxe1igq27nrno.png",
      green:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039284/products/ht5agdndv5ji5da84hmr.webp",
    },
    createdAt: "2026-08-06T18:02:22.947Z",
    updatedAt: "2026-08-06T18:02:22.947Z",
    categorySlug: "accesories",
  },
  {
    id: 37,
    name: " Classic sunglasses",
    shortDescription: "Wayfarer sungalsses",
    description: " Ray-Ban Original Wayfarer Classic square sunglasses",
    price: 137,
    sizes: ["m"],
    colors: ["black", "green"],
    images: {
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039608/products/qiiqpp7sbriucz42ju3h.png",
      green:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786039611/products/h6esyofcko6v7ztsbpqc.png",
    },
    createdAt: "2026-08-06T18:07:18.504Z",
    updatedAt: "2026-08-06T18:07:18.504Z",
    categorySlug: "accesories",
  },
  {
    id: 38,
    name: "Graduation dress",
    shortDescription: "Chic spring V-neck",
    description: "Elegant spring V-neck graduation dress with a back zipper",
    price: 79,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["green", "blue", "red"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786063719/products/luha2n3q7tyh3xc1rxio.webp",
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786063707/products/btltcgyivfhsqncf2kpz.jpg",
      green:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786063700/products/mg9ihdycocm0igswh41q.webp",
    },
    createdAt: "2026-08-07T00:50:00.660Z",
    updatedAt: "2026-08-07T00:50:00.660Z",
    categorySlug: "dresses",
  },
  {
    id: 39,
    name: "Dance Dress ",
    shortDescription: "Latin Jazz Tango ",
    description: "Elegant halter leotard with tiered fringe for dance",
    price: 130,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["blue", "black"],
    images: {
      blue: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786064295/products/p8ffvgyfoesrpgsdwuus.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786064305/products/apuhyiojrn2mljgntf3v.png",
    },
    createdAt: "2026-08-07T00:58:37.023Z",
    updatedAt: "2026-08-07T00:58:37.023Z",
    categorySlug: "dresses",
  },
  {
    id: 40,
    name: "Crystal Feather Ballroom Gown",
    shortDescription: "Stunning   dress",
    description: "Elegant  gown with feathers and crystals for ballroom dance.",
    price: 245,
    sizes: ["xs", "s", "m", "l", "xl"],
    colors: ["red", "black"],
    images: {
      red: "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786064519/products/ey2tvx6usl0hy9aow6tp.webp",
      black:
        "https://res.cloudinary.com/dad4vq1sn/image/upload/v1786064535/products/z184z9jkvj5wv9ewauab.png",
    },
    createdAt: "2026-08-07T01:02:35.165Z",
    updatedAt: "2026-08-07T01:02:35.165Z",
    categorySlug: "dresses",
  },
];

export const users: usersType[] = [
  {
    id: "user_3HNXj1Zaja54PT3YSCSEz4WmUsL",
    fullName: "Micaela Ortiz",
    email: "micaela@gmail.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlhqMVphamE1NFBUM1lTQ1NFejRXbVVzTCIsImluaXRpYWxzIjoiTU8ifQ",
    role: "user",
    shippingAddress: "Araoz 1234 3° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNXELOjnmABmzK1Ree0jdVBpGN",
    fullName: "Julieta Silva",
    email: "juliet.silva@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlhFTE9qbm1BQm16SzFSZWUwamRWQnBHTiIsImluaXRpYWxzIjoiSlMifQ",
    role: "user",
    shippingAddress: "Av. Cabildo 2450 8° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNX9lPbV1aJYM8fezb6914r8gs",
    fullName: "Bautista Acosta",
    email: "bautista.acosta@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlh9bFBiVjFhSllNOGZlemI2OTE0cjhncyIsImluaXRpYWxzIjoiQkEifQ",
    role: "user",
    shippingAddress: "Thames 1820, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNX2ADIrPqZnbKHXKh1fT1KPYA",
    fullName: "Alma Benítez",
    email: "alma.benitez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlgyQURJclBxWm5iS0hYS2gxZlQxS1BZQSIsImluaXRpYWxzIjoiQUIifQ",
    role: "user",
    shippingAddress: "Av. Corrientes 3456 1° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWwm5Fe2nuQwmKWpus9vtuKFI",
    fullName: "Santino Romero",
    email: "santino.romero@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITld3bTVGZTJudVF3bUtXcHVzOXZ0dUtGSSIsImluaXRpYWxzIjoiU1IifQ",
    role: "user",
    shippingAddress: "Cuenca 3120, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWsHQ5XxMBcdlyYIU5yEfvLDW",
    fullName: "Zoe Castillo",
    email: "zoe.castillo@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldzSFE1WHhNQmNkbHlZSVU1eUVmdkxEVyIsImluaXRpYWxzIjoiWkMifQ",
    role: "user",
    shippingAddress: "Gurruchaga 1540 5° D, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWkbbCWoqXAvrmTWduJotHadm",
    fullName: "Ian Mendoza",
    email: "ian.mendoza@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldrYmJDV29xWEF2cm1UV2R1Sm90SGFkbSIsImluaXRpYWxzIjoiSU0ifQ",
    role: "user",
    shippingAddress: "Av. Santa Fe 1930 2° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWfdo6xeRMrWRzDBRZQOHMc9L",
    fullName: "Renata Foster",
    email: "renata.foster@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldmZG82eGVSTXJXUnpEQlJaUU9ITWM5TCIsImluaXRpYWxzIjoiUkYifQ",
    role: "user",
    shippingAddress: "Av. Belgrano 850 4° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWaO6KDxIZ3BDiTEH8bnR1JlV",
    fullName: "Thiago Vargas",
    email: "thiago.vargas@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldhTzZLRHhJWjNCRGlURUg4Ym5SMUpsViIsImluaXRpYWxzIjoiVFYifQ",
    role: "user",
    shippingAddress: "Malabia 2140 6° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWUtQHHSiHb8SJUc9bWbTZnUy",
    fullName: "Catalina Medina",
    email: "catalina.medina@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldVdFFISFNpSGI4U0pVYzliV2JUWm5VeSIsImluaXRpYWxzIjoiQ00ifQ",
    role: "user",
    shippingAddress: "Av. Rivadavia 5210 10° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWPBljQ4li2u7iQnMhsdbeOjj",
    fullName: "Bruno Giménez",
    email: "bruno.gimenez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldQQmxqUTRsaTJ1N2lRbk1oc2RiZU9qaiIsImluaXRpYWxzIjoiQBGifQ",
    role: "user",
    shippingAddress: "Araoz 1234 3° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWJXDwHEVY08HvRsHlfT3IKes",
    fullName: "Delfina Herrera",
    email: "delfina.herrera@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldKWER3SEVWWTA4SHZSc0hsZlQzSUtlcyIsImluaXRpYWxzIjoiREgifQ",
    role: "user",
    shippingAddress: "Av. Cabildo 2450 8° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNWEVpW5kF5SDyPgQnTp7Rt8eQ",
    fullName: "Agustín Ramos",
    email: "agustin.ramos@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITldFVnBXNWtGNVNEeVBnUW5UcDdSdDhlUSIsImluaXRpYWxzIjoiQVIifQ",
    role: "user",
    shippingAddress: "Thames 1820, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNW9Yn1EWUpUTKtNU2nIxLlkNd",
    fullName: "Victoria Chávez",
    email: "victoria.chavez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlc5WW4xRVdVcFVUS3ROVTJuSXhMbGtOZCIsImluaXRpYWxzIjoiVkMifQ",
    role: "user",
    shippingAddress: "Av. Corrientes 3456 1° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNW3f17WjMXUpyw0dNPo3xN6yi",
    fullName: "Tomás Gutiérrez",
    email: "tomas.gutierrez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlczZjE3V2pNWFVweXcwZE5QbzN4TjZ5aSIsImluaXRpYWxzIjoiVEcifQ",
    role: "user",
    shippingAddress: "Cuenca 3120, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVyNkjLafTUYTmiwvDzfOeXe3",
    fullName: "Mía Ortiz",
    email: "mia.ortiz@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZ5TmtqTGFmVFVZVG1pd3ZEemZPZVhlMyIsImluaXRpYWxzIjoiTU8ifQ",
    role: "user",
    shippingAddress: "Gurruchaga 1540 5° D, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVr1dHJygyhkVELWqYRGfnza2",
    fullName: "Lautaro Morales",
    email: "lautaro.morales@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZyMWRISnlneWhrVkVMV3FZUkdmbnphMiIsImluaXRpYWxzIjoiTE0ifQ",
    role: "user",
    shippingAddress: "Av. Santa Fe 1930 2° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVlTEzv6FvFfyZkJxR7pWs1S7",
    fullName: "Emma Castro",
    email: "emma.castro@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZsVEV6djZGdkZmeVprSnhSN3BXczFTNyIsImluaXRpYWxzIjoiRUMifQ",
    role: "user",
    shippingAddress: "Av. Belgrano 850 4° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVfiqdiRa6opPpJeAiEnYkjZ6",
    fullName: "Felipe Sosa",
    email: "felipe.sosa@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZmaXFkaVJhNm9wUHBKZUFpRW5Za2paNiIsImluaXRpYWxzIjoiRlMifQ",
    role: "user",
    shippingAddress: "Malabia 2140 6° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVZyP3gxnvPVKTY8zwmJ3GBib",
    fullName: "Martina Ruiz",
    email: "martina.ruiz@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZaeVAzZ3hudlBWS1RZOHp3bUozR0JpYiIsImluaXRpYWxzIjoiTVIifQ",
    role: "user",
    shippingAddress: "Av. Rivadavia 5210 10° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNVSO9OeIGXzMmHtLclzvIirTk",
    fullName: "Benjamín Álvarez",
    email: "benjamin.alvarez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlZTTzlPZUlHWHpNbUh0TGNsenZJaXJUayIsImluaXRpYWxzIjoiQsOBIn0",
    role: "user",
    shippingAddress: "Araoz 1234 3° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNV8IibajPOR2fzNXHIB9M35yl",
    fullName: "Lucía Torres",
    email: "lucia.torres@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlY4SWliYWpQT1IyZnpOWEhJQjlNMzV5bCIsImluaXRpYWxzIjoiTFQifQ",
    role: "user",
    shippingAddress: "Av. Cabildo 2450 8° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNV2qqwbOesWKJLO5L8ommDKtA",
    fullName: "Nicolás Díaz",
    email: "nicolas.diaz@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlYycXF3Yk9lc1dLSkxPNUw4b21tREt0QSIsImluaXRpYWxzIjoiTkQifQ",
    role: "user",
    shippingAddress: "Thames 1820, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUxcnunXyjLj8Jyd7bmftjuh5",
    fullName: "Isabella Romero",
    email: "isabella.romero@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlV4Y251blh5akxqOEp5ZDdibWZ0anVoNSIsImluaXRpYWxzIjoiSVIifQ",
    role: "user",
    shippingAddress: "Av. Corrientes 3456 1° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUs5BpQCtKA6KFxeIQmZurkuo",
    fullName: '"Santiago Sánchez',
    email: "santiago.sanchez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVzNUJwUUN0S0E2S0Z4ZUlRbVp1cmt1byIsImluaXRpYWxzIjoiXCJTIn0",
    role: "user",
    shippingAddress: "Cuenca 3120, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUm8bsJI5o2iKvwHjvM5ndBQ1",
    fullName: "Camila Martinez",
    email: "camila.martinez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVtOGJzSkk1bzJpS3Z3SGp2TTVuZEJRMSIsImluaXRpYWxzIjoiQ00ifQ",
    role: "user",
    shippingAddress: "Gurruchaga 1540 5° D, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUhKezavaU6TEaGIl01SJiKLY",
    fullName: "Joaquin Lopez",
    email: "joaquin.lopez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVoS2V6YXZhVTZURWFHSWwwMVNKaUtMWSIsImluaXRpYWxzIjoiSkwifQ",
    role: "user",
    shippingAddress: "Av. Santa Fe 1930 2° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUcg3LZXX3k6RbURw1GsEvqIw",
    fullName: '"Valentina Fernandez',
    email: "valentina.fernandez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVjZzNMWlhYM2s2UmJVUncxR3NFdnFJdyIsImluaXRpYWxzIjoiXCJGIn0",
    role: "user",
    shippingAddress: "Av. Belgrano 850 4° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUWOU1QEckcVh0tppylflx5x8",
    fullName: "Mateo Perez",
    email: "mateo.perez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVXT1UxUUVja2NWaDB0cHB5bGZseDV4OCIsImluaXRpYWxzIjoiTVAifQ",
    role: "user",
    shippingAddress: "Malabia 2140 6° C, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUQZw4wsYEYk5DYT1Kxtcf0Ru",
    fullName: "Sofia Rodríguez",
    email: "sofia.rodriguez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVRWnc0d3NZRVlrNURZVDFLeHRjZjBSdSIsImluaXRpYWxzIjoiU1IifQ",
    role: "user",
    shippingAddress: "Av. Rivadavia 5210 10° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNUKf5FMbBI7I34H9EMjcbSWeR",
    fullName: "Lucas Gonzales",
    email: "lucasgonzalez@example.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlVLZjVGTWJCSTdJMzRIOUVNamNiU1dlUiIsImluaXRpYWxzIjoiTEcifQ",
    role: "user",
    shippingAddress: "Araoz 1234 3° B, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNSsNsJ823HMxsUWaEQ5rfyUri",
    fullName: "Jose Perez",
    email: "jose@gmail.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlNzTnNKODIzSE14c1VXYUVRNXJmeVVyaSIsImluaXRpYWxzIjoiSlAifQ",
    role: "user",
    shippingAddress: "Av. Cabildo 2450 8° A, Ciudad de Buenos Aires",
  },
  {
    id: "user_3HNSUXAf5Yyk1Y8ioHfShGwr8uA",
    fullName: "Juan Gomez",
    email: "juan@gmail.com",
    avatar:
      "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18zQURLOW0zVzc3b0FXZ0VYWHg1ZUtGUzFTR3oiLCJyaWQiOiJ1c2VyXzNITlNVWEFmNVl5azFZOGlvSGZTaEd3cjh1QSIsImluaXRpYWxzIjoiSkcifQ",
    role: "user",
    shippingAddress: "Thames 1820, Ciudad de Buenos Aires",
  },
];
