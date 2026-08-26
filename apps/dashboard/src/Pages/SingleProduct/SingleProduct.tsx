import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditProduct from "@/components/EditProduct/EditProduct";
import LocationBar from "@/components/LocationBar/LocationBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import { apiProductsPublic } from "@/api/api";
import { useEffect, useState } from "react";
import ProductColors from "@/components/ProductColors/ProductColors";
import { ProductType } from "@repo/types";
import { toast } from "react-toastify";
import RequireAdmin from "@/components/RequireAdmin/RequireAdmin";
import { AxiosError } from "axios";

const SingleProduct = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const { user } = useUser();
  const role = user?.publicMetadata.role !== "admin";
  const [notAdmin, setNotAdmin] = useState(false);
  const navigate = useNavigate();
  const [colorActive, setColorActive] = useState<string | undefined>(undefined);
  const [img, setImg] = useState<string | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useQuery<ProductType>({
    queryKey: ["product", id],
    queryFn: async (): Promise<ProductType> => {
      const token = await getToken();
      const res = await apiProductsPublic.get(`/products/singleProduct/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      await apiProductsPublic.delete(`/products`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: [id] },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
      toast.success("Product has been deleted");
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        return setNotAdmin(true);
      }

      toast.error("Something went wrong");
    },
  });
  useEffect(() => {
    if (data?.images) {
      const colors = Object.keys(data.images);
      if (colors.length > 0) {
        setImg(colors[0]);
        setColorActive(colors[0]);
      }
    }
  }, [data]);

  const availableColors = data?.images ? Object.keys(data.images) : [];
  const currentKey = img || availableColors[0];
  const imagesObj = (data?.images as Record<string, string> | undefined) || {};
  const currentImgPath = currentKey ? imagesObj[currentKey] : undefined;

  const handleDelete = () => {
    if (role) {
      return setNotAdmin(true);
    }
    if (!id) return;
    deleteMutation.mutate(id);
  };
  if (!data) return <div>Product not found</div>;

  return (
    <div>
      {notAdmin && <RequireAdmin setState={setNotAdmin} />}
      <LocationBar type="Products" />

      <div className="flex flex-col xl:flex-row mt-4 gap-4">
        <div className="w-full xl:w-1/3 space-y-6">
          <div className="bg-primary-foreground p-2 rounded-lg flex flex-col ">
            <h3 className="text-xl font-semibold">Category</h3>
            <div className="text-x font-semibold">{data.categorySlug}</div>
          </div>
          <div className="bg-primary-foreground p-2 pb-5">
            <div className="text-xl font-semibold mb-1">Sizes</div>
            <div className="flex items-center gap-2">
              {data?.sizes?.map((z: string) => (
                <div
                  className="border border-white flex items-center justify-center h-5 w-5"
                  key={z}
                >
                  {z}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary-foreground p-4 rounded-lg">
            <div className="flex  justify-between">
              <div>
                <h3 className="text-xl font-semibold">Product name</h3>
                <h3 className="text-x font-semibold mb-5">{data?.name}</h3>
              </div>
              <div className="flex flex-col gap-1 items-start">
                <div className="text-xl font-bold">price:</div>
                <div className="text-x font-bold">$ {data?.price}.-</div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="flex  flex-col  gap-2 text-sm">
                <span
                  className="
                text-xl"
                >
                  Short description :
                </span>
                <span
                  className="
                text-x"
                >
                  {data?.shortDescription}
                </span>
              </div>
              <br />
              <div className="flex flex-col gap-2 ">
                <span
                  className="
                text-xl"
                >
                  Full description :
                </span>
                <span
                  className="
                text-x"
                >
                  {data?.description}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <Button asChild className="cursor-pointer">
                    <SheetTrigger>Edit product</SheetTrigger>
                  </Button>
                  <button
                    className="border-none rounded-[7px] pt-[5px] pb-[7px] pr-[10px]  pl-[10px] bg-red-500 text-white cursor-pointer"
                    onClick={handleDelete}
                  >
                    Delete product
                  </button>
                  <SheetContent className="max-w-md sm:max-w-2xl">
                    <EditProduct
                      product={data}
                      onClose={() => setIsOpen(false)}
                    />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
        <div className="w-max xl:w-2/3 space-y-6">
          <div className="bg-primary-foreground p-4 rounded-lg">
            <h1 className="text-lg font-semibold mb-2">Product Images</h1>
            <ProductColors
              colors={data?.colors}
              colorActive={colorActive}
              setColorActive={setColorActive}
              setImg={setImg}
            />
            <img src={currentImgPath} alt="" className="h-90 w-70" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
