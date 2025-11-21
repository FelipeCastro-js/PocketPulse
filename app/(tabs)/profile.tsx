import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import * as Icons from "phosphor-react-native";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const HERO_H = verticalScale(220);

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (
        <Icons.User
          size={verticalScale(26)}
          color={colors.white}
          weight="fill"
        />
      ),
      routeName: "/profileModa",
      bgColor: "#6366f1",
    },
    {
      title: "Logout",
      icon: (
        <Icons.Power
          size={verticalScale(26)}
          color={colors.white}
          weight="fill"
        />
      ),
      bgColor: "#e11d48",
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/(auth)/login");
  };

  const handlePress = (item: accountOptionType) => {
    if (item.title === "Logout") {
      Alert.alert("Confirm", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: handleLogout },
      ]);
      return;
    }
    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.neutral100 }}>
      <View style={styles.container}>
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={[colors.primaryDark, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View pointerEvents="none" style={styles.rings}>
              <View style={[styles.ring, { width: 260, height: 260 }]} />
              <View style={[styles.ring, { width: 190, height: 190 }]} />
              <View style={[styles.ring, { width: 120, height: 120 }]} />
            </View>

            <View style={styles.titleCenter}>
              <Typo size={20} fontWeight="800" color={colors.white}>
                Profile
              </Typo>
            </View>

            <Svg
              width={"100%"}
              height={verticalScale(85)}
              viewBox="0 0 1440 160"
              style={styles.wave}
            >
              <Path
                d="M0,40 Q720,160 1440,40 L1440,160 L0,160 Z"
                fill={colors.neutral100}
              />
            </Svg>
          </LinearGradient>
        </View>

        <View style={styles.avatarWrap}>
          <Image
            style={styles.avatar}
            source={getProfileImage(user?.image)}
            contentFit="cover"
            transition={120}
          />
        </View>

        <View style={styles.nameContainer}>
          <Typo size={22} fontWeight="800" color={colors.text}>
            {user?.name || ""}
          </Typo>
          <Typo size={14} color={colors.neutral500}>
            {user?.email || ""}
          </Typo>
        </View>

        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(index * 50)
                .springify()
                .damping(14)}
              style={styles.listItem}
            >
              <TouchableOpacity
                style={styles.row}
                onPress={() => handlePress(item)}
              >
                <View
                  style={[styles.listIcon, { backgroundColor: item.bgColor }]}
                >
                  {item.icon}
                </View>
                <Typo size={16} style={{ flex: 1 }} fontWeight="600">
                  {item.title}
                </Typo>
                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight="bold"
                  color={colors.neutral600}
                />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroWrap: { position: "relative", height: HERO_H },
  heroGradient: {
    flex: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
    paddingTop: spacingY._20,
  },
  titleCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacingY._20,
  },
  rings: {
    position: "absolute",
    left: -40,
    top: spacingY._10,
    opacity: 0.18,
  },
  ring: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 999,
    marginVertical: scale(16),
  },
  wave: {
    position: "absolute",
    bottom: -25,
    left: 0,
  },

  avatarWrap: {
    position: "absolute",
    top: HERO_H - verticalScale(68),
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: 999,
    shadowColor: colors.black,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  avatar: {
    height: verticalScale(120),
    width: verticalScale(120),
    borderRadius: 999,
    backgroundColor: colors.neutral300,
  },

  nameContainer: {
    alignItems: "center",
    marginTop: verticalScale(70),
    gap: verticalScale(4),
  },

  accountOptions: {
    marginTop: spacingY._35,
    paddingHorizontal: spacingX._20,
  },
  listItem: {
    marginBottom: verticalScale(14),
    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    borderWidth: 1,
    borderColor: colors.neutral200,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
  },
});
