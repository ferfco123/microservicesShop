import axios from "axios";

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE;
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE;
const PAYMENT_SERVICE_URL = import.meta.env.VITE_PAYMENT_FORM;

export const apiProductsPublic = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export const apiOrderPrivate = axios.create({
  baseURL: ORDER_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const apiPaymentPrivate = axios.create({
  baseURL: PAYMENT_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
