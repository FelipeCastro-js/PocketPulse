import { colors } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Text, TextStyle } from "react-native";

const Typo = ({
  size,
  color = colors.black,
  fontWeight = "400",
  children,
  style,
  textProps = {},
}: TypoProps) => {
  const fontSize = size ? verticalScale(size) : verticalScale(18);
  const textStyle: TextStyle = {
    fontSize,
    color,
    fontWeight,
    lineHeight: Math.round(fontSize * 1.35),
  };
  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
