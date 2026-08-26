import ProductList from "../../components/ProductList/ProductList";

import "./products.css";
import { useEffect } from "react";

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="products">
      <ProductList />
    </div>
  );
};

export default Products;
