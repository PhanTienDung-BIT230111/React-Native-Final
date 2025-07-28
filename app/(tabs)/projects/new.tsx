// app/projects/new.tsx
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useNavigation } from "expo-router";
import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function NewProjectScreen() {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [members, setMembers] = useState<string[]>([]);
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
  const [newMember, setNewMember] = useState("");
  const navigation = useNavigation();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthName = (month: number) => {
    const months = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return months[month];
  };

  const handleDateSelect = () => {
    const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);
    setDeadline(selectedDate);
    setShowDatePicker(false);
  };

  const fetchMemberDetails = async (memberEmails: string[]) => {
    try {
      const details = [];
      for (const email of memberEmails) {
        const employeesRef = collection(db, "employees");
        const q = query(employeesRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const employeeData = querySnapshot.docs[0].data();
          details.push({
            id: querySnapshot.docs[0].id,
            ...employeeData
          });
        }
      }
      setMemberDetails(details);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin thành viên:", error);
    }
  };

  const handleAddMember = () => {
    if (newMember.trim()) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    }
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = [...members];
    const updatedDetails = [...memberDetails];
    updatedMembers.splice(index, 1);
    updatedDetails.splice(index, 1);
    setMembers(updatedMembers);
    setMemberDetails(updatedDetails);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên dự án không được để trống.");
      return;
    }

    if (!client.trim()) {
      Alert.alert("Lỗi", "Tên khách hàng không được để trống.");
      return;
    }

    try {
      const newProject = {
        name: name.trim(),
        client: client.trim(),
        description: description.trim(),
        progress: "0",
        status: "Chờ xử lý",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        deadline: deadline ? Timestamp.fromDate(deadline) : null,
        members: members.filter(member => member.trim() !== ""),
      };

      const docRef = await addDoc(collection(db, "projects"), newProject);
      console.log("Đã tạo dự án với ID:", docRef.id);
      Alert.alert("Thành công", "Đã tạo dự án mới!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/projects"),
        },
      ]);
    } catch (err) {
      console.error("Lỗi tạo dự án:", err);
      Alert.alert("Lỗi", "Không thể tạo dự án. Vui lòng thử lại.");
    }
  };

  // Fetch member details when members change
  useLayoutEffect(() => {
    if (members.length > 0) {
      fetchMemberDetails(members);
    } else {
      setMemberDetails([]);
    }
  }, [members]);

  // Read selected members when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const readSelectedMembers = async () => {
        try {
          const selectedMembersData = await AsyncStorage.getItem('selectedProjectMembers');
          if (selectedMembersData) {
            const selectedEmails = JSON.parse(selectedMembersData);
            setMembers(selectedEmails);
            // Clear the stored data after reading
            await AsyncStorage.removeItem('selectedProjectMembers');
          }
        } catch (error) {
          console.error('Lỗi khi đọc thành viên đã chọn:', error);
        }
      };
      
      readSelectedMembers();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Tạo dự án mới"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/projects")}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Tên dự án</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Khách hàng</Text>
      <TextInput style={styles.input} value={client} onChangeText={setClient} />

      <Text style={styles.label}>Hạn chót</Text>
      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={deadline ? styles.dateText : styles.placeholderText}>
          {deadline ? deadline.toLocaleDateString('vi-VN') : "Chọn ngày hạn chót"}
        </Text>
        <FontAwesome name="calendar" size={16} color="#666" />
      </TouchableOpacity>

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.membersSection}>
        <View style={styles.membersHeader}>
          <Text style={styles.membersTitle}>Thành viên dự án</Text>
          <TouchableOpacity 
            style={styles.addMemberButton}
            onPress={() => router.push("/(tabs)/projects/select-members")}
          >
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.addMemberButtonText}>Thêm thành viên</Text>
          </TouchableOpacity>
        </View>

        {memberDetails.map((member, index) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberAvatar}>
              {member.img ? (
                <Image 
                  source={{ uri: member.img }} 
                  style={styles.memberAvatarImage}
                />
              ) : (
                <Text style={styles.memberAvatarText}>
                  {member.name.charAt(0)}
                </Text>
              )}
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberPosition}>{member.position}</Text>
            </View>
            <TouchableOpacity 
              style={styles.removeMemberButton}
              onPress={() => handleRemoveMember(index)}
            >
              <FontAwesome name="times" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        ))}

        {memberDetails.length === 0 && (
          <Text style={styles.noMembersText}>Chưa có thành viên nào</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tạo dự án</Text>
      </TouchableOpacity>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngày hạn chót</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <FontAwesome name="times" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarContainer}>
              {/* Month/Year Selector */}
              <View style={styles.monthYearSelector}>
                <TouchableOpacity 
                  style={styles.arrowButton}
                  onPress={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                >
                  <FontAwesome name="chevron-left" size={16} color="#666" />
                </TouchableOpacity>
                
                <Text style={styles.monthYearText}>
                  {getMonthName(selectedMonth)} {selectedYear}
                </Text>
                
                <TouchableOpacity 
                  style={styles.arrowButton}
                  onPress={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                >
                  <FontAwesome name="chevron-right" size={16} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Day Headers */}
              <View style={styles.dayHeaders}>
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                  <Text key={day} style={styles.dayHeader}>{day}</Text>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                {(() => {
                  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
                  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
                  const days = [];
                  
                  // Add empty cells for days before the first day of the month
                  for (let i = 0; i < firstDayOfMonth; i++) {
                    days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
                  }
                  
                  // Add days of the month
                  for (let day = 1; day <= daysInMonth; day++) {
                    const isSelected = day === selectedDay;
                    const isToday = new Date().toDateString() === new Date(selectedYear, selectedMonth, day).toDateString();
                    
                    days.push(
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.calendarDay,
                          isSelected && styles.selectedDay,
                          isToday && styles.today
                        ]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[
                          styles.dayText,
                          isSelected && styles.selectedDayText,
                          isToday && !isSelected && styles.todayText
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  
                  return days;
                })()}
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleDateSelect}
              >
                <Text style={styles.confirmButtonText}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    marginBottom: 10,
  },
  dateText: {
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#9ca3af",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "80%",
    maxWidth: 400,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  calendarContainer: {
    padding: 15,
  },
  monthYearSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  arrowButton: {
    padding: 5,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  dayHeaders: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  dayHeader: {
    fontSize: 12,
    color: "#6b7280",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  calendarDay: {
    width: "14%", // 7 days in a row
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  dayText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedDay: {
    backgroundColor: "#000",
    borderRadius: 10,
  },
  selectedDayText: {
    color: "#fff",
  },
  today: {
    borderWidth: 1,
    borderColor: "#000",
  },
  todayText: {
    color: "#000",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  cancelButtonText: {
    color: "#dc2626",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#000",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  membersSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },
  addMemberButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  memberAvatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  memberAvatarText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
  },
  memberPosition: {
    fontSize: 12,
    color: "#6b7280",
  },
  removeMemberButton: {
    padding: 5,
  },
  noMembersText: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 10,
  },
});
