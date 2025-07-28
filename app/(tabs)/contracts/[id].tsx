import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";

interface Contract {
  id: string;
  companyName: string;
  contractName: string;
  createAt: any;
  currency: string;
  description: string;
  expriryDate: any;
  signedDate: any;
  status: "Đã ký" | "Chờ duyệt" | "Hết hạn" | "Đang thực hiện" | "Hoàn thành";
  term: number;
  updateAt: any;
  value: number;
}

export default function ContractDetail() {
  const { id } = useLocalSearchParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const handleDelete = async () => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá hợp đồng này?", [
      { text: "Huỷ" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "contracts", id as string));
            Alert.alert("🗑️ Đã xoá thành công!");
            router.replace("/contracts");
          } catch (err) {
            const error = err as Error;
            Alert.alert("❌ Lỗi khi xoá hợp đồng", error.message);
          }
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Chi tiết hợp đồng"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!id) return;

    const fetchContract = async () => {
      try {
        const docRef = doc(db, "contracts", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContract({
            id: docSnap.id,
            ...docSnap.data()
          } as Contract);
        } else {
          console.warn("Không tìm thấy hợp đồng!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy hợp đồng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const formatCurrency = (value: number, currency: string) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} tỷ ${currency}`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)} triệu ${currency}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)} nghìn ${currency}`;
    }
    return `${value.toLocaleString()} ${currency}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã ký":
        return "#10b981";
      case "Chờ duyệt":
        return "#f59e0b";
      case "Hết hạn":
        return "#ef4444";
      case "Đang thực hiện":
        return "#3b82f6";
      case "Hoàn thành":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const isExpired = (expiryDate: any) => {
    if (!expiryDate) return false;
    const expiry = expiryDate.toDate ? expiryDate.toDate() : new Date(expiryDate);
    return expiry < new Date();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!contract) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy hợp đồng</Text>
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
        onPress={() => router.push("/(tabs)/contracts")}
        style={styles.backButton}
      >
        <FontAwesome name="arrow-left" size={20} color="#000" />
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{contract.contractName}</Text>

      <View style={styles.badgeContainer}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(contract.status) + "20" }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(contract.status) }
          ]}>
            {contract.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Thông tin cơ bản</Text>
        
        <View style={styles.infoRow}>
          <FontAwesome name="building" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Công ty:</Text>
          <Text style={styles.infoValue}>{contract.companyName}</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="money" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Giá trị:</Text>
          <Text style={styles.infoValue}>
            {formatCurrency(contract.value, contract.currency)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Thời hạn:</Text>
          <Text style={styles.infoValue}>{contract.term} tháng</Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome name="clock-o" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Ngày tạo:</Text>
          <Text style={styles.infoValue}>
            {moment(contract.createAt.toDate()).format("DD/MM/YYYY")}
          </Text>
        </View>

        {contract.signedDate && (
          <View style={styles.infoRow}>
            <FontAwesome name="check-circle" size={16} color="#6b7280" />
            <Text style={styles.infoLabel}>Ngày ký:</Text>
            <Text style={styles.infoValue}>
              {moment(contract.signedDate.toDate()).format("DD/MM/YYYY")}
            </Text>
          </View>
        )}

        {contract.expriryDate && (
          <View style={styles.infoRow}>
            <FontAwesome name="exclamation-triangle" size={16} color="#6b7280" />
            <Text style={styles.infoLabel}>Ngày hết hạn:</Text>
            <Text style={[
              styles.infoValue,
              isExpired(contract.expriryDate) && styles.expiredText
            ]}>
              {moment(contract.expriryDate.toDate()).format("DD/MM/YYYY")}
              {isExpired(contract.expriryDate) && " (Đã hết hạn)"}
            </Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <FontAwesome name="refresh" size={16} color="#6b7280" />
          <Text style={styles.infoLabel}>Cập nhật lần cuối:</Text>
          <Text style={styles.infoValue}>
            {moment(contract.updateAt.toDate()).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>
      </View>

      {contract.description && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>{contract.description}</Text>
        </View>
      )}



      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => router.push({
          pathname: "/contracts/edit",
          params: { id: id as string }
        })}
      >
        <FontAwesome name="pencil" size={16} color="#fff" />
        <Text style={styles.editButtonText}>Chỉnh sửa hợp đồng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <FontAwesome name="trash" size={16} color="#fff" />
        <Text style={styles.deleteButtonText}>Xoá hợp đồng</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "#6b7280",
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
    marginBottom: 10,
    color: "#1f2937",
  },
  badgeContainer: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1f2937",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#1f2937",
    fontWeight: "500",
    flex: 1,
  },
  expiredText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
  },
  editButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
}); 