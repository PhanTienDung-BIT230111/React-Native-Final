// app/projects/[id].tsx
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const deleteAllProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));

      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "projects", document.id))
      );

      await Promise.all(deletePromises);

      console.log("🗑️ Đã xóa tất cả dự án thành công.");
    } catch (error) {
      console.error("❌ Lỗi khi xóa tất cả projects:", error);
    }
  };
  const handleDelete = async () => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá dự án này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "projects", id as string));
            Alert.alert("🗑️ Đã xoá thành công!");
            router.replace("/projects"); // điều hướng quay về danh sách
          } catch (err) {
            const error = err as Error;
            Alert.alert("❌ Lỗi khi xoá dự án", error.message);
          }
        },
      },
    ]);
  };
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

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject(docSnap.data());
        } else {
          console.warn("Không tìm thấy dự án!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dự án:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;
  if (!project) return <Text style={styles.text}>Không có dữ liệu.</Text>;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/projects")}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{project.name}</Text>

      <View style={styles.badgeContainer}>
        <Text style={styles.badge}>{project.status}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Khách hàng:</Text>
        <Text style={styles.text}>{project.client}</Text>

        <Text style={styles.label}>Tiến độ:</Text>
        <Text style={styles.text}>{project.progress}%</Text>

        <Text style={styles.label}>Deadline:</Text>
        <Text style={styles.text}>
          {project.deadline?.toDate
            ? moment(project.deadline.toDate()).format("DD/MM/YYYY")
            : "N/A"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Mô tả:</Text>
        <Text style={styles.text}>{project.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Thành viên:</Text>
        {project.members?.map((email: string, index: number) => (
          <Text key={index} style={styles.text}>
            • {email}
          </Text>
        ))}
      </View>

      <TouchableOpacity style={styles.editButton}>
        <FontAwesome name="pencil" size={16} color="#fff" />
        <Text style={styles.editButtonText}>Chỉnh sửa dự án</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "#dc2626",
          padding: 12,
          borderRadius: 8,
          marginTop: 16,
        }}
        onPress={handleDelete}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Xoá dự án
        </Text>
      </TouchableOpacity>
      <Button
        title="Xóa toàn bộ dự án"
        color="#dc2626"
        onPress={deleteAllProjects}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  badgeContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#facc15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
  },
  badge: { fontSize: 12, fontWeight: "600" },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontWeight: "600", color: "#374151", marginTop: 8 },
  text: { fontSize: 16, color: "#111827", marginTop: 4 },
  editButton: {
    marginTop: 24,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
  },
  editButtonText: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
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
