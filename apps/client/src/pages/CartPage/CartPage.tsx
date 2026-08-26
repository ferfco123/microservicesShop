import { useState, type JSX } from "react";
import CartDetails from "../../components/CartDetails/CartDetails";
import CartItemsContainer from "../../components/CartItemsContainer/CartItemsContainer";
import CartSteps from "../../components/CartSteps/CartSteps";
import "./cartPage.css";

import useCart from "../../Zustand/useCart";
import StripePaymentForm from "../../components/stripePaymentForm/StripePaymentForm";
import type { cartItemsType } from "@repo/types";
import { useNavigate } from "react-router";

const CartPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const { cart } = useCart();
  const cartItems: cartItemsType = Object.values(cart);
  const stepsArray: JSX.Element[] = [
    <CartItemsContainer cart={cartItems} />,

    <StripePaymentForm />,
  ];
  const totalPrice = cartItems.reduce((acumm, item): number => {
    const price = (item.price as number) * item.quantity;
    return acumm + price;
  }, 0);
  const navigate = useNavigate();
  return (
    <div className="cartPage">
      <div className="cartPage-steps-wrapper">
        <div className="cartPage-title-container">
          <button className="cartPage-Back" onClick={() => navigate(-1)}>
            Back
          </button>
          <h3 className="cartPage-title">Your shopping cart</h3>
        </div>
        <div className="cartPage-steps-container">
          <CartSteps step={1} title="Shopping Cart" currentStep={currentStep} />

          <CartSteps
            step={2}
            title="Payment method"
            currentStep={currentStep}
          />
        </div>
      </div>
      <div className="cartPage-wrapper-containers">
        {stepsArray[currentStep]}
        <CartDetails
          totalPrice={totalPrice}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default CartPage;
