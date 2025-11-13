import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";

import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";

const SignUp = () => {
  const router = useRouter();

  const email = useRef("");
  const password = useRef("");
  const name = useRef("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const onSubmit = async () => {
    if (!name.current || !email.current || !password.current) {
      Alert.alert("Register", "Please fill all the fields!");
      return;
    }
    setLoading(true);
    const res = await register(email.current, password.current, name.current);
    setLoading(false);
    if (!res.success) {
      Alert.alert("Register", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <BackButton iconSize={28} />

        {/* welcome */}
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let&apos;s
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        {/* form */}
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typo>

          <Input
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your name"
            onChangeText={(value) => (name.current = value)}
          />

          <Input
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(value) => (email.current = value)}
          />

          <Input
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(value) => (password.current = value)}
          />

          {/* button */}
          <Button loading={loading} onPress={onSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Sign Up
            </Typo>
          </Button>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.push("/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              {" "}
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
