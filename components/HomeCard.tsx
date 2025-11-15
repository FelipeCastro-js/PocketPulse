import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { formatMoney } from "@/utils/money";
import { scale, verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
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
    <View style={styles.shadowWrap}>
      <LinearGradient
        colors={["#00B7A5", colors.primary]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <Typo size={14} color={"#FFFFFFCC"} fontWeight="600">
            Balance
          </Typo>

          <TouchableOpacity onPress={() => setShowBalance((v) => !v)}>
            {showBalance ? (
              <Icons.Eye
                size={verticalScale(20)}
                color={"#FFFFFF"}
                weight="fill"
              />
            ) : (
              <Icons.EyeSlash
                size={verticalScale(20)}
                color={"#FFFFFF"}
                weight="fill"
              />
            )}
          </TouchableOpacity>
        </View>

        <Typo
          size={34}
          fontWeight="800"
          color={"#FFFFFF"}
          style={{ marginTop: 2 }}
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
                  color={"#0B0F0E"}
                  weight="bold"
                />
              </View>
              <Typo size={14} color={"#FFFFFFE6"} fontWeight="700">
                Income
              </Typo>
            </View>
            <Typo size={16} fontWeight="800" color={"#FFFFFF"}>
              {walletLoading
                ? "----"
                : showBalance
                ? formatMoney(totals.income)
                : "COP ****"}
            </Typo>
          </View>

          <View
            style={{
              width: 1,
              height: scale(36),
              backgroundColor: "#FFFFFF33",
            }}
          />

          <View style={styles.statBox}>
            <View style={styles.labelRow}>
              <View style={styles.pillLight}>
                <Icons.ArrowUp
                  size={verticalScale(14)}
                  color={"#0B0F0E"}
                  weight="bold"
                />
              </View>
              <Typo size={14} color={"#FFFFFFE6"} fontWeight="700">
                Expense
              </Typo>
            </View>
            <Typo size={16} fontWeight="800" color={"#FFFFFF"}>
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
    borderRadius: radius._15,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  card: {
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    padding: spacingX._20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  separator: {
    height: 1,
    backgroundColor: "#FFFFFF33",
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
    backgroundColor: "#FFFFFF",
  },
});
