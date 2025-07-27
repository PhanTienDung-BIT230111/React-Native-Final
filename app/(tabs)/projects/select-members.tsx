// app/(tabs)/projects/select-members.tsx
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useLayoutEffect, useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function SelectMembersScreen() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Thêm thành viên"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  const fetchEmployees = async () => {
    try {
      const employeesRef = collection(db, "employees");
      const querySnapshot = await getDocs(employeesRef);
      const employeesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(employeesData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchEmployees();
  }, []);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleDone = async () => {
    // Lấy danh sách email của thành viên đã chọn
    const selectedEmails = employees
      .filter(emp => selectedMembers.includes(emp.id))
      .map(emp => emp.email);
    
    // Lưu vào AsyncStorage
    try {
      await AsyncStorage.setItem('selectedProjectMembers', JSON.stringify(selectedEmails));
    } catch (error) {
      console.error('Lỗi khi lưu thành viên đã chọn:', error);
    }
    
    // Quay lại trang trước
    router.back();
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedEmployees: Record<string, any[]> = filteredEmployees.reduce((groups, employee) => {
    const department = employee.role || "Khác";
    if (!groups[department]) {
      groups[department] = [];
    }
    groups[department].push(employee);
    return groups;
  }, {} as Record<string, any[]>);

  const renderEmployee = ({ item }: { item: any }) => {
    const isSelected = selectedMembers.includes(item.id);
    
    return (
      <View style={styles.employeeItem}>
        <View style={styles.employeeAvatar}>
          {item.img ? (
            <Image 
              source={{ uri: item.img }} 
              style={styles.employeeAvatarImage}
            />
          ) : (
            <Text style={styles.employeeAvatarText}>
              {item.name.charAt(0)}
            </Text>
          )}
        </View>
        <View style={styles.employeeInfo}>
          <Text style={styles.employeeName}>{item.name}</Text>
          <Text style={styles.employeePosition}>{item.position}</Text>
          <Text style={styles.employeeEmail}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          onPress={() => toggleMemberSelection(item.id)}
        >
          {isSelected && (
            <FontAwesome name="check" size={12} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderDepartment = ({ item }: { item: { title: string; data: any[] } }) => (
    <View style={styles.departmentSection}>
      <Text style={styles.departmentTitle}>{item.title.toUpperCase()}</Text>
      {item.data.map(employee => (
        <View key={employee.id}>
          {renderEmployee({ item: employee })}
        </View>
      ))}
    </View>
  );

  const sections: { title: string; data: any[] }[] = Object.entries(groupedEmployees).map(([department, employees]) => ({
    title: department,
    data: employees
  }));

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm thành viên..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Selected Members Summary */}
      <View style={styles.selectedSummary}>
        <FontAwesome name="users" size={16} color="#666" />
        <Text style={styles.selectedText}>
          Đã chọn: {selectedMembers.length} thành viên
        </Text>
      </View>

      {/* Employees List */}
      <FlatList
        data={sections}
        renderItem={renderDepartment}
        keyExtractor={(item) => item.title}
        style={styles.list}
      />

      {/* Done Button */}
      <TouchableOpacity 
        style={[styles.doneButton, selectedMembers.length === 0 && styles.doneButtonDisabled]}
        onPress={handleDone}
        disabled={selectedMembers.length === 0}
      >
        <Text style={styles.doneButtonText}>Xong</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    margin: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  selectedSummary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9fafb",
  },
  selectedText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  list: {
    flex: 1,
  },
  departmentSection: {
    marginBottom: 20,
  },
  departmentTitle: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f9fafb",
  },
  employeeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  employeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  employeeAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  employeeAvatarText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  employeePosition: {
    fontSize: 14,
    color: "#374151",
    marginTop: 2,
  },
  employeeEmail: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  doneButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 