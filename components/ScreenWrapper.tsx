import { colors } from "@/constants/theme";
import { ScreenWrapperProps } from "@/types";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Dimensions, Platform, View } from "react-native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: ScreenWrapperProps) => {
  let paddingTop = Platform.OS === "android" ? height * 0.06 : 50;
  return (
    <View
      style={[
        { paddingTop, flex: 1, backgroundColor: colors.neutral50 },
        style,
      ]}
    >
      <StatusBar style="light" />
      {children}
    </View>
  );
};

export default ScreenWrapper;
