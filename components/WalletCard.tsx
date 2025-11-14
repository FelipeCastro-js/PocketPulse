import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { WalletType } from "@/types";
import { formatNumber } from "@/utils/common";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { Router } from "expo-router";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

const resolveSource = (img: any) => {
  if (!img) return undefined;
  if (typeof img === "string") return { uri: img };
  if (img?.uri) return { uri: img.uri };
  return img;
};

const WalletCard = ({
  item,
  index,
  router,
  showBalance,
}: {
  item: WalletType;
  index: number;
  router: Router;
  showBalance: boolean;
}) => {
  const handleOpen = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: typeof item?.image === "string" ? item.image : item?.image?.uri,
      },
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(13)}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handleOpen}
        activeOpacity={0.9}
      >
        <View style={styles.left}>
          <View style={styles.avatarFrame}>
            {item.image ? (
              <Image
                style={styles.avatar}
                source={resolveSource(item.image)}
                contentFit="cover"
                transition={100}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Icons.Wallet
                  size={verticalScale(22)}
                  color={colors.white}
                  weight="bold"
                />
              </View>
            )}
          </View>

          <View style={styles.textBlock}>
            <Typo size={16} fontWeight="600" color={colors.text}>
              {item.name}
            </Typo>
            <Typo size={13} color={colors.neutral500}>
              USD {showBalance ? formatNumber(item?.amount || 0) : "****"}
            </Typo>
          </View>
        </View>

        <Icons.CaretRight
          size={verticalScale(20)}
          weight="bold"
          color={colors.neutral600}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral50,
    borderRadius: radius._15,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    flex: 1,
  },
  avatarFrame: {
    height: verticalScale(46),
    width: verticalScale(46),
    borderRadius: radius._12,
    borderCurve: "continuous",
    overflow: "hidden",
    backgroundColor: colors.neutral200,
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  avatar: {
    height: "100%",
    width: "100%",
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
});
