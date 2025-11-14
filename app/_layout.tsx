import { AuthProvider } from "@/context/authContext";
import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(modals)/profileModa"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="(modals)/walletModal"
            options={{ presentation: "modal" }}
          />
          <Stack.Screen
            name="(modals)/searchModal"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
