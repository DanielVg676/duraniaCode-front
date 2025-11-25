// src/components/ui/Checkbox.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "h-6 w-6 rounded-lg items-center justify-center shadow-sm",
        checked 
          ? "bg-blue-600 border-2 border-blue-600" 
          : "bg-white border-2 border-slate-300",
        disabled && "opacity-50",
        className
      )}
    >
      {checked && (
        <Check size={12} color="white" strokeWidth={3} style={{ margin: 0, padding: 0 }} />
      )}
    </Pressable>
  );
};
