import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import { useNavigation } from "expo-router";
import HeaderWithAvatar from "../../components/HomeComponent/HeaderWithAvatar";
import ProjectOverview from "../../components/ProjectComponent/ProjectOverview";
import { FontAwesome } from "@expo/vector-icons";
import SearchBar from "../../components/SearchBar";
export default function projects() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Dự án"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <ProjectOverview
          iconName="folder"
          color="#000"
          label="Tổng dự án"
          total="20"
          // sau lay du lieu tu firebase
          bgColor="#fff"
        />
        <ProjectOverview
          iconName="clock-o"
          color="#000"
          label="Đang thực hiện"
          total="10"
          bgColor="#fff"
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.buttonText}>Tạo dự án mới</Text>
        </View>
      </TouchableOpacity>
      <SearchBar
        placeholder="Tìm kiếm dự án"
        data={[
          { id: "1", name: "Vờ lờ" },
          { id: "2", name: "Dự án B" },
          { id: "3", name: "Chim én C" },
          // Thêm dữ liệu mẫu hoặc lấy từ Firebase
        ]}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f3f4f6",
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
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
