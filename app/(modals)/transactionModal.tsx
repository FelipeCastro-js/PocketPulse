import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { expenseCategories, transactionTypes } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import useFetchData from "@/hooks/useFetchData";
import {
  createOrUpdateTransaction,
  deleteTransaction,
} from "@/services/transactionService";
import { TransactionType, WalletType } from "@/types";
import { formatMoney } from "@/utils/money";
import { scale, verticalScale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const Card: React.FC<{
  children: React.ReactNode;
  style?: any;
  title?: string;
}> = ({ children, style, title }) => (
  <View style={[styles.card, style]}>
    {title && (
      <Typo
        size={14}
        color={colors.neutral700}
        fontWeight="700"
        style={{ marginBottom: 8 }}
      >
        {title}
      </Typo>
    )}
    {children}
  </View>
);

const TransactionModal = () => {
  const { user } = useAuth();
  const router = useRouter();

  type ParamType = {
    id?: string;
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
    description?: string;
    image?: any;
    uid?: string;
    walletId?: string;
  };
  const oldTransaction: ParamType = useLocalSearchParams();

  const { data: wallets } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null,
    currency: "COP",
  });

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: (oldTransaction.type as any) || "expense",
        amount: Number(oldTransaction.amount || 0),
        description: oldTransaction.description || "",
        category: oldTransaction.category || "",
        date: oldTransaction.date ? new Date(oldTransaction.date) : new Date(),
        walletId: oldTransaction.walletId || "",
        image: oldTransaction.image || null,
        currency: "COP",
      });
    }
  }, [oldTransaction?.id]);

  const onDateChange = (_e: any, selectedDate: any) => {
    const currentDate = selectedDate || (transaction.date as Date);
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === "android" ? false : true);
  };

  const onSelectImage = (file: any) => {
    if (file) setTransaction({ ...transaction, image: file });
  };

  const onSubmit = async () => {
    const { type, amount, category, date, walletId, image, description } =
      transaction;

    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
      return;
    }

    const data: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image,
      uid: user?.uid,
      currency: "COP",
      ...(oldTransaction?.id ? { id: oldTransaction.id } : {}),
    };

    setLoading(true);
    const res = await createOrUpdateTransaction(data);
    setLoading(false);
    if (res.success) router.back();
    else Alert.alert("Transaction", res.msg);
  };

  const onDeleteTransaction = async () => {
    if (!oldTransaction?.id || !oldTransaction?.walletId) return;
    setLoading(true);
    const res = await deleteTransaction(
      oldTransaction.id,
      oldTransaction.walletId
    );
    setLoading(false);
    if (res.success) router.back();
    else Alert.alert("Transaction", res.msg);
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldTransaction?.id ? "Update Transaction" : "Add Transaction"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.form}
        >
          <Card>
            <View style={styles.inputBlock}>
              <Typo color={colors.neutral700} size={14} fontWeight="600">
                Type
              </Typo>
              <Dropdown
                style={styles.dropdown}
                activeColor={colors.neutral100}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                itemContainerStyle={styles.dropdownItemContainer}
                data={transactionTypes}
                maxHeight={280}
                labelField="label"
                valueField="value"
                placeholderStyle={styles.dropdownPlaceholder}
                value={transaction.type}
                containerStyle={styles.dropdownListContainer}
                onChange={(item) =>
                  setTransaction({ ...transaction, type: item.value })
                }
              />
            </View>

            <View style={styles.divider} />
            <View style={styles.inputBlock}>
              <Typo color={colors.neutral700} size={14} fontWeight="600">
                Wallet
              </Typo>
              <Dropdown
                style={styles.dropdown}
                activeColor={colors.neutral100}
                itemTextStyle={styles.dropdownItemText}
                selectedTextStyle={styles.dropdownSelectedText}
                itemContainerStyle={styles.dropdownItemContainer}
                data={wallets.map((w) => ({
                  label: `${w?.name} (${formatMoney(w?.amount || 0, {
                    currency: "COP",
                  })})`,
                  value: w?.id,
                }))}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholderStyle={styles.dropdownPlaceholder}
                value={transaction.walletId}
                containerStyle={styles.dropdownListContainer}
                onChange={(item) =>
                  setTransaction({ ...transaction, walletId: item.value || "" })
                }
              />
            </View>
          </Card>

          <Card title="Details">
            {transaction.type === "expense" && (
              <>
                <View style={styles.inputBlock}>
                  <Typo color={colors.neutral700} size={14} fontWeight="600">
                    Expense Category
                  </Typo>
                  <Dropdown
                    style={styles.dropdown}
                    activeColor={colors.neutral100}
                    itemTextStyle={styles.dropdownItemText}
                    selectedTextStyle={styles.dropdownSelectedText}
                    itemContainerStyle={styles.dropdownItemContainer}
                    data={Object.values(expenseCategories)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholderStyle={styles.dropdownPlaceholder}
                    value={transaction.category}
                    containerStyle={styles.dropdownListContainer}
                    onChange={(item) =>
                      setTransaction({
                        ...transaction,
                        category: item.value || "",
                      })
                    }
                  />
                </View>
                <View style={styles.subDivider} />
              </>
            )}

            <View style={styles.inputBlock}>
              <Typo color={colors.neutral700} size={14} fontWeight="600">
                Date
              </Typo>
              {!showDatePicker && (
                <Pressable
                  style={styles.inputLike}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Typo size={14} color={colors.text}>
                    {(transaction?.date as Date)?.toLocaleDateString("es-CO")}
                  </Typo>
                </Pressable>
              )}
              {showDatePicker && (
                <View style={Platform.OS === "android" && styles.iosDatePicker}>
                  <DateTimePicker
                    value={transaction.date as Date}
                    mode="date"
                    display={Platform.OS === "android" ? "spinner" : "default"}
                    onChange={onDateChange}
                  />
                  {Platform.OS === "android" && (
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(false)}
                    >
                      <Typo size={15} fontWeight="600">
                        OK
                      </Typo>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <View style={styles.subDivider} />
            <View style={styles.inputBlock}>
              <Typo color={colors.neutral700} size={14} fontWeight="600">
                Amount (COP)
              </Typo>
              <Input
                keyboardType="numeric"
                value={String(transaction.amount || "")}
                onChangeText={(value) =>
                  setTransaction({
                    ...transaction,
                    amount: Number(value.replace(/[^0-9]/g, "")),
                  })
                }
              />
            </View>

            <View style={styles.subDivider} />
            <View style={styles.inputBlock}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral700} size={14} fontWeight="600">
                  Description
                </Typo>
                <Typo color={colors.neutral500} size={12}>
                  (optional)
                </Typo>
              </View>
              <Input
                value={transaction.description}
                multiline
                numberOfLines={2}
                containerStyle={{
                  flexDirection: "row",
                  height: verticalScale(100),
                  alignItems: "flex-start",
                  paddingVertical: 15,
                }}
                onChangeText={(value) =>
                  setTransaction({ ...transaction, description: value })
                }
              />
            </View>

            <View style={styles.subDivider} />
            <View style={styles.inputBlock}>
              <View style={styles.flexRow}>
                <Typo color={colors.neutral700} size={14} fontWeight="600">
                  Receipt
                </Typo>
                <Typo color={colors.neutral500} size={12}>
                  (optional)
                </Typo>
              </View>
              <ImageUpload
                file={transaction.image}
                onSelect={onSelectImage}
                onClear={() => setTransaction({ ...transaction, image: null })}
                placeholder="Upload Image"
              />
            </View>
          </Card>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
            onPress={() =>
              Alert.alert("Confirm", "Delete this transaction?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: onDeleteTransaction,
                },
              ])
            }
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}

        <Button loading={loading} onPress={onSubmit} style={{ flex: 1 }}>
          <Typo color={colors.white} size={18} fontWeight="800">
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacingX._20 },
  form: {
    gap: spacingY._15,
    paddingVertical: spacingY._10,
    paddingBottom: spacingY._35,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacingX._20,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._12,
    borderTopColor: colors.neutral200,
    borderTopWidth: 1,
    marginBottom: spacingY._5,
    backgroundColor: colors.white,
  },

  inputBlock: { gap: spacingY._8 },
  flexRow: { flexDirection: "row", alignItems: "center", gap: spacingX._5 },

  divider: {
    height: 1,
    backgroundColor: colors.neutral200,
    marginVertical: spacingY._12,
  },
  subDivider: {
    height: 1,
    backgroundColor: colors.neutral200,
    marginVertical: spacingY._10,
  },

  inputLike: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    paddingHorizontal: spacingX._15,
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  dropdown: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous" as any,
    backgroundColor: colors.white,
  },
  dropdownItemText: { color: colors.text },
  dropdownSelectedText: { color: colors.text, fontSize: verticalScale(14) },
  dropdownListContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._12,
    borderCurve: "continuous" as any,
    paddingVertical: spacingY._5,
    top: 5,
    borderColor: colors.neutral200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dropdownPlaceholder: { color: colors.neutral500 },
  dropdownItemContainer: {
    borderRadius: radius._10,
    marginHorizontal: spacingX._7,
  },

  iosDatePicker: {},
  datePickerButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._10,
    marginTop: spacingY._8,
  },
});
