import { colors, radius } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { Router, useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router: Router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style && style]}
    >
      <CaretLeft
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral600,
    alignSelf: "flex-start",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
