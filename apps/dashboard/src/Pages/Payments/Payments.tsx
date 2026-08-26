import { AppTable } from "@/components/Table/AppTable";

import { columns } from "./Columns";
import { useQuery } from "@tanstack/react-query";

import { OrderType } from "@repo/types";
import { useAuth } from "@clerk/react";
import { apiOrderPrivate } from "@/api/api";
import { SearchBar } from "@/components/SearchBar/SearchBar";

import { useSearchParams } from "react-router-dom";
interface PaginatedOrdersResponse {
  orders: OrderType[];
  totalOrders: number;
  page: number;
  totalPages: number;
}
const Payments = () => {
  const { getToken } = useAuth();

  const [searchParams] = useSearchParams();
  const stringParams = searchParams.toString();
  const { data } = useQuery<PaginatedOrdersResponse>({
    queryKey: ["orders", stringParams],
    queryFn: async (): Promise<PaginatedOrdersResponse> => {
      const token = await getToken();
      const res = await apiOrderPrivate.get(
        `/orders/allOrders?${stringParams}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return res.data;
    },
  });
  const orders = data?.orders || [];

  return (
    <div>
      <SearchBar placeholder="Search by email..." state="search" />
      <AppTable columns={columns} data={orders} />
    </div>
  );
};

export default Payments;
