import { MoveLeft, MoveRight } from "lucide-react";
import "./button.css";

const Button = ({ type }: { type?: string }) => {
  return (
    <div className="button">
      <button className="button-continue" type="submit">
        {type === "paymentForm" ? (
          <>
            continue <MoveRight className="cartDetails-icon" />
          </>
        ) : (
          "ChekOut"
        )}
      </button>
      <button className="button-continue" type="button">
        <MoveLeft className="button-icon" /> Back
      </button>
    </div>
  );
};

export default Button;
