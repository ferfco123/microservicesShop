import useCart from "../../Zustand/useCart";
import CardShoppingCart from "../CardShoppingCart/CardShoppingCart";
import "./CartItemsContainer.css";
import type { cartItemsType } from "@repo/types";
interface CartProps {
  cart: cartItemsType;
}
const CartItemsContainer = ({ cart }: CartProps) => {
  const { resetCart } = useCart();
  return (
    <div className="cic">
      <div className="cic-container">
        <h4>Cart Items</h4>
        <button className="cic-btn" onClick={() => resetCart()}>
          Reset cart
        </button>
      </div>
      {cart.map((p, i) => (
        <CardShoppingCart product={p} key={i} />
      ))}
    </div>
  );
};

export default CartItemsContainer;
