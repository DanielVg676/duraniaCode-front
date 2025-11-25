import { cn } from "@/lib/utils";
import * as React from "react";
import {
    Pressable,
    View,
} from "react-native";

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
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-primary" : "bg-input",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View
        className={cn(
          "block h-5 w-5 rounded-full bg-background shadow-lg transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </Pressable>
  )
);
Switch.displayName = "Switch";

export { Switch };

