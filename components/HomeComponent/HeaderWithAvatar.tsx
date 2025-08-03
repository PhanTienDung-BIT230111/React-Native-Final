import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  title: string;
  avatarUrl?: string;
};

const HeaderWithAvatar = ({ title, avatarUrl }: Props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const toggleModal = () => setModalVisible(!isModalVisible);

  const handleLogout = () => {
    Alert.alert("Xác nhận", "Bạn muốn đăng xuất?", [
      { text: "Huỷ" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          router.replace("/auth/login");
        },
      },
    ]);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.subContainer}>
          <Feather name="bell" size={24} color="black" />

          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={{
                uri: avatarUrl || "https://i.pravatar.cc/150?img=8",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} 
          activeOpacity={1} 
          onPress={toggleModal}
        >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View style={styles.modal}>
                <Text style={styles.menuTitle}>👤 Tài khoản</Text>

                <Pressable
                  style={styles.menuItem}
                  onPress={() => {
                    toggleModal();
                    router.push("/(tabs)/Home"); 
                  }}
                >
                  <Text style={styles.menuText}>Thông tin cá nhân</Text>
                </Pressable>

                <Pressable style={styles.menuItem} onPress={handleLogout}>
                  <Text style={[styles.menuText, { color: "#dc2626" }]}>
                    Đăng xuất
                  </Text>
                </Pressable>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  menuItem: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#111827",
  },
});

export default HeaderWithAvatar;
