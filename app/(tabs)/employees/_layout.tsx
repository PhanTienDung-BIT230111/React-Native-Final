// app/projects/_layout.tsx
import { Stack } from "expo-router";

export default function EmployeeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // hoặc true nếu muốn header mặc định
      }}
    />
  );
}
