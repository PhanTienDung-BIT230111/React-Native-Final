// app/projects/_layout.tsx
import { Stack } from "expo-router";

export default function ProjectLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true, // hoặc true nếu muốn header mặc định
      }}
    />
  );
}
