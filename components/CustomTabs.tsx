import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import * as Icons from "phosphor-react-native";
import React, { JSX } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const iconByRoute: Record<string, (focused: boolean) => JSX.Element> = {
    home: (focused) => (
      <Icons.SquaresFour
        size={verticalScale(20)}
        weight={focused ? "fill" : "regular"}
        color={"#FFFFFF"}
      />
    ),
    statistics: (focused) => (
      <Icons.ChartBar
        size={verticalScale(20)}
        weight={focused ? "fill" : "regular"}
        color={"#FFFFFF"}
      />
    ),
    wallet: (focused) => (
      <Icons.Wallet
        size={verticalScale(20)}
        weight={focused ? "fill" : "regular"}
        color={"#FFFFFF"}
      />
    ),
    graphs: (focused) => (
      <Icons.ChartPieSlice
        size={verticalScale(20)}
        weight={focused ? "fill" : "regular"}
        color={"#FFFFFF"}
      />
    ),
    profile: (focused) => (
      <Icons.User
        size={verticalScale(20)}
        weight={focused ? "fill" : "regular"}
        color={"#FFFFFF"}
      />
    ),
  };

  const labelByRoute: Record<string, string> = {
    home: "Home",
    statistics: "Stats",
    wallet: "Wallet",
    graphs: "Charts",
    profile: "Profile",
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.root,

        {
          bottom: Math.max(insets.bottom, verticalScale(8)) + verticalScale(10),
        },
      ]}
    >
      <View style={styles.shadowWrap}>
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.bar}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const Icon = iconByRoute[route.name];

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({ type: "tabLongPress", target: route.key });
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.9}
                style={styles.slot}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
              >
                {isFocused ? (
                  <View style={styles.activePill}>
                    {Icon ? Icon(true) : null}
                    <Text style={styles.activeLabel}>
                      {labelByRoute[route.name] ?? route.name}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.iconOnly}>
                    {Icon ? Icon(false) : null}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </LinearGradient>
      </View>
    </View>
  );
}

export default CustomTabs;

const BAR_H = Platform.OS === "android" ? verticalScale(56) : verticalScale(52);

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  shadowWrap: {
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  bar: {
    height: BAR_H,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  slot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOnly: {
    height: BAR_H - 18,
    minWidth: verticalScale(36),
    paddingHorizontal: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: BAR_H - 18,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  activeLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
