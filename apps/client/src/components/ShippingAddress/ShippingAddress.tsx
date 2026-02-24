import Button from "../Button/Button";
import InputForm from "../InputForm/InputForm";
import "./shippingAddress.css";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import {
  shippingAddressSchema,
  type ShippingAddressForm,
} from "./shippingAddress.schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
      <form
        className="shoppingAddress"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
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
        <Button />
      </form>
    </FormProvider>
  );
};

export default ShippingAddress;
