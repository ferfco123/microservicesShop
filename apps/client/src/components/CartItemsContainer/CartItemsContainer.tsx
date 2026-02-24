import useCart from "../../Zustand/useCart";
import CardShoppingCart from "../CardShoppingCart/CardShoppingCart";
import "./CartItemsContainer.css";

type CartProduct = {
  id: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  img: string;
  name: string;
};
type cartProducts = {
  cart: CartProduct[];
};
const CartItemsContainer = ({ cart }: cartProducts) => {
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
