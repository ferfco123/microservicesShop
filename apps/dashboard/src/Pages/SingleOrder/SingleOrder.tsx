import LocationBar from "@/components/LocationBar/LocationBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { apiOrderPrivate, apiProductsPublic } from "@/api/api";

import { OrderType } from "@repo/types";
import { toast } from "react-toastify";
import { useState } from "react";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

const SingleProduct = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data } = useQuery<OrderType>({
    queryKey: ["order", id],
    queryFn: async (): Promise<OrderType> => {
      const token = await getToken();
      const res = await apiProductsPublic.get(`/products/singleProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const token = await getToken();
      await apiOrderPrivate.delete(`/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/orders");
      toast.success("Order has been deleted");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }
      toast.error("Something went wrong");
    },
  });

  const handleDelete = () => {
    if (role) {
      return setNotAdmin(true);
    }
    const id = data?._id;
    if (id) deleteMutation.mutate([id]);
  };

  if (!data) return <div>Order not found</div>;

  return (
    <div>
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <LocationBar type="Orders" />
      <div className="flex flex-col xl:flex-row mt-4 gap-4">
        <div className="w-full xl:w-1/3 space-y-6">
          <div className="bg-primary-foreground p-2 rounded-lg flex justify-between items-center ">
            <div className=" flex flex-col">
              <h3 className="text-xl font-semibold">Order Status :</h3>
              <div className="text-x font-semibold">Pending</div>
            </div>
            <button className="border-none rounded-md bg-white text-black p-1 cursor-pointer">
              Delivered
            </button>
            <button
              className="border-none rounded-[7px] pt-[5px] pb-[7px] pr-[10px]  pl-[10px] bg-red-500 text-white cursor-pointer"
              onClick={handleDelete}
            >
              Delete order
            </button>
          </div>

          <div className="bg-primary-foreground p-2 pb-5">
            <div className="text-xl font-semibold mb-1">Total amount :</div>
            <div className="text-x font-semibold">$ 123.-</div>
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex  justify-between">
              <div>
                <h3 className="text-xl font-semibold">Customer email :</h3>
                <h3 className="text-x font-semibold mb-5">juan@gmail.com</h3>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Stripe Id :</h3>
              <h3 className="text-x font-semibold mb-5">stripeidMMMMMMMMMM</h3>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex  flex-col  gap-2 text-sm">
                <span
                  className="
                text-xl"
                >
                  Shipping address :
                </span>
                <span
                  className="
                text-x font-semibold"
                >
                  cucha cucha 2222 Buenos Aires
                </span>
              </div>

              <div className="flex justify-between items-center"></div>
            </div>
          </div>
        </div>
        <div className="w-max xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-lg font-semibold mb-2">Order details</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
