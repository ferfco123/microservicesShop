import { Link, useSearchParams } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import ProductList from "../../components/ProductList/ProductList";
import { categoryItems, products } from "./data.home";
import "./home.css";
import { useRef } from "react";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const cat: string = searchParams.get("cat") || "All";
  return (
    <div className="home">
      <div className="home-image">
        <img src="/featured.png" alt="" className="home-image" />
      </div>
      <CategoryFilter
        data={categoryItems}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      <ProductList data={products} />
      <Link to={`/products?cat=${cat}`} className="home-link">
        View all products
      </Link>
    </div>
  );
};

export default Home;
