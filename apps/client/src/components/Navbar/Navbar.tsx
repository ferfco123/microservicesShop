import { Bell, House, ShoppingCart } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import "./navbar.css";
import { Link } from "react-router-dom";
import useCart from "../../Zustand/useCart";

const Navbar = () => {
  const { cart } = useCart();
  const totalItems = cart.reduce((accum, item) => {
    return accum + item.quantity;
  }, 0);
  return (
    <div className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-left">
          <img src="/logo.png" alt="" className="navbar-logo" />
        </Link>
        <p className="navbar-title">FERFCO SHOP</p>
      </div>
      <div className="navbar-rigth">
        <SearchBar />
        <div className="navbar-icons-container">
          <Link to="/cartPage" className="navbar-badge-container">
            <div className="navbar-badge">{totalItems}</div>
            <ShoppingCart className="navbar-icon" />
          </Link>
        </div>
        <button className="navbar-btn">Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
