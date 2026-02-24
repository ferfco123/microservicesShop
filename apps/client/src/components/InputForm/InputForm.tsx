import { useFormContext, type FieldError } from "react-hook-form";
import "./inputForm.css";

type InputFormProps<T> = {
  label: string;
  name: keyof T;
  defaultValue?: T[keyof T];
};

const InputForm = <T extends {}>({
  label,
  name,
  defaultValue,
}: InputFormProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const fieldError = errors[name] as FieldError | undefined;
  return (
    <div className="inputForm">
      <div className="inputForm-label">{label}</div>
      <input
        defaultValue={defaultValue?.toString() ?? ""}
        placeholder={defaultValue?.toString() ?? ""}
        type="text"
        className="inputForm-input"
        {...register(name as any)}
      />
      {fieldError && (
        <span className="inputForm-error">{fieldError.message}</span>
      )}
    </div>
  );
};

export default InputForm;
