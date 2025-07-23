import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
type Props = {
  title: string;
  avatarUrl?: string;
};

const HeaderWithAvatar = ({ title, avatarUrl }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.subContainer}>
        <Feather name="bell" size={24} color="black" />
        <Image
          source={{
            uri: avatarUrl || "https://i.pravatar.cc/150?img=8", // ảnh mặc định
          }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    height: 60,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    justifyContent: "space-between",
    borderBottomColor: "#ccc",
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default HeaderWithAvatar;
