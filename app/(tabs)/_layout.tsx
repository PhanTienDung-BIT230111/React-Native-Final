import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
          headerShown: true,
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: "Dự án",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="sitemap" size={20} color={color} />
          ),
          headerShown: false, // Ẩn header cho tab này
        }}
      />

      <Tabs.Screen
        name="employees"
        options={{
          title: "Nhân sự",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="contracts/index"
        options={{
          title: "Hợp đồng",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="file-text" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="report/index"
        options={{
          title: "Báo cáo",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 