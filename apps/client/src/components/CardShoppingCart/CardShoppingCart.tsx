import { Trash2 } from "lucide-react";
import "./cardShoppingCart.css";
import useCart from "../../Zustand/useCart";
import type { cartItemType } from "@repo/types";

const CardShoppingCart = ({ product }: { product: cartItemType }) => {
  const { removeFromCart } = useCart();

  return (
    <div className="cdc">
      <div className="cdc-left">
        <img src={product.img} alt="" className="cdc-img" />
      </div>
      <div className="cdc-right">
        <div className="cdc-details">
          <p className="cdc-title">{product.name}</p>
          <p className="cdc-detail">Quantity {product.quantity}</p>
          <p className="cdc-detail">Size {product.selectedSize}</p>
          <p className="cdc-detail">Color {product.selectedColor}</p>
        </div>
        <div className="cdc-price">$ {product.price?.toFixed(2)}</div>
      </div>

      <div className="cdc-delete-btn" onClick={() => removeFromCart(product)}>
        <Trash2 className="cdc-icon" />
      </div>
    </div>
  );
};

export default CardShoppingCart;
