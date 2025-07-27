// app/employees/index.tsx
import HeaderWithAvatar from "@/components/HomeComponent/HeaderWithAvatar";
import SearchBar from "@/components/SearchBar";
import StatusFilter from "@/components/StatusFilter";
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const role = ["Tất cả", "Quản lý", "Nhân viên", "Thực tập"];

export default function EmployeeScreen() {
  const [selectedRole, setSelectedRole] = useState("Tất cả");

  const [employees, setEmployees] = useState<any[]>([]); //! sau phải sửa theo định nghĩa của employees
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Nhân sự"
          avatarUrl="https://i.pravatar.cc/150?img=3"
        />
      ),
    });
  }, [navigation]);
  useEffect(() => {
    // seedProjects(); // seed projects data if needed
    const fetchEmployees = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployees(docs);
    };
    fetchEmployees();
  }, []);

  const filteredBySearch = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredByRole = employees.filter((e) => {
    if (selectedRole === "Tất cả") return true;

    return e.role === selectedRole;
  });

  const finalData = search ? filteredBySearch : filteredByRole;

  return (
    <FlatList
      data={finalData}
      ListEmptyComponent={<Text style={{ padding: 20 }}>Không có nhân sự</Text>}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.card}
          onPress={() => router.push(`/(tabs)/employees/${item.id}`)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{ uri: `${item.img}` }}
              style={{ width: 50, height: 50, borderRadius: 30 }}
            />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          </View>
          <Text style={styles.statusTag}>{item.status || "Hoạt động"}</Text>
        </TouchableOpacity>
      )}
      ListHeaderComponent={
        <>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/(tabs)/employees/new")}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <FontAwesome name="plus" size={20} color="#fff" />
                <Text style={styles.buttonText}>Thêm nhân sự</Text>
              </View>
            </TouchableOpacity>
            <SearchBar
              placeholder="Tìm kiếm nhân sự"
              searchProject={search}
              setSearchProject={setSearch}
            />

            <StatusFilter
              statuses={role}
              selected={selectedRole}
              onSelect={setSelectedRole}
            />
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
  tagActive: {
    backgroundColor: "#000",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#6b7280",
  },
  email: {
    fontSize: 12,
    color: "#9ca3af",
  },
  statusTag: {
    backgroundColor: "#d1fae5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: "#065f46",
    fontWeight: "500",
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

{
  /* <View style={styles.avatars}>
  <Image
    source={{ uri: "https://i.pravatar.cc/100?img=1" }}
    style={styles.avatar}
  />
  <Image
    source={{ uri: "https://i.pravatar.cc/100?img=2" }}
    style={styles.avatar}
  />
  <Image
    source={{ uri: "https://i.pravatar.cc/100?img=3" }}
    style={styles.avatar}
  />
</View>; */
}
