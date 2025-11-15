import Button from "@/components/Button";
import HomeCard from "@/components/HomeCard";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import { TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { limit, orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const contraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30),
  ];

  const { data: recentTransactions, loading: transactionsLoading } =
    useFetchData<TransactionType>("transactions", contraints);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo fontWeight="700" size={20} color={colors.white}>
              {user?.name || " "}
            </Typo>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(modals)/searchModal")}
            style={styles.searchIcon}
            activeOpacity={0.85}
          >
            <Icons.MagnifyingGlass
              size={verticalScale(20)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View>
            <HomeCard />
          </View>

          <TransactionList
            title="Recent Transactions"
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
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  searchIcon: {
    backgroundColor: colors.neutral700,
    padding: spacingX._10,
    borderRadius: 50,
  },
  floatingButton: {
    height: verticalScale(50),
    width: verticalScale(50),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(105),
    right: verticalScale(30),
  },

  scrollViewStyle: {
    marginTop: spacingY._10,
    paddingBottom: verticalScale(100),
    gap: spacingY._25,
  },
});
