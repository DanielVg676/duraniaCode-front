import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { ActivityIndicator, Pressable, PressableProps, Text } from "react-native";

const buttonVariants = cva(
  "flex-row items-center justify-center gap-2 rounded-full transition-all", 
  // 'rounded-full' es clave para el look amigable
  {
    variants: {
      variant: {
        default: "bg-blue-600 active:bg-blue-700 shadow-sm shadow-blue-200",
        destructive: "bg-red-500 active:bg-red-600 shadow-sm shadow-red-200",
        outline:
          "border border-slate-100 bg-white active:bg-slate-50",
        secondary:
          "bg-blue-50 active:bg-blue-100",
        ghost: "bg-transparent active:bg-slate-100",
        link: "text-blue-600 underline-offset-4",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 px-4 rounded-full",
        lg: "h-14 px-8 rounded-full",
        icon: "h-12 w-12 p-0", // Cuadrado perfecto (o circulo con rounded-full)
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
  isLoading?: boolean; // Nuevo prop para loading
  textClassName?: string; // Para personalizar el texto específicamente
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, children, isLoading, textClassName, disabled, ...props }, ref) => {
    
    // Determinamos el color del texto/spinner basado en la variante
    const isSolid = variant === 'default' || variant === 'destructive';
    const textColorClass = isSolid ? 'text-white' : variant === 'link' ? 'text-blue-600' : 'text-slate-700';
    const spinnerColor = isSolid ? 'white' : '#2563EB'; // Azul para variantes claras

    return (
      <Pressable
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          buttonVariants({ variant, size, className }),
          (disabled || isLoading) && "opacity-50",
          "active:scale-95" // Efecto de pulsación sutil
        )}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={spinnerColor} />
        ) : (
          <>
            {/* Si pasas componentes (iconos), se renderizan tal cual */}
            {typeof children === "string" ? (
              <Text className={cn("text-base font-semibold", textColorClass, textClassName)}>
                {children}
              </Text>
            ) : (
              children
            )}
          </>
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

