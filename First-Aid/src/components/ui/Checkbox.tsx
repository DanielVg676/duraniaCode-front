// src/components/ui/Checkbox.tsx
import { cn } from "@/lib/utils";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className,
}) => {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className={cn(
        "h-5 w-5 rounded border border-input items-center justify-center",
        className
      )}
    >
      {checked && (
        <View className="items-center justify-center">
          <Check size={14} color="#16a34a" />
        </View>
      )}
    </Pressable>
  );
};
