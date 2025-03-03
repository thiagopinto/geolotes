import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  mask: string;
  alwaysShowMask?: boolean;
}

const applyMask = (value: string, mask: string): string => {
  let maskedValue = "";
  let valueIndex = 0;
  const rawValue = value.replace(/\D/g, ""); // Remove não dígitos

  for (let i = 0; i < mask.length; i++) {
    if (valueIndex >= rawValue.length) break; // Para quando os dígitos acabam

    if (mask[i] === "9") {
      if (/\d/.test(rawValue[valueIndex])) {
        maskedValue += rawValue[valueIndex];
        valueIndex++;
      }
    } else {
      maskedValue += mask[i];
    }
  }

  return maskedValue;
};

const InputMask = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, mask, onChange, alwaysShowMask = true, ...props }, ref) => {
    if (!mask) {
      throw new Error("A propriedade 'mask' é obrigatória para o componente InputMask.");
    }

    const [valueCurrent, setValueCurrent] = React.useState<string>(
      value ? applyMask(String(value), mask) : ""
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setValueCurrent(applyMask(String(value), mask));
      }
    }, [value, mask]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
      const maskedValue = applyMask(rawValue, mask);

      setValueCurrent(maskedValue);

      if (onChange) {
        onChange({
          ...e,
          target: { ...e.target, value: rawValue }, // Garante que o valor enviado ao onChange seja o valor limpo
        });
      }
    };

    return (
      <input
        type="text"
        value={alwaysShowMask || valueCurrent.length > 0 ? valueCurrent : ""}
        className={cn(
          "w-full px-3 py-2 mt-1 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

InputMask.displayName = "InputMask";

export { InputMask };
