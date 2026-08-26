import { useQuery } from "@tanstack/react-query";
import CardItems from "../CardItems/CardItems";
import SortItems from "../SortItems/SortItems";
import "./productList.css";
import type { productsType, ProductType } from "@repo/types";
import { useLocation, useSearchParams } from "react-router-dom";
import { apiProductsPublic } from "../../api/api";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation().pathname;
  const productsPage = useLocation().pathname === "/products";
  const queryString = searchParams.toString();

  const {
    data: productsList,
    isLoading,
    error,
  } = useQuery<productsType>({
    queryKey: ["products", location, queryString],
    queryFn: async (): Promise<productsType> => {
      const params = new URLSearchParams(queryString);

      if (location === "/home") {
        params.set("limit", "8");
      }

      const res = await apiProductsPublic.get<productsType>(`/products`, {
        params,
      });
      return res.data;
    },

    staleTime: Infinity,
    cacheTime: Infinity,
    keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Something went wrong...</div>;

  return (
    <div>
      {productsPage && (
        <SortItems
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      )}

      <div className="productList">
        {productsList?.length === 0 && "No products"}
        {productsList?.map((p: ProductType) => {
          return <CardItems key={p.id} product={p} />;
        })}
      </div>
    </div>
  );
};

export default ProductList;
