import * as Icons from "phosphor-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";

type WalletItem = {
  id: string;
  name: string;
  amount: number;
};

const MOCK_WALLETS: WalletItem[] = [
  { id: "1", name: "Main Wallet", amount: 1245000 },
  { id: "2", name: "Savings", amount: 955000 },
  { id: "3", name: "Travel", amount: 210000 },
];

function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("en-US").format(n);
  } catch {
    return `${n}`;
  }
}

const Wallet = () => {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState<boolean>(false);

  const total = useMemo(
    () => MOCK_WALLETS.reduce((acc, w) => acc + (w.amount || 0), 0),
    []
  );

  const renderItem = ({ item }: ListRenderItemInfo<WalletItem>) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Icons.Wallet
            size={verticalScale(22)}
            color={colors.text}
            weight="fill"
          />
        </View>

        <View style={{ gap: spacingY._5 }}>
          <Typo size={16} fontWeight="600" color={colors.text}>
            {item.name}
          </Typo>
          <Typo size={14} color={colors.neutral500}>
            COP {showBalance ? formatNumber(item.amount) : "****"}
          </Typo>
        </View>
      </View>

      <Icons.CaretRight
        size={verticalScale(20)}
        color={colors.neutral600}
        weight="bold"
      />
    </View>
  );

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* Top balance section */}
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
              COP {showBalance ? formatNumber(total) : "****"}
            </Typo>
          </View>
        </View>

        {/* Bottom panel with list */}
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

          <FlatList
            data={MOCK_WALLETS}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listStyle}
            ItemSeparatorComponent={() => (
              <View style={{ height: spacingY._10 }} />
            )}
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

  /* Top */
  balanceView: {
    height: verticalScale(160),
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

  /* Bottom panel */
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
  },

  /* Card */
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,

    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.neutral300,

    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
  },
  iconWrap: {
    height: verticalScale(44),
    width: verticalScale(44),
    borderRadius: radius._12,
    borderCurve: "continuous",
    backgroundColor: colors.neutral200,
    alignItems: "center",
    justifyContent: "center",
  },
});
