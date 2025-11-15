import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import {
  TransactionItemProps,
  TransactionListType,
  TransactionType,
} from "@/types";
import { formatMoney } from "@/utils/money";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item.id,
        type: item.type,
        amount: String(item.amount),
        category: item.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item.description,
        image: item?.image,
        uid: item.uid,
        walletId: item.walletId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typo fontWeight="700" size={20} color={colors.text}>
          {title}
        </Typo>
      )}

      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              handleClick={handleClick}
              item={item}
              index={index}
            />
          )}
          keyExtractor={(item) => item.id || ""}
        />
      </View>

      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  const category =
    item?.type === "income"
      ? incomeCategory
      : item.category
      ? expenseCategories[item.category]
      : expenseCategories.others;

  const IconComponent = category?.icon;

  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });

  const amountStr = formatMoney(Math.abs(item?.amount || 0), {
    currency: "COP",
  });
  const sign = item?.type === "income" ? "+" : "-";
  const amountColor = item?.type === "income" ? colors.primary : colors.rose;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View
          style={[
            styles.icon,
            { backgroundColor: category?.bgColor || colors.neutral500 },
          ]}
        >
          {!!IconComponent && (
            <IconComponent
              size={verticalScale(22)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typo size={16} fontWeight="600" color={colors.text}>
            {category?.label || "Uncategorized"}
          </Typo>
          {!!item?.description && (
            <Typo
              size={12}
              color={colors.neutral500}
              textProps={{ numberOfLines: 1 }}
            >
              {item.description}
            </Typo>
          )}
        </View>

        <View style={styles.amountDate}>
          <Typo fontWeight="700" color={amountColor}>
            {`${sign} ${amountStr}`}
          </Typo>
          <Typo size={12} color={colors.neutral500}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.white,
    borderRadius: radius._17,
    borderCurve: "continuous" as any,
    borderWidth: 1,
    borderColor: colors.neutral200,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous" as any,
  },
  categoryDes: {
    flex: 1,
    gap: 2,
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 2,
  },
});
