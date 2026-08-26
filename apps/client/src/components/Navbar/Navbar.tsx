import { ShoppingCart } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import "./navbar.css";
import { Link } from "react-router-dom";
import useCart from "../../Zustand/useCart";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import ProfileButton from "../ProfileButton/ProfileButton";
const Navbar = () => {
  const { cart } = useCart();
  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((accum, item) => {
    return accum + item.quantity;
  }, 0);
  return (
    <div className="navbar">
      <Link to="/" className="navbar-left">
        <img src="/logo.png" alt="" className="navbar-logo" />

        <p className="navbar-title">FERFCO SHOP</p>
      </Link>
      <div className="navbar-rigth">
        <SearchBar />
        <div className="navbar-icons-container">
          <Link to="/cartPage" className="navbar-badge-container">
            <div className="navbar-badge">{totalItems}</div>
            <ShoppingCart className="navbar-icon" />
          </Link>
        </div>

        <SignedOut>
          <SignInButton>
            <div
              style={{
                padding: "5px",
                border: "1px solid gray",
                borderRadius: "10px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Sign In
            </div>
          </SignInButton>

          <SignUpButton>
            <div
              style={{
                padding: "5px",
                border: "1px solid gray",
                borderRadius: "10px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Sign Up
            </div>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <ProfileButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
