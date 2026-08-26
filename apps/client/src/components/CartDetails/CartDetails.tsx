import { MoveRight } from "lucide-react";
import "./cartDetails.css";
import useCart from "../../Zustand/useCart";

type CartStepsProps = {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
};
const CartDetails = ({
  currentStep,
  setCurrentStep,
  totalPrice,
}: CartStepsProps) => {
  const { cart } = useCart();
  const handleClick = (): void => {
    if (Object.values(cart).length > 0) setCurrentStep(1);
  };
  return (
    <div className="cartDetails">
      <h4 className="cartDetails-title">Cart Details</h4>
      <div className="cartDetails-details">
        <div className="cartDetails-dc">
          <p className="cartDetails-detail">Subtotal</p>
          <p className="cartDetails-ammount">{totalPrice}</p>
        </div>

        <div className="cartDetails-dc">
          <p className="cartDetails-detail">Shipping fee</p>
          <p className="cartDetails-ammount">0</p>
        </div>
      </div>
      <hr className="cartDetails-hr" />
      <div className="cartDetails-dc">
        <p className="cartDetails-ammount">Total</p>
        <p className="cartDetails-ammount">{totalPrice}</p>
      </div>
      {currentStep === 0 && (
        <button
          type="button"
          onClick={handleClick}
          className="
      cartDetails-btn"
        >
          Continue <MoveRight className="cartDetails-icom" />
        </button>
      )}
    </div>
  );
};

export default CartDetails;
