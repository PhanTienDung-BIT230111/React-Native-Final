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
  query,
  where,
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
  View
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function ProjectDetail() {
  const { id } = useLocalSearchParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<Date | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const navigation = useNavigation();

  const fetchMembersInfo = async (memberEmails: string[]) => {
    try {
      const membersData = [];
      for (const email of memberEmails) {
        const employeesRef = collection(db, "employees");
        const q = query(employeesRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          membersData.push({
            id: querySnapshot.docs[0].id,
            ...employeeData
          });
        } else {
          // Nếu không tìm thấy employee, tạo placeholder
          membersData.push({
            id: `placeholder-${email}`,
            name: email.split('@')[0],
            email: email,
            position: "Chưa có thông tin",
            role: "Chưa có thông tin",
            status: "Không xác định",
            img: "https://i.pravatar.cc/150?img=1"
          });
        }
      }
      setMembers(membersData);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thành viên:", error);
    }
  };
  // const deleteAllProjects = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "projects"));

  //     const deletePromises = querySnapshot.docs.map((document) =>
  //       deleteDoc(doc(db, "projects", document.id))
  //     );

  //     await Promise.all(deletePromises);

  //     console.log("🗑️ Đã xóa tất cả dự án thành công.");
  //   } catch (error) {
  //     console.error("❌ Lỗi khi xóa tất cả projects:", error);
  //   }
  // };
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
          await fetchMembersInfo(docSnap.data().members || []);
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/projects")}
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
        <View style={styles.membersHeader}>
          <Text style={styles.membersTitle}>Thành viên ({members.length})</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/employees")}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        
        {members.slice(0, 3).map((member, index) => (
          <View key={member.id} style={styles.memberItem}>
            <View style={styles.memberAvatar}>
              {member.img ? (
                <Image 
                  source={{ uri: member.img }} 
                  style={styles.memberAvatarImage}
                  onError={() => {
                    // Fallback to text if image fails to load
                    member.img = null;
                  }}
                />
              ) : (
                <Text style={styles.memberAvatarText}>
                  {member.name.charAt(0)}
                </Text>
              )}
            </View>
            <View style={styles.memberDetails}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberPosition}>{member.position}</Text>
            </View>
            <View style={[
              styles.statusBadge,
              member.status === "Hoạt động" && styles.statusActive,
              member.status === "Bận" && styles.statusBusy,
              member.status === "Không xác định" && styles.statusUnknown
            ]}>
              <Text style={styles.statusText}>{member.status}</Text>
            </View>
          </View>
        ))}
        
        {members.length > 3 && (
          <Text style={styles.moreMembersText}>
            +{members.length - 3} thành viên khác
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => router.push({
          pathname: "/projects/edit",
          params: { id: id as string }
        })}
      >
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
      {/* <Button
        title="Xóa toàn bộ dự án"
        color="#dc2626"
        onPress={deleteAllProjects}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 40 },
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
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  memberAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  memberEmail: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 2,
  },
  memberPosition: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4f46e5",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    borderColor: "#06b6d4",
    borderWidth: 1,
  },
  statusBusy: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 1,
  },
  statusUnknown: {
    backgroundColor: "#e0e7ff",
    borderColor: "#4f46e5",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  moreMembersText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 10,
    textAlign: "center",
  },
});
