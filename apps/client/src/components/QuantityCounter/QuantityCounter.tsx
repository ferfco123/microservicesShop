import "./quantityCounter.css";

const QuantityCounter = ({
  quantity,
  handleQuantity,
}: {
  quantity: number;
  handleQuantity: (action: string) => void;
}) => {
  return (
    <div className="sp-quantity-container">
      <div className="sp-quantity" onClick={() => handleQuantity("dec")}>
        -
      </div>
      <div className="sp-quantity-q">{quantity}</div>
      <div className="sp-quantity" onClick={() => handleQuantity("inc")}>
        +
      </div>
    </div>
  );
};

export default QuantityCounter;
