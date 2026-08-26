/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRODUCT_SERVICE: string;
  readonly VITE_ORDER_SERVICE: string;
  readonly VITE_PAYMENT_FORM: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
