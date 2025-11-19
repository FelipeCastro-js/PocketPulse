import Button from "@/components/Button";
import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const uid = user?.uid;

  const constraints = useMemo(() => {
    if (!uid) return null;
    return [where("uid", "==", uid), orderBy("date", "desc"), limit(30)];
  }, [uid]);

  const { data: recentTransactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", constraints, {
      enabled: !!uid,
    });

  const logout = async () => {
    await signOut(auth);
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
            <View style={styles.topBar}>
              <View>
                <Typo size={16} color={colors.white}>
                  Hello,
                </Typo>
                <Typo size={22} fontWeight="800" color={colors.white}>
                  {user?.name || " "}
                </Typo>
              </View>
              <View style={{ width: verticalScale(34) }} />
              <TouchableOpacity
                onPress={() => router.push("/(modals)/searchModal")}
                style={styles.searchIcon}
                activeOpacity={0.85}
              >
                <Icons.MagnifyingGlass
                  size={verticalScale(20)}
                  color={colors.white}
                  weight="bold"
                />
              </TouchableOpacity>
            </View>

            <View pointerEvents="none" style={styles.rings}>
              <View style={[styles.ring, { width: 280, height: 280 }]} />
              <View style={[styles.ring, { width: 200, height: 200 }]} />
              <View style={[styles.ring, { width: 140, height: 140 }]} />
            </View>
          </LinearGradient>

          <View style={styles.cardHolder}>
            <HomeCard />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Typo size={20} fontWeight="800" color={colors.text}>
              Transactions History
            </Typo>
          </View>

          <TransactionList
            loading={transactionsLoading}
            data={recentTransactions}
            emptyListMessage="No transactions yet"
          />
        </ScrollView>

        <Button
          onPress={() => router.push("/(modals)/transactionModal")}
          style={styles.floatingButton}
        >
          <Icons.Plus
            color={colors.white}
            weight="bold"
            size={verticalScale(24)}
          />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral100,
  },

  heroWrap: {
    position: "relative",
    backgroundColor: colors.neutral100,
  },
  heroGradient: {
    height: verticalScale(190),
    paddingTop: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderBottomLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    borderCurve: "continuous" as any,
    overflow: "hidden",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  searchIcon: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: spacingX._10,
    borderRadius: 50,
  },
  rings: {
    position: "absolute",
    right: -40,
    top: 10,
    opacity: 0.18,
  },
  ring: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 999,
    marginVertical: scale(14),
  },

  cardHolder: {
    marginTop: verticalScale(-36),
    paddingHorizontal: spacingX._20,
  },

  sectionHeader: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._7,
  },

  scrollViewStyle: {
    paddingBottom: verticalScale(110),
  },

  floatingButton: {
    height: verticalScale(56),
    width: verticalScale(56),
    borderRadius: 999,
    position: "absolute",
    bottom: verticalScale(98),
    right: verticalScale(24),
  },
});
