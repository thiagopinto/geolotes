import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
} from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  defaultValue?: PathValue<T, Path<T>>;
  children?: React.ReactNode;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  disabled,
  rules,
  defaultValue,
  children,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue ? defaultValue : undefined}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-end gap-2">
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                value={field.value ?? ""} // Garante um valor inicial
              />
              {children}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
