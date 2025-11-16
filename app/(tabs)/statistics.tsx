import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import TransactionList from "@/components/TransactionList";
import Typo from "@/components/Typo";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import {
  fetchMonthlyStats,
  fetchWeeklyStats,
  fetchYearlyStats,
} from "@/services/transactionService";
import { buildNiceYAxis } from "@/utils/axis";
import { scale, verticalScale } from "@/utils/styling";
import { useFocusEffect } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

type AnyObj = Record<string, any>;

type GiftedBar = {
  value: number;
  label?: string;
  frontColor?: string;
  spacing?: number;
  labelWidth?: number;
};
type WeeklyRow = { label: string; income?: number; expense?: number };

function normalizeWeeklyChartData(input: Array<GiftedBar | WeeklyRow>) {
  const BAR = scale(12);
  const INNER = scale(8);
  const GROUP = scale(26);
  const groupWidth = BAR * 2 + INNER;

  const isGifted =
    Array.isArray(input) &&
    input.length > 0 &&
    (input[0] as any).value !== undefined;

  if (isGifted) {
    const out: GiftedBar[] = [];
    let lastLabel: string | undefined;
    for (let i = 0; i < input.length; i++) {
      const item = input[i] as GiftedBar;
      const labelChanged = item.label && item.label !== lastLabel;

      out.push({
        ...item,

        labelWidth: labelChanged ? groupWidth : item.labelWidth,

        spacing: labelChanged ? INNER : GROUP,
      });

      if (item.label) lastLabel = item.label;
    }

    return {
      data: out,
      barWidth: BAR,
      initialSpacing: GROUP / 2,
      endSpacing: GROUP / 2,
    };
  }

  const rows = input as WeeklyRow[];
  const out: GiftedBar[] = [];

  for (const row of rows) {
    const incomeVal = Number(row.income ?? 0);
    const expenseVal = Number(row.expense ?? 0);
    const hasIncome = incomeVal > 0;
    const hasExpense = expenseVal > 0;

    if (hasIncome && hasExpense) {
      out.push({
        value: incomeVal,
        label: row.label,
        labelWidth: groupWidth,
        frontColor: colors.primary,
        spacing: INNER,
      });
      out.push({
        value: expenseVal,
        frontColor: colors.rose,
        spacing: GROUP,
      });
    } else if (hasIncome || hasExpense) {
      const onlyVal = hasIncome ? incomeVal : expenseVal;
      const onlyColor = hasIncome ? colors.primary : colors.rose;
      out.push({
        value: onlyVal,
        label: row.label,
        labelWidth: groupWidth,
        frontColor: onlyColor,
        spacing: GROUP,
      });
    } else {
      out.push({
        value: 0,
        label: row.label,
        labelWidth: groupWidth,
        frontColor: "transparent",
        spacing: GROUP,
      });
    }
  }

  return {
    data: out,
    barWidth: BAR,
    initialSpacing: GROUP / 2,
    endSpacing: GROUP / 2,
  };
}

function normalizeChartData(raw: AnyObj[] = []) {
  if (!raw?.length) return [];

  const looksLikeGifted =
    raw[0]?.value !== undefined && (raw[0]?.frontColor || raw[0]?.label);
  if (looksLikeGifted) return raw;

  const out: AnyObj[] = [];
  for (const row of raw) {
    const label: string = row.label ?? "";
    const incomeVal = Number(row.income ?? 0);
    const expenseVal = Number(row.expense ?? 0);

    out.push({
      value: incomeVal,
      label,
      spacing: scale(4),
      labelWidth: scale(30),
      frontColor: colors.primary,
    });

    out.push({
      value: expenseVal,
      frontColor: colors.rose,
    });
  }
  return out;
}

