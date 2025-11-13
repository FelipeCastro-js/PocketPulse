import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace("/welcome");
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/images/welcome.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});

export default SplashScreen;
