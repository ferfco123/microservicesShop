import "./cartSteps.css";
type steps = { step: number; title: string; currentStep: number };
const CartSteps = ({ step, title, currentStep }: steps) => {
  const activeStep = currentStep + 1;

  return (
    <div
      className="cartStep"
      style={
        activeStep === step ? { borderBottom: "1.5px solid black" } : undefined
      }
    >
      <div
        className="cartStep-number"
        style={activeStep === step ? { backgroundColor: "black" } : undefined}
      >
        {step}
      </div>
      <div
        className="cartStep-title"
        style={activeStep === step ? { color: "black" } : undefined}
      >
        {title}
      </div>
    </div>
  );
};

export default CartSteps;
