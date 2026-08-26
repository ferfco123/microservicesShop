import Button from "../Button/Button";
import InputForm from "../InputForm/InputForm";
import "./shippingAddress.css";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema, type ShippingAddressForm } from "@repo/types";
import { MoveRight } from "lucide-react";

type shoppingAddresType = {
  userData: Record<string, string | number>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setUserData: React.Dispatch<
    React.SetStateAction<Record<string, string | number>>
  >;
};

const ShippingAddress = ({
  userData,
  setUserData,
  setCurrentStep,
}: shoppingAddresType) => {
  const methods = useForm<ShippingAddressForm>({
    resolver: zodResolver(shippingAddressSchema),
  });
  const inputs = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
    { label: "Address", name: "address" },
    { label: "City", name: "city" },
  ] as const;

  const handleSubmit: SubmitHandler<ShippingAddressForm> = (data) => {
    setUserData((prev) => {
      return { ...prev, ...data };
    });

    setCurrentStep((prev) => prev + 1);
  };
  return (
    <FormProvider {...methods}>
      <div className="shippingAddress">
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <h4 className="shoppingAddress-title">Shopping Address</h4>
          {inputs.map((input) => (
            <InputForm
              label={input.label}
              key={input.name}
              name={input.name}
              defaultValue={userData[input.name] ?? ""}
            />
          ))}
          <div className="shoppingAddress-space"></div>
          <button className="shoppingAddress-btn" type="submit">
            Continue <MoveRight className="cartDetails-icon" />
          </button>
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="shoppingAddress-btn"
          >
            Back
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

export default ShippingAddress;