const Statistics = () => {
  const { user } = useAuth();

  const [chartLoading, setChartLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartRaw, setChartRaw] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (activeIndex === 0) getWeeklyStats();
    if (activeIndex === 1) getMonthlyStats();
    if (activeIndex === 2) getYearlyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoading(true);
    const res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartRaw(res.data.stats || []);
      setTransactions(res.data.transactions || []);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const getMonthlyStats = async () => {
    setChartLoading(true);
    const res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartRaw(res.data.stats || []);
      setTransactions(res.data.transactions || []);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const getYearlyStats = async () => {
    setChartLoading(true);
    const res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartRaw(res.data.stats || []);
      setTransactions(res.data.transactions || []);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const weeklyNormalized = useMemo(
    () => normalizeWeeklyChartData(chartRaw as any[]),
    [chartRaw]
  );

  const chartData = useMemo(() => normalizeChartData(chartRaw), [chartRaw]);

  const refetchCurrent = useCallback(() => {
    if (!user?.uid) return;
    if (activeIndex === 0) return void getWeeklyStats();
    if (activeIndex === 1) return void getMonthlyStats();
    return void getYearlyStats();
  }, [activeIndex, user?.uid]);

  useEffect(() => {
    refetchCurrent();
  }, [refetchCurrent]);

  useFocusEffect(
    useCallback(() => {
      refetchCurrent();
    }, [refetchCurrent])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchCurrent();
    setRefreshing(false);
  }, [refetchCurrent]);

  const {
    data: dataWeekly,
    barWidth,
    initialSpacing,
    endSpacing,
  } = weeklyNormalized;

  const dataForChart = activeIndex === 0 ? dataWeekly : chartData;

  const barSpacing = useMemo(
    () => ([1, 2].includes(activeIndex) ? scale(24) : scale(16)),
    [activeIndex]
  );
  const chartCardWidth = screenWidth - spacingX._20 * 2 - scale(2);

  const sections = 3;
  const { maxValue, stepValue, yAxisLabelTexts } = buildNiceYAxis(
    dataForChart as Array<{ value: number }>,
    sections
  );

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title="Statistics" />
          {/* Screen search icon */}
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.white}
              colors={[colors.primary]}
              progressBackgroundColor={colors.neutral900}
            />
          }
        >
          <View style={styles.segmentWrap}>
            <SegmentedControl
              values={["Weekly", "Monthly", "Yearly"]}
              selectedIndex={activeIndex}
              onChange={(e) =>
                setActiveIndex(e.nativeEvent.selectedSegmentIndex)
              }
              appearance="dark"
              tintColor={colors.neutral200}
              backgroundColor={colors.neutral800}
              fontStyle={styles.segmentFont}
              activeFontStyle={{
                fontSize: verticalScale(13),
                fontWeight: "700",
                color: colors.black,
              }}
              style={styles.segment}
            />
          </View>

          <View style={[styles.card, { width: chartCardWidth }]}>
            <View style={styles.cardHeader}>
              <Typo size={16} color={colors.neutral600} fontWeight="600">
                {activeIndex === 0
                  ? "This week"
                  : activeIndex === 1
                  ? "This month"
                  : "This year"}
              </Typo>
              <View style={styles.legendRow}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Typo size={12} color={colors.neutral600}>
                  Income
                </Typo>
                <View style={{ width: spacingX._10 }} />
                <View
                  style={[styles.legendDot, { backgroundColor: colors.rose }]}
                />
                <Typo size={12} color={colors.neutral600}>
                  Expense
                </Typo>
              </View>
            </View>

            <View style={styles.chartArea}>
              {dataForChart.length > 0 ? (
                <BarChart
                  data={dataForChart}
                  barWidth={activeIndex === 0 ? barWidth : scale(12)}
                  spacing={activeIndex === 0 ? undefined : barSpacing}
                  initialSpacing={
                    activeIndex === 0 ? initialSpacing : undefined
                  }
                  endSpacing={activeIndex === 0 ? endSpacing : undefined}
                  roundedTop
                  roundedBottom
                  hideRules
                  xAxisThickness={0}
                  yAxisThickness={0}
                  yAxisLabelTexts={yAxisLabelTexts}
                  yAxisTextStyle={{ color: colors.neutral400 }}
                  xAxisLabelTextStyle={{
                    color: colors.neutral400,
                    fontSize: verticalScale(11),
                  }}
                  noOfSections={sections}
                  maxValue={maxValue}
                  stepValue={stepValue}
                />
              ) : (
                <View style={styles.chartEmpty} />
              )}

              {chartLoading && (
                <View style={styles.chartLoading}>
                  <Loading />
                </View>
              )}
            </View>
          </View>

          <View style={styles.transactionsCard}>
            <TransactionList
              title="Transactions"
              emptyListMessage="No transactions found"
              data={transactions}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._5,
  },

  header: {
    marginBottom: spacingY._5,
  },

  scrollView: {
    gap: spacingY._20,
    paddingBottom: verticalScale(110),
  },

  segmentWrap: {},
  segment: {
    height: scale(38),
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  segmentFont: {
    fontSize: verticalScale(13),
    fontWeight: "700",
    color: colors.white,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacingX._20,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    alignSelf: "center",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacingY._10,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },

  legendDot: {
    height: verticalScale(10),
    width: verticalScale(10),
    borderRadius: 999,
  },

  chartArea: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    minHeight: verticalScale(210),
  },

  chartEmpty: {
    height: verticalScale(210),
    width: "100%",
    backgroundColor: colors.neutral100,
    borderRadius: radius._12,
    borderCurve: "continuous" as any,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },

  chartLoading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius._12,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  transactionsCard: {
    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacingX._20,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  searchIcon: {
    backgroundColor: colors.neutral700,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: verticalScale(35),
    width: verticalScale(35),
    borderCurve: "continuous" as any,
  },
});
