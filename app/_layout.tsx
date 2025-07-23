import { Stack } from "expo-router";
import React from "react";
import HeaderWithAvatar from "../components/HeaderWithAvatar";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="Home"
        options={{
          header: () => (
            <HeaderWithAvatar
              title="Admin Dashboard"
              avatarUrl="https://i.pravatar.cc/150?img=1"
            />
          ),
        }}
      />
    </Stack>
  );
}
