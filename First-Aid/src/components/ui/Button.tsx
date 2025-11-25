// src/components/ui/Button.tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Pressable, PressableProps, Text } from "react-native";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline:
          "border border-input bg-background text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        ghost: "bg-transparent",
        link: "bg-transparent text-primary underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
  children?: React.ReactNode;
}

const ButtonComponent = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {/* IMPORTANTE: en móvil, el texto debe ir en <Text> */}
      {typeof children === "string" ? (
        <Text className="text-sm font-medium text-inherit">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
});

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent;
