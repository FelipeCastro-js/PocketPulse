// app/auth/welcome.tsx
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const WelcomePage = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        {/* login & image */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.loginButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Typo fontWeight={"500"}>Sign in</Typo>
          </TouchableOpacity>

          <Animated.View entering={FadeIn.duration(500)}>
            <Image
              source={require("../../assets/images/welcome.png")}
              style={styles.welcomeImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={17} color={colors.textLighter}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={17} color={colors.textLighter}>
              lifestyle in future
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={() => router.push("/register")}>
              <Typo size={22} color={colors.black} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: "flex-end",
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral100,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});

export default WelcomePage;
