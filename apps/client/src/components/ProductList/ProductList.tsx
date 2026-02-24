import CardItems from "../CardItems/CardItems";
import SortItems from "../SortItems/SortItems";
import "./productList.css";
import type { productsType } from "./types.productList";
import { useLocation, useSearchParams } from "react-router-dom";

type productProp = {
  data: productsType;
};
const ProductList = ({ data }: productProp) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const products = useLocation().pathname === "/products";
  return (
    <div>
      {products && (
        <SortItems
          searchParams={searchParams}
          setSearchParams={setSearchParams}
        />
      )}
      <div className="productList">
        {data.map((p) => {
          return <CardItems key={p.id} product={p} />;
        })}
      </div>
    </div>
  );
};

export default ProductList;
