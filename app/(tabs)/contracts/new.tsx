import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import moment from "moment";
import React, { useLayoutEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

export default function NewContractScreen() {
  const [contractName, setContractName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("VNĐ");
  const [term, setTerm] = useState("");
  const [status, setStatus] = useState("Chờ duyệt");
  const [signedDate, setSignedDate] = useState<Date | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateType, setDateType] = useState<"signed" | "expiry">("signed");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation();

  const currencies = ["VNĐ", "USD", "EUR"];
  const statuses = ["Chờ duyệt", "Đã ký", "Đang thực hiện", "Hoàn thành", "Hết hạn"];

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
    if (dateType === "signed") {
      setSignedDate(selectedDate);
    } else {
      setExpiryDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const openDatePicker = (type: "signed" | "expiry") => {
    setDateType(type);
    if (type === "signed" && signedDate) {
      setSelectedYear(signedDate.getFullYear());
      setSelectedMonth(signedDate.getMonth());
      setSelectedDay(signedDate.getDate());
    } else if (type === "expiry" && expiryDate) {
      setSelectedYear(expiryDate.getFullYear());
      setSelectedMonth(expiryDate.getMonth());
      setSelectedDay(expiryDate.getDate());
    }
    setShowDatePicker(true);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Thêm hợp đồng"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  const handleSubmit = async () => {
    if (!contractName.trim()) {
      Alert.alert("Lỗi", "Tên hợp đồng không được để trống.");
      return;
    }

    if (!companyName.trim()) {
      Alert.alert("Lỗi", "Tên công ty không được để trống.");
      return;
    }

    if (!value.trim()) {
      Alert.alert("Lỗi", "Giá trị hợp đồng không được để trống.");
      return;
    }

    const valueNum = parseFloat(value.replace(/[^\d.]/g, ''));
    if (isNaN(valueNum) || valueNum <= 0) {
      Alert.alert("Lỗi", "Giá trị hợp đồng phải là số dương.");
      return;
    }

    if (!term.trim()) {
      Alert.alert("Lỗi", "Thời hạn hợp đồng không được để trống.");
      return;
    }

    const termNum = parseInt(term);
    if (isNaN(termNum) || termNum <= 0) {
      Alert.alert("Lỗi", "Thời hạn phải là số tháng dương.");
      return;
    }

    setSaving(true);
    try {
      const newContract = {
        contractName: contractName.trim(),
        companyName: companyName.trim(),
        description: description.trim(),
        value: valueNum,
        currency,
        term: termNum,
        status,
        signedDate: signedDate ? Timestamp.fromDate(signedDate) : null,
        expriryDate: expiryDate ? Timestamp.fromDate(expiryDate) : null,
        createAt: Timestamp.now(),
        updateAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "contracts"), newContract);
      console.log("Đã tạo hợp đồng với ID:", docRef.id);
      Alert.alert("Thành công", "Đã thêm hợp đồng mới!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/contracts"),
        },
      ]);
    } catch (err) {
      console.error("Lỗi tạo hợp đồng:", err);
      Alert.alert("Lỗi", "Không thể tạo hợp đồng. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

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

      <Text style={styles.title}>Thông tin hợp đồng</Text>

      <Text style={styles.label}>Tên hợp đồng *</Text>
      <TextInput
        style={styles.input}
        value={contractName}
        onChangeText={setContractName}
        placeholder="Nhập tên hợp đồng"
      />

      <Text style={styles.label}>Công ty *</Text>
      <TextInput
        style={styles.input}
        value={companyName}
        onChangeText={setCompanyName}
        placeholder="Nhập tên công ty"
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả hợp đồng"
        multiline
        numberOfLines={4}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Giá trị *</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Nhập giá trị"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Đơn vị tiền tệ</Text>
          <View style={styles.pickerContainer}>
            {currencies.map((curr) => (
              <TouchableOpacity
                key={curr}
                style={[
                  styles.pickerOption,
                  currency === curr && styles.pickerOptionSelected,
                ]}
                onPress={() => setCurrency(curr)}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    currency === curr && styles.pickerOptionTextSelected,
                  ]}
                >
                  {curr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Text style={styles.label}>Thời hạn (tháng) *</Text>
          <TextInput
            style={styles.input}
            value={term}
            onChangeText={setTerm}
            placeholder="Nhập số tháng"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfWidth}>
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
        </View>
      </View>

      <Text style={styles.label}>Ngày ký</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => openDatePicker("signed")}
      >
        <FontAwesome name="calendar" size={16} color="#666" />
        <Text style={styles.dateButtonText}>
          {signedDate ? moment(signedDate).format("DD/MM/YYYY") : "Chọn ngày ký"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Ngày hết hạn</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => openDatePicker("expiry")}
      >
        <FontAwesome name="calendar" size={16} color="#666" />
        <Text style={styles.dateButtonText}>
          {expiryDate ? moment(expiryDate).format("DD/MM/YYYY") : "Chọn ngày hết hạn"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, saving && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={saving}
      >
        <FontAwesome name="plus" size={16} color="#fff" />
        <Text style={styles.buttonText}>
          {saving ? "Đang tạo..." : "Tạo hợp đồng"}
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
            <Text style={styles.modalTitle}>
              {dateType === "signed" ? "Chọn ngày ký" : "Chọn ngày hết hạn"}
            </Text>
            
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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