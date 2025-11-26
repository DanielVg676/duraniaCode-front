import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
    Pressable,
    PressableProps,
    Text,
    View,
} from "react-native";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends Omit<PressableProps, 'children'>,
    VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

function Badge({ className, variant, children, onPress, ...props }: BadgeProps) {
  const Component = onPress ? Pressable : View;
  
  return (
    <Component
      {...props}
      onPress={onPress}
      className={cn(badgeVariants({ variant }), className)}
    >
      {typeof children === "string" ? (
        <Text className={cn(
          "text-xs font-semibold",
          variant === "default" && "text-primary-foreground",
          variant === "secondary" && "text-secondary-foreground",
          variant === "destructive" && "text-destructive-foreground",
          variant === "outline" && "text-foreground"
        )}>{children}</Text>
      ) : (
        children
      )}
    </Component>
  );
}

export { Badge, badgeVariants };

