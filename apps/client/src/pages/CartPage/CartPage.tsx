import { useState, type JSX } from "react";
import CartDetails from "../../components/CartDetails/CartDetails";
import CartItemsContainer from "../../components/CartItemsContainer/CartItemsContainer";
import CartSteps from "../../components/CartSteps/CartSteps";
import "./cartPage.css";
import ShoppingAddress from "../../components/ShippingAddress/ShippingAddress";
import type { ShippingAddressForm } from "../../components/ShippingAddress/shippingAddress.schema";
import PaymentForm from "../../components/PaymentForm/PaymentForm";
import ShippingAddress from "../../components/ShippingAddress/ShippingAddress";
import useCart from "../../Zustand/useCart";

const CartPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userData, setUserData] = useState<Record<string, string | number>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cardHolder: "",
    cardNumber: "",
    expirationDate: "",
  });
  const { cart } = useCart();

  const stepsArray: JSX.Element[] = [
    <CartItemsContainer cart={cart} />,
    <ShippingAddress
      userData={userData}
      setUserData={setUserData}
      setCurrentStep={setCurrentStep}
    />,
    <PaymentForm userData={userData} setUserData={setUserData} />,
  ];
  const totalPrice = cart.reduce((acumm, item): number => {
    const price = item.price * item.quantity;
    return acumm + price;
  }, 0);

  return (
    <div className="cartPage">
      <div className="cartPage-steps-wrapper">
        <h3>Your shopping cart</h3>
        <div className="cartPage-steps-container">
          <CartSteps step={1} title="Shopping Cart" currentStep={currentStep} />
          <CartSteps
            step={2}
            title="Shopping Address"
            currentStep={currentStep}
          />
          <CartSteps
            step={3}
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
