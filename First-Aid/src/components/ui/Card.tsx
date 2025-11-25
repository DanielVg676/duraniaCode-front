// src/components/ui/Card.tsx
import { cn } from "@/lib/utils"; // tu helper de clases, igual que en web
import React from "react";
import {
  Pressable,
  PressableProps,
  Text,
  View,
  ViewProps,
} from "react-native";

interface BaseCardProps {
  className?: string;
  children?: React.ReactNode;
}

type CardProps = BaseCardProps &
  (ViewProps | (PressableProps & { onPress?: () => void }));

export const Card: React.FC<CardProps> = ({
  className,
  children,
  ...props
}: CardProps) => {
  const hasOnPress = "onPress" in props && typeof props.onPress === "function";

  if (hasOnPress) {
    const pressableProps = props as PressableProps;
    return (
      <Pressable
        {...pressableProps}
        className={cn(
          "rounded-lg border border-border bg-card shadow-sm",
          className
        )}
      >
        {children}
      </Pressable>
    );
  }

  const viewProps = props as ViewProps;
  return (
    <View
      {...viewProps}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm",
        className
      )}
    >
      {children}
    </View>
  );
};

export const CardContent: React.FC<BaseCardProps> = ({
  className,
  children,
}) => {
  return <View className={cn("p-6 pt-0", className)}>{children}</View>;
};

export const CardHeader: React.FC<BaseCardProps> = ({
  className,
  children,
}) => {
  return (
    <View className={cn("flex flex-col space-y-1.5 p-6", className)}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<BaseCardProps> = ({
  className,
  children,
}) => {
  return (
    <View className={cn("flex items-center p-6 pt-0", className)}>
      {children}
    </View>
  );
};

export const CardTitle: React.FC<BaseCardProps> = ({
  className,
  children,
}) => {
  return (
    <View className={cn(className)}>
      {typeof children === "string" ? (
        <Text className="text-2xl font-semibold leading-none tracking-tight">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};
