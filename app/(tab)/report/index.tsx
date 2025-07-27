import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function report() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Thống kê"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report</Text>
      <Text style={styles.description}>This is the report page.</Text>
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
