import { MoveRight } from "lucide-react";
import "./cartDetails.css";

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
  const handleClick = (): void => {
    setCurrentStep(1);
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
