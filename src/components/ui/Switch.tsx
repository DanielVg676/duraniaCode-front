import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, View } from "react-native";

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = React.forwardRef<View, SwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, ...props }, ref) => (
    <Pressable
      ref={ref as any}
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        // LAYOUT & TAMAÑO
        "flex-row h-8 w-14 shrink-0 items-center rounded-full border-2 border-transparent",
        // POSICIONAMIENTO (Esto arregla que se mueva a donde no debe)
        "self-start", 
        // COLORES & ESTADOS (Minimalista Azulado)
        checked ? "bg-blue-600" : "bg-slate-200",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View
        className={cn(
          // THUMB (El círculo)
          "h-7 w-7 rounded-full bg-white shadow-sm shadow-slate-400 elevation-2",
          // ANIMACIÓN / TRANSICIÓN (Simulada con lógica de renderizado)
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </Pressable>
  )
);
Switch.displayName = "Switch";

export { Switch };
