import * as Icons from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import BackButton from "@/components/BackButton";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletCard from "@/components/WalletCard";

import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { CurrencyCode, WalletType } from "@/types";
import { formatMoney } from "@/utils/money";
import { scale, verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";

import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

const HERO_H = verticalScale(210);

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid;

  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [displayCurrency] = useState<CurrencyCode>("COP");

  const constraints = useMemo(() => {
    if (!uid) return null;
    return [where("uid", "==", uid), orderBy("created", "desc")];
  }, [uid]);

  const { data: wallets, loading } = useFetchData<WalletType>(
    "wallets",
    constraints,
    { enabled: !!uid }
  );

  const totalBalance = useMemo(
    () => wallets.reduce((total, w) => total + Number(w?.amount || 0), 0),
    [wallets]
  );

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
            <View style={styles.heroTopRow}>
              <BackButton />
              <Typo size={20} fontWeight="800" color={colors.white}>
                Wallets
              </Typo>
              <View style={{ width: verticalScale(30) }} />
            </View>

            <View pointerEvents="none" style={styles.rings}>
              <View style={[styles.ring, { width: 260, height: 260 }]} />
              <View style={[styles.ring, { width: 190, height: 190 }]} />
              <View style={[styles.ring, { width: 120, height: 120 }]} />
            </View>

            <Svg
              width="100%"
              height={verticalScale(60)}
              viewBox="0 0 1440 160"
              preserveAspectRatio="none"
              style={styles.wave}
              pointerEvents="none"
            >
              <Path
                d="M0,40 Q720,160 1440,40 L1440,160 L0,160 Z"
                fill={colors.neutral100}
                stroke={colors.neutral100}
                strokeWidth={2}
              />
            </Svg>

            <View style={styles.balanceOverlay}>
              <Typo size={16} color={"#FFFFFFCC"}>
                Total balance
              </Typo>
              <View style={{ height: verticalScale(6) }} />
              <Typo size={45} fontWeight="800" color={colors.white}>
                {showBalance
                  ? formatMoney(totalBalance)
                  : `${displayCurrency} ****`}
              </Typo>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: spacingX._20,
                  top: -verticalScale(4),
                }}
                onPress={() => setShowBalance((v) => !v)}
                hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
              >
                {showBalance ? (
                  <Icons.Eye
                    size={verticalScale(22)}
                    color={colors.white}
                    weight="fill"
                  />
                ) : (
                  <Icons.EyeSlash
                    size={verticalScale(22)}
                    color={colors.white}
                    weight="fill"
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.wallets}>
          <View style={styles.headerRow}>
            <Typo size={20} fontWeight="700" color={colors.text}>
              My Wallets
            </Typo>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}

          <FlatList
            data={wallets}
            keyExtractor={(item) => item.id as string}
            renderItem={({ item, index }) => (
              <WalletCard
                item={item}
                router={router}
                index={index}
                showBalance={showBalance}
              />
            )}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral100 },

  heroWrap: { height: HERO_H, position: "relative" },
  heroGradient: {
    flex: 1,
    paddingTop: spacingY._15,
    overflow: "hidden",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacingX._20,
    marginTop: spacingY._5,
    zIndex: 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  balanceInHero: {
    marginTop: spacingY._20,
    alignItems: "center",
    gap: spacingY._10,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  wave: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -1,
    zIndex: 1,
  },

  balanceOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: verticalScale(36),
    alignItems: "center",
    zIndex: 2,
  },

  wallets: {
    flex: 1,
    backgroundColor: colors.neutral100,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    padding: spacingX._20,
    paddingTop: spacingX._25,
    marginTop: -verticalScale(10),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
    gap: spacingY._12,
  },
});
