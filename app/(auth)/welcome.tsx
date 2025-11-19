import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper style={{ backgroundColor: colors.neutral100 }}>
      <View style={styles.container}>
        <Animated.View
          entering={FadeIn.duration(500)}
          style={styles.signInWrap}
        >
          <TouchableOpacity
            onPress={() => router.push("/login")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Typo size={16} color={colors.text} fontWeight="700">
              Sign in
            </Typo>
          </TouchableOpacity>
        </Animated.View>

        <View pointerEvents="none" style={styles.rings}>
          <View
            style={[styles.ring, { width: width * 1.1, height: width * 1.1 }]}
          />
          <View
            style={[styles.ring, { width: width * 0.9, height: width * 0.9 }]}
          />
          <View
            style={[styles.ring, { width: width * 0.7, height: width * 0.7 }]}
          />
        </View>

        <Animated.View
          entering={FadeInUp.duration(700).springify().damping(12)}
          style={styles.heroWrap}
        >
          <Image
            source={require("@/assets/images/welcome1.png")}
            style={styles.hero}
            contentFit="contain"
            transition={200}
          />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(80).springify().damping(12)}
          style={styles.copy}
        >
          <Typo
            size={32}
            fontWeight="900"
            color={colors.text}
            style={{ textAlign: "center", lineHeight: verticalScale(38) }}
          >
            Spend Smarter{"\n"}Save More
          </Typo>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(800).delay(160).springify().damping(12)}
          style={styles.actions}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/register")}
          >
            <LinearGradient
              colors={[colors.primaryDark, colors.primary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.cta}
            >
              <Typo size={20} fontWeight="900" color={colors.white}>
                Get Started
              </Typo>
            </LinearGradient>
          </TouchableOpacity>

          <Typo
            size={14}
            color={colors.textLighter}
            style={{ marginTop: spacingY._10, alignSelf: "center" }}
          >
            Already Have Account?{" "}
            <Link
              href="/login"
              style={{ color: colors.primary, fontWeight: "800" }}
            >
              Log In
            </Link>
          </Typo>
        </Animated.View>

        <View style={{ height: verticalScale(10) }} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacingY._20,
    paddingHorizontal: spacingX._20,
    alignItems: "center",

    justifyContent: "flex-start",
  },

  signInWrap: {
    alignSelf: "stretch",
    alignItems: "flex-end",
  },

  rings: {
    position: "absolute",
    top: verticalScale(0),
    alignSelf: "center",
    opacity: 0.55,
  },
  ring: {
    borderWidth: 1,
    borderColor: "#E9F4EF",
    borderRadius: 999,
    alignSelf: "center",
    marginVertical: scale(20),
  },

  heroWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: spacingY._10,
  },
  hero: {
    width: "100%",
    height: Math.min(verticalScale(380), height * 0.45),
  },

  copy: {
    marginTop: spacingY._10,
    marginBottom: spacingY._5,
    paddingHorizontal: spacingX._10,
  },

  actions: {
    width: "100%",
    marginTop: spacingY._10,
    marginBottom: spacingY._20,
  },

  cta: {
    width: "100%",
    height: verticalScale(60),
    borderRadius: radius._30,
    borderCurve: "continuous" as any,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.neutral900,
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
});
