import { useState } from "react";
import "./cardItems.css";
import { ShoppingCart } from "lucide-react";
import useCart from "../../Zustand/useCart";
import { toast } from "react-toastify";
import { Link } from "react-router";
import type { cartItemType, ProductType } from "@repo/types";

const CardItems = ({ product }: { product: ProductType }) => {
  const [filters, setFilters] = useState<cartItemType>({
    name: product.name,
    sizes: product.sizes,
    colors: product.colors,
    id: product.id,
    quantity: 1,
    price: product.price,
  });
  const { addToCart } = useCart();

  const handleFilters = (type: string, value: string) => {
    setFilters((prev) => {
      const newColor =
        type === "color" ? value : (prev.selectedColor ?? product.colors[0]);
      const newSize =
        type === "size" ? value : (prev.selectedSize ?? product.sizes[0]);
      const images = product.images as Record<string, string>;
      return {
        ...prev,
        selectedSize: newSize,
        selectedColor: newColor,
        id: product.id,
        img: images[newColor],
      };
    });
  };

  const handleClick = () => {
    const images = product.images as Record<string, string>;
    const img = filters.selectedColor
      ? images[filters.selectedColor]
      : images[product.colors[0]];

    setFilters((prev) => ({ ...prev, img }));
    addToCart({ ...filters, quantity: 1, img: img });
    toast.success("Product added to cart");
  };
  const images = product.images as Record<string, string>;

  return (
    <div className="cardItems">
      <Link to={`/singleProduct/${product.id}`} className="ci-top">
        <img
          src={images[filters.selectedColor ?? product.colors[0]]}
          alt=""
          className="ci-img"
        />
      </Link>
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
                      filters.selectedColor === color
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
    </div>
  );
};

export default CardItems;
