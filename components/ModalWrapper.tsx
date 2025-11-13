import { colors, spacingX, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";

const isAndroid = Platform.OS == "android";

const ModalWrapper = ({
  style,
  children,
  bg = colors.neutral100,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style && style]}>
      <StatusBar style="light" />
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    paddingTop: isAndroid ? spacingX._15 : 50,
    paddingBottom: isAndroid ? spacingY._20 : spacingY._10,
    flex: 1,
  },
});
