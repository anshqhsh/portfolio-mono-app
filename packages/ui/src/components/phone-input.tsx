import { useState, useEffect } from "react";
import { cn } from "../lib/utils.ts";
import "react-phone-number-input/style.css";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export function PhoneNumberInput({
  value,
  onChange,
  placeholder,
  className,
  error,
  disabled,
}: PhoneNumberInputProps) {
  const [PhoneInput, setPhoneInput] = useState<any>(null);

  useEffect(() => {
    import("react-phone-number-input").then((module) => {
      setPhoneInput(() => module.default);
    });
  }, []);

  if (!PhoneInput) return null;

  return (
    <PhoneInput
      international
      defaultCountry="KR"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        error && "border-destructive",
        className
      )}
    />
  );
}
