import { MoveLeft, MoveRight } from "lucide-react";
import "./button.css";
import { useNavigate } from "react-router";

const Button = ({ type }: { type?: string }) => {
  const navigate = useNavigate();
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
      <button
        className="button-continue"
        type="button"
        onClick={() => navigate(-1)}
      >
        <MoveLeft className="button-icon" /> Back
      </button>
    </div>
  );
};

export default Button;
