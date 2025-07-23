import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import HeaderWithAvatar from "../../components/HomeComponent/HeaderWithAvatar";

export default function employees() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Nhân sự"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employees</Text>
      <Text style={styles.description}>This is the employees page.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
});
