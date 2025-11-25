// src/components/ui/AppModal.tsx
import { cn } from "@/lib/utils";
import { X } from "lucide-react-native";
import React from "react";
import {
    Modal,
    Pressable,
    Text,
    View,
} from "react-native";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center px-4">
        <View
          className={cn(
            "w-full max-w-md rounded-lg bg-background p-4",
            className
          )}
        >
          <View className="flex-row items-center justify-between mb-4">
            {title ? (
              <Text className="text-lg font-semibold">{title}</Text>
            ) : (
              <View />
            )}
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full"
            >
              <X size={18} color="#6b7280" />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default AppModal;
