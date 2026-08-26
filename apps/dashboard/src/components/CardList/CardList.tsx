import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderType, ProductType } from "@repo/types";

import { useAuth } from "@clerk/react";
import { apiOrderPrivate, apiProductsPrivate } from "@/api/api";
const CardList = ({ title }: { title: string }) => {
  const { getToken } = useAuth();
  const fetchLatestTransactions = async (): Promise<ProductType[]> => {
    const token = await getToken();

    const res = await apiProductsPrivate.get(`/products?limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  };
  const fetchLatestUsers = async (): Promise<OrderType[]> => {
    const token = await getToken();

    const res = await apiOrderPrivate.get(
      `/orders/latestTransaction`,
      //   { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  };

  const { data, isLoading } = useQuery<OrderType[] | ProductType[]>({
    queryKey: ["card-list", title],
    queryFn:
      title === "Popular products" ? fetchLatestTransactions : fetchLatestUsers,
  });

  if (isLoading) return <div>Dowloading...</div>;
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {title === "Popular products"
          ? (data as ProductType[])?.map((list) => {
              const images = list.images as Record<string, string>;
              console.log("images", images);
              const imageUrl = images ? Object.values(images)[0] : "";
              return (
                <Card
                  key={list.id}
                  className="flex flex-row justify-between items-center p-2 border"
                >
                  <div className="h-12 w-12 rounded-sm overflow-hidden ">
                    {imageUrl && (
                      <img
                        src={imageUrl as string}
                        alt={list.name || ""}
                        className="h-12 w-12 rounded-sm overflow-hidden object-cover"
                      />
                    )}
                  </div>

                  <CardContent className="w-25 p-0">
                    <div>{list.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {list.price}K
                    </div>
                  </CardContent>
                </Card>
              );
            })
          : (data as OrderType[])?.map((t) => {
              return (
                <Card
                  key={t._id}
                  className="flex flex-row justify-between items-center p-2 border"
                >
                  <div>
                    <Badge variant="secondary">{t.status}</Badge>
                    <CardContent className="w-max p-0">
                      <div>User Email</div>
                      <div className="flex items-center gap-2 mt-1">
                        {t.email}
                      </div>
                    </CardContent>
                    <CardFooter className="p-0">{t.ammount / 100}</CardFooter>
                  </div>
                </Card>
              );
            })}
      </div>
    </div>
  );
};

export default CardList;
