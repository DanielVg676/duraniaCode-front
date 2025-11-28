import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  icon?: React.ReactNode; // Para poner un icono opcional a la izquierda
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    // Detectar si containerClassName ya tiene estilos de fondo
    const hasExternalStyling = containerClassName && (containerClassName.includes('bg-') || containerClassName.includes('border'));

    return (
      <View
        className={cn(
          "flex-row items-center rounded-3xl h-12 w-full transition-colors",
          !hasExternalStyling && "border bg-white px-4",
          !hasExternalStyling && (isFocused 
            ? "border-blue-500 bg-blue-50/10" 
            : "border-slate-200 bg-white"),
          !hasExternalStyling && props.editable === false && "opacity-50 bg-slate-50",
          containerClassName
        )}
      >
        {icon && <View className="mr-3 text-slate-400">{icon}</View>}
        
        <TextInput
          ref={ref}
          placeholderTextColor="#94A3B8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
          className={cn(
            "flex-1 text-base text-slate-800",
            "focus:outline-none",
            className
          )}
          style={{ outlineWidth: 0 }}
        />
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };

