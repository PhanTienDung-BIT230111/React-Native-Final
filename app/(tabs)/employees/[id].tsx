import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import {
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function EmployeeDetail() {
  const { id } = useLocalSearchParams();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleDelete = async () => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá nhân sự này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "employees", id as string));
            Alert.alert("🗑️ Đã xoá thành công!");
            router.replace("/(tabs)/employees");
          } catch (err) {
            const error = err as Error;
            Alert.alert("❌ Lỗi khi xoá nhân sự", error.message);
          }
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Chi tiết nhân sự"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!id) return;

    const fetchEmployee = async () => {
      try {
        const docRef = doc(db, "employees", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEmployee(docSnap.data());
        } else {
          console.warn("Không tìm thấy nhân sự!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy nhân sự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 32 }} size="large" />;
  if (!employee) return <Text style={styles.text}>Không có dữ liệu.</Text>;

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

      {/* Header với ảnh và tên */}
      <View style={styles.header}>
        <Image
          source={{ uri: employee.img }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{employee.name}</Text>
          <Text style={styles.position}>{employee.position}</Text>
          <View style={styles.statusContainer}>
            <Text style={[
              styles.statusTag,
              employee.status === "Hoạt động" && styles.statusActive,
              employee.status === "Nghỉ phép" && styles.statusLeave,
              employee.status === "Nghỉ việc" && styles.statusInactive,
            ]}>
              {employee.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin liên hệ</Text>
        
        <View style={styles.infoRow}>
          <FontAwesome name="envelope" size={16} color="#666" />
          <Text style={styles.infoText}>{employee.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="user" size={16} color="#666" />
          <Text style={styles.infoText}>{employee.role}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={16} color="#666" />
          <Text style={styles.infoText}>
            Tham gia: {employee.createdAt?.toDate
              ? moment(employee.createdAt.toDate()).format("DD/MM/YYYY")
              : "N/A"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={16} color="#666" />
          <Text style={styles.infoText}>
            Cập nhật: {employee.updatedAt?.toDate
              ? moment(employee.updatedAt.toDate()).format("DD/MM/YYYY HH:mm")
              : "N/A"}
          </Text>
        </View>
      </View>

      

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push({
            pathname: "/employees/edit",
            params: { id: id as string }
          })}
        >
          <FontAwesome name="pencil" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <FontAwesome name="trash" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Xoá nhân sự</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  position: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: "flex-start",
  },
  statusTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
  statusLeave: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#374151",
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: "#000",
  },
  deleteButton: {
    backgroundColor: "#dc2626",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 32,
    color: "#666",
  },
}); 