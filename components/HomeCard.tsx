import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { formatMoney } from "@/utils/money";
import { scale, verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const HomeCard = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = React.useState(false);
  const uid = user?.uid;

  const walletConstraints = React.useMemo(() => {
    if (!uid) return null;
    return [where("uid", "==", uid), orderBy("created", "desc")];
  }, [uid]);

  const { data: wallets, loading: walletLoading } = useFetchData<WalletType>(
    "wallets",
    walletConstraints,
    { enabled: !!uid }
  );

  const totals = React.useMemo(() => {
    return wallets.reduce(
      (acc, w) => {
        const amount = Number(w.amount || 0);
        const income = Number(w.totalIncome || 0);
        const expenses = Number(w.totalExpenses || 0);
        acc.balance += amount;
        acc.income += income;
        acc.expenses += expenses;
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  }, [wallets]);

  return (
    <View style={styles.shadowWrap}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0, y: 0.4 }}
        end={{ x: 1, y: 0.6 }}
        style={styles.card}
      >
        {/* Cabecera dentro de la tarjeta */}
        <View style={styles.topRow}>
          <Typo size={14} color={"#FFFFFFCC"} fontWeight="700">
            Total Balance
          </Typo>

          <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
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

        <Typo
          size={34}
          fontWeight="800"
          color={colors.white}
          style={{ marginTop: spacingY._7 }}
        >
          {walletLoading
            ? "----"
            : showBalance
            ? formatMoney(totals.balance)
            : "COP ****"}
        </Typo>

        <View style={styles.separator} />

        <View style={styles.bottomRow}>
          <View style={styles.statBox}>
            <View style={styles.labelRow}>
              <View style={styles.pillLight}>
                <Icons.ArrowDown
                  size={verticalScale(14)}
                  color={colors.text}
                  weight="bold"
                />
              </View>
              <Typo size={15} color={"#FFFFFFE6"} fontWeight="700">
                Income
              </Typo>
            </View>
            <Typo size={16} fontWeight="800" color={colors.white}>
              {walletLoading
                ? "----"
                : showBalance
                ? formatMoney(totals.income)
                : "COP ****"}
            </Typo>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <View style={styles.labelRow}>
              <View style={styles.pillLight}>
                <Icons.ArrowUp
                  size={verticalScale(14)}
                  color={colors.text}
                  weight="bold"
                />
              </View>
              <Typo size={15} color={"#FFFFFFE6"} fontWeight="700">
                Expenses
              </Typo>
            </View>
            <Typo size={16} fontWeight="800" color={colors.white}>
              {walletLoading
                ? "----"
                : showBalance
                ? formatMoney(totals.expenses)
                : "COP ****"}
            </Typo>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: radius._20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  card: {
    borderRadius: radius._20,
    borderCurve: "continuous" as any,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._17,
    paddingBottom: spacingY._15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
    marginVertical: spacingY._12,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
  },
  statBox: {
    flex: 1,
    gap: spacingY._5,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._8,
  },
  pillLight: {
    height: verticalScale(26),
    width: verticalScale(26),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  divider: {
    width: 1,
    height: scale(36),
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});
