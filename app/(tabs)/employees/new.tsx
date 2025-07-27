import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function NewEmployeeScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("Nhân viên");
  const [status, setStatus] = useState("Hoạt động");
  const [img, setImg] = useState("");
  const navigation = useNavigation();

  const roles = ["Quản lý", "Nhân viên", "Thực tập"];
  const positions = [
    "Software Engineer",
    "Frontend Developer", 
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Security Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "QA Engineer",
    "System Administrator",
    "Network Engineer"
  ];
  const statuses = ["Hoạt động", "Nghỉ phép", "Nghỉ việc"];

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Thêm nhân sự"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Tên và email không được để trống.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    try {
      const newEmployee = {
        name: name.trim(),
        email: email.trim(),
        position: position.trim(),
        role,
        status,
        img: img.trim() || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "employees"), newEmployee);
      console.log("Đã tạo nhân sự với ID:", docRef.id);
      Alert.alert("Thành công", "Đã thêm nhân sự mới!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/employees"),
        },
      ]);
    } catch (err) {
      console.error("Lỗi tạo nhân sự:", err);
      Alert.alert("Lỗi", "Không thể tạo nhân sự. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/employees")}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Thông tin nhân sự</Text>

      <Text style={styles.label}>Họ và tên *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập họ và tên"
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Vị trí công việc</Text>
      <TextInput
        style={styles.input}
        value={position}
        onChangeText={setPosition}
        placeholder="Nhập vị trí công việc"
      />

      <Text style={styles.label}>URL Ảnh đại diện</Text>
      <TextInput
        style={styles.input}
        value={img}
        onChangeText={setImg}
        placeholder="Nhập URL ảnh (để trống để tự động tạo)"
        autoCapitalize="none"
      />
      {img && (
        <View style={styles.imagePreview}>
          <Text style={styles.previewText}>Xem trước:</Text>
          <Image
            source={{ uri: img }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        </View>
      )}

      <Text style={styles.label}>Vai trò</Text>
      <View style={styles.pickerContainer}>
        {roles.map((roleOption) => (
          <TouchableOpacity
            key={roleOption}
            style={[
              styles.pickerOption,
              role === roleOption && styles.pickerOptionSelected,
            ]}
            onPress={() => setRole(roleOption)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                role === roleOption && styles.pickerOptionTextSelected,
              ]}
            >
              {roleOption}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Vị trí (Gợi ý)</Text>
      <View style={styles.pickerContainer}>
        {positions.map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[
              styles.pickerOption,
              position === pos && styles.pickerOptionSelected,
            ]}
            onPress={() => setPosition(pos)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                position === pos && styles.pickerOptionTextSelected,
              ]}
            >
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Trạng thái</Text>
      <View style={styles.pickerContainer}>
        {statuses.map((statusOption) => (
          <TouchableOpacity
            key={statusOption}
            style={[
              styles.pickerOption,
              status === statusOption && styles.pickerOptionSelected,
            ]}
            onPress={() => setStatus(statusOption)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                status === statusOption && styles.pickerOptionTextSelected,
              ]}
            >
              {statusOption}
            </Text>
          </TouchableOpacity>
        ))}
    </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.buttonText}>Thêm nhân sự</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  pickerOptionSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  pickerOptionTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  imagePreview: {
    marginBottom: 16,
    alignItems: "center",
  },
  previewText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#d1d5db",
  },
});
