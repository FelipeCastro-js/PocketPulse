import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  primary: "#A3E635",
  primaryLight: "#C6F36C",
  primaryDark: "#7FB528",

  text: "#FFFFFF",
  textLight: "#E5E5E5",
  textLighter: "#D4D4D4",

  white: "#FFFFFF",
  black: "#000000",

  rose: "#EF4444",
  green: "#16A34A",

  neutral50: "#0B0B0C",
  neutral100: "#101214",
  neutral200: "#17191C",
  neutral300: "#1F2225",
  neutral350: "#262A2E",
  neutral400: "#a3a3a3",
  neutral500: "#5B636B",
  neutral600: "#7A828A",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#E5E7EB",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _20: scale(20),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _30: verticalScale(30),
};
