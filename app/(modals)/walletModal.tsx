import Button from "@/components/Button";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletService";
import { scale, verticalScale } from "@/utils/styling";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

import BackButton from "@/components/BackButton";
import { useAuth } from "@/context/authContext";
import { CurrencyCode, WalletType } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Icons from "phosphor-react-native";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
    currency: "COP",
  });
  const params = useLocalSearchParams() as {
    id?: string;
    name?: string;
    image?: string;
    currency?: CurrencyCode;
  };
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      setWallet({
        name: params.name || "",
        image: params?.image || null,
        currency: "COP",
      });
    }
  }, [params?.id, params?.name, params?.image, params?.currency]);

  const onSelectImage = (file: any) => {
    if (file) setWallet({ ...wallet, image: file });
  };

  const onSubmit = async () => {
    const { name, image } = wallet;
    if (loading) return;
    if (!name.trim() || !image) {
      Alert.alert("Wallet", "Please fill all the fields!");
      return;
    }

    setLoading(true);
    const data: Partial<WalletType> = {
      uid: user?.uid,
      name: wallet.name.trim(),
      image: wallet.image,
      currency: "COP",
      ...(params.id ? { id: params.id } : {}),
    };

    const res = await createOrUpdateWallet(data);
    setLoading(false);
    if (res.success) router.back();
    else Alert.alert("Wallet", res.msg);
  };

  const onDelete = async () => {
    if (!params?.id) return;
    setLoading(true);
    const res = await deleteWallet(params.id);
    setLoading(false);
    if (res.success) router.back();
    else Alert.alert("Wallet", res.msg);
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to do this?\nThis will remove all the transactions related to this wallet!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => onDelete(), style: "destructive" },
      ]
    );
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={params?.id ? "Update Wallet" : "New Wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Typo size={14} color={colors.neutral700} fontWeight={"600"}>
                Wallet Name
              </Typo>
              <Input
                placeholder="Salary"
                value={wallet.name}
                onChangeText={(value) => setWallet({ ...wallet, name: value })}
                style={styles.inputOverride}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Typo size={14} color={colors.neutral700} fontWeight={"600"}>
                Currency
              </Typo>
              <View style={styles.pickerWrap}>
                <Picker
                  selectedValue={wallet.currency}
                  onValueChange={(val: CurrencyCode) =>
                    setWallet((prev) => ({ ...prev, currency: val }))
                  }
                >
                  <Picker.Item label="COP" value="COP" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Typo size={14} color={colors.neutral700} fontWeight={"600"}>
                Wallet Icon
              </Typo>
              <ImageUpload
                file={wallet.image}
                onSelect={onSelectImage}
                onClear={() => setWallet({ ...wallet, image: null })}
                placeholder="Upload Image"
                style={styles.uploadBox}
                iconColor={colors.primary}
                borderColor={colors.neutral300}
                textColor={colors.neutral600}
              />
              <View style={styles.helperRow}>
                <Icons.Info
                  size={verticalScale(16)}
                  color={colors.neutral500}
                />
                <Typo size={12} color={colors.neutral500}>
                  Use a square image (1:1) for best results.
                </Typo>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            {params?.id && !loading && (
              <Button style={styles.deleteBtn} onPress={showDeleteAlert}>
                <Icons.Trash
                  color={colors.white}
                  size={verticalScale(20)}
                  weight="bold"
                />
              </Button>
            )}
            <Button
              onPress={onSubmit}
              loading={loading}
              style={styles.primaryBtn}
            >
              <Typo color={colors.white} fontWeight={"700"} size={18}>
                {params?.id ? "Update Wallet" : "Add Wallet"}
              </Typo>
            </Button>
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacingX._20,
    shadowColor: colors.neutral900,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  inputGroup: {
    gap: spacingY._10,
  },
  inputOverride: {
    backgroundColor: colors.white,
    borderColor: colors.neutral300,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral200,
    marginVertical: spacingY._15,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.white,
  },
  uploadBox: {
    backgroundColor: colors.neutral100,
    borderColor: colors.neutral300,
  },
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: spacingY._7,
  },
  actions: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  deleteBtn: {
    backgroundColor: colors.rose,
    paddingHorizontal: spacingX._15,
  },
});
