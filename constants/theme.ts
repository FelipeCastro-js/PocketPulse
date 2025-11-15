import { scale, verticalScale } from "@/utils/styling";

export const colors = {
  primary: "#2ECC71",
  primaryLight: "#6FE39A",
  primaryDark: "#28B565",

  white: "#FFFFFF",
  black: "#000000",

  text: "#0B0F0E",
  textLight: "#222826",
  textLighter: "#3B413F",

  rose: "#E11D48",
  green: "#16A34A",

  neutral50: "#FFFFFF",
  neutral100: "#F8FAFC",
  neutral200: "#EEF2F5",
  neutral300: "#E3E8EC",
  neutral350: "#D7DDE2",
  neutral400: "#98A2A9",
  neutral500: "#6B7280",
  neutral600: "#4B5563",
  neutral700: "#374151",
  neutral800: "#1F2937",
  neutral900: "#0B0F0E",
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _8: scale(8),
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
  _8: verticalScale(8),
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
