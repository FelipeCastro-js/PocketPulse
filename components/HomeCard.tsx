import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { formatMoney } from "@/utils/money";
import { scale, verticalScale } from "@/utils/styling";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import * as React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const HomeCard = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = React.useState(false);

  const { data: wallets, loading: walletLoading } = useFetchData<WalletType>(
    "wallets",
    [where("uid", "==", user?.uid), orderBy("created", "desc")]
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
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Typo color={colors.neutral700} size={16} fontWeight="600">
          Total Balance
        </Typo>
        <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
          {showBalance ? (
            <Icons.Eye
              size={verticalScale(20)}
              color={colors.neutral700}
              weight="fill"
            />
          ) : (
            <Icons.EyeSlash
              size={verticalScale(20)}
              color={colors.neutral700}
              weight="fill"
            />
          )}
        </TouchableOpacity>
      </View>

      <Typo
        size={32}
        fontWeight="800"
        color={colors.text}
        style={{ marginTop: 2 }}
      >
        {walletLoading
          ? "----"
          : showBalance
          ? formatMoney(totals.balance)
          : "COP ****"}
      </Typo>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <View style={styles.statLabelRow}>
            <View
              style={[
                styles.iconPill,
                {
                  backgroundColor: colors.neutral200,
                  borderColor: colors.neutral300,
                },
              ]}
            >
              <Icons.ArrowDown
                size={verticalScale(14)}
                color={colors.primary}
                weight="bold"
              />
            </View>
            <Typo size={14} color={colors.neutral600} fontWeight="600">
              Income
            </Typo>
          </View>
          <Typo
            size={17}
            fontWeight="700"
            color={colors.green}
            style={{ marginTop: spacingY._5 }}
          >
            {walletLoading
              ? "----"
              : showBalance
              ? formatMoney(totals.income)
              : "COP ****"}
          </Typo>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <View style={styles.statLabelRow}>
            <View
              style={[
                styles.iconPill,
                {
                  backgroundColor: colors.neutral200,
                  borderColor: colors.neutral300,
                },
              ]}
            >
              <Icons.ArrowUp
                size={verticalScale(14)}
                color={colors.rose}
                weight="bold"
              />
            </View>
            <Typo size={14} color={colors.neutral600} fontWeight="600">
              Expense
            </Typo>
          </View>
          <Typo
            size={17}
            fontWeight="700"
            color={colors.rose}
            style={{ marginTop: spacingY._5 }}
          >
            {walletLoading
              ? "----"
              : showBalance
              ? formatMoney(totals.expenses)
              : "COP ****"}
          </Typo>
        </View>
      </View>
    </View>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacingX._20,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsRow: {
    marginTop: spacingY._20,
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: { flex: 1 },
  statLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  iconPill: {
    height: verticalScale(28),
    width: verticalScale(28),
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  divider: {
    width: 1,
    height: scale(42),
    backgroundColor: colors.neutral200,
    marginHorizontal: spacingX._15,
  },
});
