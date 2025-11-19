import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function Intro() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/welcome");
    }, 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        entering={FadeIn.duration(600)}
        exiting={FadeOut.duration(300)}
        style={styles.logoWrap}
      >
        <Image
          source={require("@/assets/images/name_logo.png")}
          style={styles.logo}
          contentFit="contain"
          transition={150}
        />
      </Animated.View>

      <View pointerEvents="none" style={styles.roundMask} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrap: { alignItems: "center", justifyContent: "center" },
  logo: {
    width: verticalScale(180),
    height: verticalScale(180),
  },
  roundMask: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius._30,
    overflow: "hidden",
  },
});
