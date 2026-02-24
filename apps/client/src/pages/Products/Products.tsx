import { useSearchParams } from "react-router";
import ProductList from "../../components/ProductList/ProductList";
import { products } from "../Home/data.home";
import "./products.css";
import { useEffect } from "react";

const Products = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cat: string = searchParams.get("cat") || "All";
  return (
    <div>
      <ProductList data={products} />
    </div>
  );
};

export default Products;
