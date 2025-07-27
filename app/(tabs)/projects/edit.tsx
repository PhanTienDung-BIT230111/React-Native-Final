// app/projects/edit.tsx
import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { collection, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
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

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("0");
  const [status, setStatus] = useState("Đang thực hiện");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [members, setMembers] = useState<string[]>([]);
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
  const [newMember, setNewMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();

  const statuses = ["Đang thực hiện", "Đã hoàn thành", "Tạm dừng", "Chờ xử lý"];

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

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Chỉnh sửa dự án "
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
          const data = docSnap.data();
          setName(data.name || "");
          setClient(data.client || "");
          setDescription(data.description || "");
          setProgress(String(data.progress || 0));
          setStatus(data.status || "Đang thực hiện");
          setMembers(data.members || []);
          
          if (data.deadline?.toDate) {
            const deadlineDate = data.deadline.toDate();
            setDeadline(deadlineDate);
            setSelectedYear(deadlineDate.getFullYear());
            setSelectedMonth(deadlineDate.getMonth());
            setSelectedDay(deadlineDate.getDate());
          }

          await fetchMemberDetails(data.members || []);
        } else {
          Alert.alert("Lỗi", "Không tìm thấy dự án!");
          router.back();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dự án:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin dự án.");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Tên dự án không được để trống.");
      return;
    }

    if (!client.trim()) {
      Alert.alert("Lỗi", "Tên khách hàng không được để trống.");
      return;
    }

    const progressNum = parseInt(progress);
    if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
      Alert.alert("Lỗi", "Tiến độ phải là số từ 0 đến 100.");
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: name.trim(),
        client: client.trim(),
        description: description.trim(),
        progress: progressNum,
        status,
        members,
        deadline: deadline ? Timestamp.fromDate(deadline) : null,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, "projects", id as string), updateData);
      console.log("Đã cập nhật dự án thành công");
      Alert.alert("Thành công", "Đã cập nhật thông tin dự án!", [
        {
          text: "OK",
          onPress: () => router.replace(`/(tabs)/projects/${id}`),
        },
      ]);
    } catch (err) {
      console.error("Lỗi cập nhật dự án:", err);
      Alert.alert("Lỗi", "Không thể cập nhật dự án. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={true}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Chỉnh sửa dự án</Text>

      <Text style={styles.label}>Tên dự án *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên dự án"
      />

      <Text style={styles.label}>Khách hàng *</Text>
      <TextInput
        style={styles.input}
        value={client}
        onChangeText={setClient}
        placeholder="Nhập tên khách hàng"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả dự án"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Tiến độ (%)</Text>
      <TextInput
        style={styles.input}
        value={progress}
        onChangeText={setProgress}
        placeholder="Nhập tiến độ (0-100)"
        keyboardType="numeric"
      />

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

      <Text style={styles.label}>Deadline</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <FontAwesome name="calendar" size={16} color="#666" />
        <Text style={styles.dateButtonText}>
          {deadline ? moment(deadline).format("DD/MM/YYYY") : "Chọn ngày"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Thành viên dự án</Text>
      <View style={styles.memberInputContainer}>
        <TextInput
          style={styles.memberInput}
          value={newMember}
          onChangeText={setNewMember}
          placeholder="Nhập email thành viên"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddMember}>
          <FontAwesome name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {members.length > 0 && (
        <View style={styles.membersList}>
          <Text style={styles.membersTitle}>Danh sách thành viên:</Text>
          {memberDetails.map((member, index) => (
            <View key={index} style={styles.memberItem}>
              <View style={styles.memberInfo}>
                {member.img ? (
                  <Image source={{ uri: member.img }} style={styles.memberAvatar} />
                ) : (
                  <View style={styles.memberAvatarPlaceholder}>
                    <Text style={styles.memberAvatarText}>
                      {member.name ? member.name.charAt(0) : "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{member.name || members[index]}</Text>
                  <Text style={styles.memberEmail}>{members[index]}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(index)}
              >
                <FontAwesome name="times" size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={saving}
      >
        <FontAwesome name="save" size={16} color="#fff" />
        <Text style={styles.buttonText}>
          {saving ? "Đang lưu..." : "Lưu thay đổi"}
        </Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn deadline</Text>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Ngày</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.datePickerOption,
                        selectedDay === day && styles.datePickerOptionSelected,
                      ]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        selectedDay === day && styles.datePickerOptionTextSelected,
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Tháng</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {Array.from({ length: 12 }, (_, i) => i).map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.datePickerOption,
                        selectedMonth === month && styles.datePickerOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedMonth(month);
                        const maxDays = getDaysInMonth(selectedYear, month);
                        if (selectedDay > maxDays) {
                          setSelectedDay(maxDays);
                        }
                      }}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        selectedMonth === month && styles.datePickerOptionTextSelected,
                      ]}>
                        {getMonthName(month)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Năm</Text>
                <ScrollView style={styles.datePickerScroll}>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.datePickerOption,
                        selectedYear === year && styles.datePickerOptionSelected,
                      ]}
                      onPress={() => {
                        setSelectedYear(year);
                        const maxDays = getDaysInMonth(year, selectedMonth);
                        if (selectedDay > maxDays) {
                          setSelectedDay(maxDays);
                        }
                      }}
                    >
                      <Text style={[
                        styles.datePickerOptionText,
                        selectedYear === year && styles.datePickerOptionTextSelected,
                      ]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleDateSelect}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
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
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  memberInputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  memberInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#000",
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  membersList: {
    marginBottom: 16,
  },
  membersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  memberAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberAvatarText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  memberEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
  removeButton: {
    padding: 4,
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
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datePickerColumn: {
    flex: 1,
    alignItems: "center",
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#374151",
  },
  datePickerScroll: {
    maxHeight: 200,
  },
  datePickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
    minWidth: 60,
    alignItems: "center",
  },
  datePickerOptionSelected: {
    backgroundColor: "#000",
  },
  datePickerOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  datePickerOptionTextSelected: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginHorizontal: 4,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  modalButtonTextPrimary: {
    color: "#fff",
  },
}); 