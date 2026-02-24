import { Trash2 } from "lucide-react";
import "./cardShoppingCart.css";
import useCart from "../../Zustand/useCart";

type Product = {
  id: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  img: string;
  name: string;
};
const CardShoppingCart = ({ product }: { product: Product }) => {
  const { removeFromCart } = useCart();
  console.log("product", product);
  return (
    <div className="cdc">
      <div className="cdc-left">
        <img src={product.img} alt="" className="cdc-img" />
      </div>
      <div className="cdc-right">
        <div className="cdc-details">
          <p className="cdc-title">{product.name}</p>
          <p className="cdc-detail">Quantity {product.quantity}</p>
          <p className="cdc-detail">Size {product.size}</p>
          <p className="cdc-detail">Color {product.color}</p>
        </div>
        <div className="cdc-price">$ {product.price.toFixed(2)}</div>
      </div>

      <div className="cdc-delete-btn" onClick={() => removeFromCart(product)}>
        <Trash2 className="cdc-icon" />
      </div>
    </div>
  );
};

export default CardShoppingCart;
