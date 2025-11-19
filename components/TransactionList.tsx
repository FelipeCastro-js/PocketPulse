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
import { Pressable, StyleSheet, View } from "react-native";
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
    ?.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });

  const amountAbs = Math.abs(item?.amount || 0);
  const amountStr = formatMoney(amountAbs, { currency: "COP" });
  const sign = item?.type === "income" ? "+" : "-";
  const defaultAmountColor =
    item?.type === "income" ? colors.green : colors.rose;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handleClick(item)}
        style={({ pressed }) => [styles.rowBase, pressed && styles.rowPressed]}
      >
        {({ pressed }) => {
          const fg = pressed ? colors.white : colors.text;
          const sub = pressed ? "#FFFFFFCC" : colors.neutral500;
          const amountColor = pressed ? colors.white : defaultAmountColor;
          const pillBg = pressed ? colors.white : category?.bgColor;

          return (
            <>
              <View style={[styles.icon, { backgroundColor: pillBg }]}>
                {!!IconComponent && (
                  <IconComponent
                    size={verticalScale(22)}
                    weight="fill"
                    color={pressed ? colors.text : colors.white}
                  />
                )}
              </View>

              <View style={styles.categoryDes}>
                <Typo size={16} fontWeight="600" color={fg}>
                  {category?.label || "Uncategorized"}
                </Typo>
                {!!item?.description && (
                  <Typo size={12} color={sub} textProps={{ numberOfLines: 1 }}>
                    {item.description}
                  </Typo>
                )}
              </View>

              <View style={styles.amountDate}>
                <Typo fontWeight="800" color={amountColor}>
                  {`${sign} ${amountStr}`}
                </Typo>
                <Typo size={12} color={sub}>
                  {date}
                </Typo>
              </View>
            </>
          );
        }}
      </Pressable>
    </Animated.View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: { gap: spacingY._17 },
  list: { minHeight: 3 },

  rowBase: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.white,
    borderRadius: 0,
    borderWidth: 0,
    paddingVertical: spacingY._12,
    paddingHorizontal: spacingX._15,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  rowPressed: {
    backgroundColor: colors.primary,
    elevation: 6,
    shadowOpacity: 0.12,
    transform: [{ scale: 0.995 }],
  },

  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous" as any,
  },
  categoryDes: { flex: 1, gap: 2 },
  amountDate: { alignItems: "flex-end", gap: 2 },
});
