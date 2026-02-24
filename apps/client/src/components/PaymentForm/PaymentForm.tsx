import Button from "../Button/Button";
import "./paymentForm.css";
import InputForm from "../InputForm/InputForm";
import "./paymentForm.css";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  PaymentFormSchema,
  type PaymentFormInputs,
} from "./paymentForm.schema";

type PaymentFormType = {
  userData: Record<string, string | number>;

  setUserData: React.Dispatch<
    React.SetStateAction<Record<string, string | number>>
  >;
};

const PaymentForm = ({ userData, setUserData }: PaymentFormType) => {
  const methods = useForm<PaymentFormInputs>({
    resolver: zodResolver(PaymentFormSchema),
  });
  const inputs = [
    { label: "Card holder name", name: "cardHolder" },
    { label: "Card number", name: "cardNumber" },
    { label: "Expiration date", name: "expirationDate" },
    { label: "cvv", name: "cvv" },
  ] as const;

  const handleSubmit: SubmitHandler<PaymentFormInputs> = (data) => {
    setUserData((prev) => {
      return { ...prev, ...data };
    });
  };
  return (
    <FormProvider {...methods}>
      <form
        className="paymentForm"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
        <h4 className="paymentForm-title">Shopping Address</h4>
        {inputs.map((input) => {
          return (
            <InputForm
              label={input.label}
              key={input.name}
              name={input.name}
              defaultValue={userData[input.name] ?? ""}
            />
          );
        })}
        <div className="paymentForm-space">
          <img src="/cards.png" alt="" className="paymentForm-img" />
          <img src="/klarna.png" alt="" className="paymentForm-img" />
          <img src="/stripe.png" alt="" className="paymentForm-img" />
        </div>

        <Button type="paymentForm" />
      </form>
    </FormProvider>
  );
};

export default PaymentForm;
