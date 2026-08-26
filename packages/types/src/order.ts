import { OrderSchemaType } from "@repo/orderdb";

export type OrderType = Omit<OrderSchemaType, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  totalProducts: number;
};
export type OrderChartType = {
  month: string;
  total: number;
  successful: number;
};

export type OrdersResponse = {
  orders: OrderType[];
  pagination: {
    totalOrders: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};
