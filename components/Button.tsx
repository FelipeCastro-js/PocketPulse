import { colors, radius } from "@/constants/theme";
import { CustomButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  hasShadow = true,
  children,
  ...rest
}: CustomButtonProps) => {
  const shadowStyle = hasShadow ? styles.shadow : null;

  if (loading) {
    return (
      <View
        style={[
          styles.button,
          style,
          shadowStyle,
          { backgroundColor: "transparent" },
        ]}
        accessibilityRole="button"
        accessibilityState={{ busy: true }}
      >
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, shadowStyle]}
      activeOpacity={0.9}
      accessibilityRole="button"
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius._17,
    borderCurve: "continuous",
    height: verticalScale(52),
    justifyContent: "center",
    alignItems: "center",
  },
  shadow: {
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});
