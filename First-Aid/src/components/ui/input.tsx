// src/components/ui/Input.tsx
import { cn } from "@/lib/utils";
import React from "react";
import {
    TextInput,
    TextInputProps,
} from "react-native";

export interface InputProps extends TextInputProps {
  className?: string;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        {...props}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";
