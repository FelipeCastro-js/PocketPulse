import * as Icons from "phosphor-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletCard from "@/components/WalletCard";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { getRates } from "@/services/ratesService";
import { CurrencyCode, WalletType } from "@/types";
import { convertCurrency, formatMoney } from "@/utils/money";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("USD");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>({
    USD: 1,
    COP: 4200,
  });

  const constraints = useMemo(
    () => [
      where("uid", "==", user?.uid || "__none__"),
      orderBy("created", "desc"),
    ],
    [user?.uid]
  );

  const { data: wallets, loading } = useFetchData<WalletType>(
    "wallets",
    constraints
  );

  useEffect(() => {
    (async () => {
      const r = await getRates();
      setRates(r);
    })();
  }, []);

  const totalBalance = useMemo(() => {
    return wallets.reduce((total, w) => {
      const amountInDisplay = convertCurrency(
        w?.amount || 0,
        (w?.currency || "USD") as CurrencyCode,
        displayCurrency,
        rates
      );
      return total + amountInDisplay;
    }, 0);
  }, [wallets, displayCurrency, rates]);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={styles.balanceContainer}>
            <View style={styles.balanceHeader}>
              <Typo size={16} color={colors.neutral300}>
                Total balance
              </Typo>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowBalance((v) => !v)}
                hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
              >
                {showBalance ? (
                  <Icons.Eye
                    size={verticalScale(23)}
                    color={colors.white}
                    weight="fill"
                  />
                ) : (
                  <Icons.EyeSlash
                    size={verticalScale(23)}
                    color={colors.white}
                    weight="fill"
                  />
                )}
              </TouchableOpacity>
            </View>

            <Typo size={45} fontWeight="700" color={colors.white}>
              {showBalance
                ? formatMoney(totalBalance, displayCurrency)
                : `${displayCurrency} ****`}
            </Typo>

            <View style={styles.currencyToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleChip,
                  displayCurrency === "USD" && styles.toggleChipActive,
                ]}
                onPress={() => setDisplayCurrency("USD")}
                activeOpacity={0.8}
              >
                <Typo
                  size={14}
                  color={
                    displayCurrency === "USD" ? colors.black : colors.neutral300
                  }
                  fontWeight={displayCurrency === "USD" ? "700" : "500"}
                >
                  USD
                </Typo>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleChip,
                  displayCurrency === "COP" && styles.toggleChipActive,
                ]}
                onPress={() => setDisplayCurrency("COP")}
                activeOpacity={0.8}
              >
                <Typo
                  size={14}
                  color={
                    displayCurrency === "COP" ? colors.black : colors.neutral300
                  }
                  fontWeight={displayCurrency === "COP" ? "700" : "500"}
                >
                  COP
                </Typo>
              </TouchableOpacity>
            </View>
          </View>
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
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.black,
  },

  balanceView: {
    height: verticalScale(180),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    alignItems: "center",
    gap: spacingY._10,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  currencyToggle: {
    flexDirection: "row",
    gap: spacingX._10,
    marginTop: spacingY._5,
  },
  toggleChip: {
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.neutral700,
    backgroundColor: colors.black,
  },
  toggleChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  wallets: {
    flex: 1,
    backgroundColor: colors.neutral100,
    borderTopLeftRadius: radius._30,
    borderTopRightRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
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
