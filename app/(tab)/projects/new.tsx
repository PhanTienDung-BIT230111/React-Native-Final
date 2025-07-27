// app/projects/new.tsx
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function NewProjectScreen() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [newMember, setNewMember] = useState("");
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Chi tiết dự án"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);
  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên dự án không được để trống.");
      return;
    }

    try {
      const newProject = {
        name,
        client,
        description,
        progress: "0",
        status: "Chờ xử lý",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
        members,
      };

      const docRef = await addDoc(collection(db, "projects"), newProject);
      console.log("Đã tạo dự án với ID:", docRef.id);
      router.replace(`/projects/${docRef.id}`);
    } catch (err) {
      console.error("Lỗi tạo dự án:", err);
      Alert.alert("Lỗi", "Không thể tạo dự án. Vui lòng thử lại.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/projects")}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Tên dự án</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Khách hàng</Text>
      <TextInput style={styles.input} value={client} onChangeText={setClient} />

      <Text style={styles.label}>Hạn chót (yyyy-mm-dd)</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Thành viên dự án</Text>
      <View style={styles.row}>
        <TextInput
          placeholder="Nhập email thành viên"
          style={[styles.input, { flex: 1 }]}
          value={newMember}
          onChangeText={setNewMember}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+</Text>
        </TouchableOpacity>
      </View>

      {members.map((item, index) => (
        <View key={index} style={styles.memberItem}>
          <Text>{item}</Text>
          <TouchableOpacity onPress={() => handleRemoveMember(index)}>
            <Text style={{ color: "#dc2626", fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tạo dự án</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  label: {
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 4,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    fontSize: 30,
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
});
