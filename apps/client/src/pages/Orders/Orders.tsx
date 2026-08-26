import { useQuery } from "@tanstack/react-query";
import "./orders.css";
import { useAuth, useUser } from "@clerk/clerk-react";

import type { OrderType, OrdersResponse } from "@repo/types";
import { useNavigate, useSearchParams } from "react-router";
import TableRow from "../../components/TableRow/TableRow";
import Pagination from "../../components/Pagination/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { apiOrderPrivate } from "../../api/api";
interface singleOrder extends OrderType {
  color?: string;
  size?: string;
}
const Orders = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate("/");
  }, [isLoaded, isSignedIn]);

  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const { getToken } = useAuth();

  const page = searchParams.get("page") || "1";
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", page],

    queryFn: async (): Promise<OrdersResponse> => {
      const token = await getToken();

      const res = await apiOrderPrivate.get(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (orders) {
      if (Number(page) < orders.pagination.totalPages) {
        queryClient.prefetchQuery({
          queryKey: ["orders", page + 1],
          queryFn: async () => {
            const token = await getToken();
            const res = await apiOrderPrivate.get(`/orders?page=${page + 1}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
          },
        });
      }
    }
  }, [orders, page]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong</div>;

  return (
    <div className="orders">
      <table className="orders-table">
        <thead>
          <tr className="orders-row">
            <th>Date</th>
            <th>Ammount</th>
            <th>Total Products</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders?.orders.length === 0 ? (
            <tr>
              <td className="orders-no">No orders</td>
            </tr>
          ) : (
            orders?.orders.map((r: singleOrder) => (
              <TableRow
                createdAt={r.createdAt}
                ammount={r.ammount}
                shippingAddress={r.shippingAddress}
                email={r.email}
                color={r.color}
                size={r.size}
                products={r.products as any}
                totalProducts={r.totalProducts}
                status={r.status}
                id={r._id}
                key={r._id}
              />
            ))
          )}
        </tbody>
      </table>
      <Pagination totalPages={orders?.pagination.totalPages as number} />
    </div>
  );
};

export default Orders;
