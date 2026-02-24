import { useState } from "react";
import "./cardItems.css";
import type { productType } from "./types.categoryItems";
import { ShoppingCart } from "lucide-react";
import useCart from "../../Zustand/useCart";
import { toast } from "react-toastify";
import { Link } from "react-router";

type product = {
  product: productType;
};
type CartProduct = {
  id: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  img: string;
  name: string;
};
const CardItems = ({ product }: product) => {
  const [filters, setFilters] = useState<CartProduct>({
    name: product.name,
    size: product.sizes[0],
    color: product.colors[0],
    id: product.id,
    quantity: 1,
    price: product.price,
    img: "",
  });
  const { addToCart } = useCart();

  const handleFilters = (type: string, value: string) => {
    setFilters((prev) => {
      return {
        ...prev,
        [type]: value,
        color: type === "color" ? value : prev.color,
        id: product.id,
        img: product.images[filters.color],
      };
    });
  };

  const handleClick = () => {
    const img = product.images[filters.color];

    setFilters((prev) => ({ ...prev, img }));
    addToCart({ ...filters, quantity: 1, img: img });
    toast.success("Products added to cart");
  };

  return (
    <Link to={`/singleProduct/${product.id}`} className="cardItems">
      <div className="ci-top">
        <img src={product.images[filters.color]} alt="" className="ci-img" />
      </div>
      <div className="ci-bottom">
        <p className="ci-name">{product.name}</p>
        <p className="ci-shortdesc">{product.shortDescription}</p>
        <div className="ci-options-container">
          <div className="">
            <p className="ci-size">Size</p>
            <select
              id=""
              className="ci-select"
              onChange={(e) => handleFilters("size", e.target.value)}
            >
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="ci-color-name">Color</p>
            <div className="ci-color-container">
              {product.colors.map((color) => {
                return (
                  <div
                    key={color}
                    style={
                      filters.color === color
                        ? {
                            height: "18px",
                            width: "18px",
                            border: `1px solid ${color} `,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }
                        : {}
                    }
                  >
                    <div
                      style={{ backgroundColor: `${color}` }}
                      className="ci-color"
                      onClick={() => handleFilters("color", color)}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="ci-price-container">
          <p className="ci-price">$ {product.price}</p>
          <button className="ci-btn" onClick={handleClick}>
            <ShoppingCart className="ci-icon" />
            add to cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CardItems;
