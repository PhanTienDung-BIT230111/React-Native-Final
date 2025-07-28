import { db } from "@/firebase/config";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import HeaderWithAvatar from "../../../components/HomeComponent/HeaderWithAvatar";
import ProjectOverview from "../../../components/ProjectComponent/ProjectOverview";
import StatusFilter from "../../../components/StatusFilter";

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

const statuses = [
  "Tất cả",
  "Chờ duyệt",
  "Đã ký",
  "Đang thực hiện",
  "Hoàn thành",
  "Hết hạn",
];

export default function ContractsScreen() {
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch contracts from Firebase
  useEffect(() => {
    const contractsRef = collection(db, "contracts");
    
    const unsubscribe = onSnapshot(contractsRef, (querySnapshot) => {
      const contractsData: Contract[] = [];
      querySnapshot.forEach((doc) => {
        contractsData.push({
          id: doc.id,
          ...doc.data()
        } as Contract);
      });
      
      // Sort by createAt (newest first)
      contractsData.sort((a, b) => {
        const dateA = a.createAt?.toDate?.() || new Date(0);
        const dateB = b.createAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setContracts(contractsData);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi khi lấy dữ liệu hợp đồng:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Tính toán metrics
  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === "Đã ký").length;
  const pendingContracts = contracts.filter(c => c.status === "Chờ duyệt").length;
  const expiredContracts = contracts.filter(c => c.status === "Hết hạn").length;
  const inProgressContracts = contracts.filter(c => c.status === "Đang thực hiện").length;
  const completedContracts = contracts.filter(c => c.status === "Hoàn thành").length;

  // Lọc hợp đồng theo filter
  const filteredContracts = selectedStatus === "Tất cả" 
    ? contracts 
    : contracts.filter(c => c.status === selectedStatus);

  const handleContractPress = (contract: Contract) => {
    router.push({
      pathname: "/contracts/[id]",
      params: { id: contract.id }
    });
  };

  const handleMoreOptions = (contract: Contract) => {
    Alert.alert(
      "Tùy chọn",
      `Hợp đồng: ${contract.contractName}`,
      [
        { text: "Xem chi tiết", onPress: () => console.log("Xem chi tiết") },
        { text: "Chỉnh sửa", onPress: () => console.log("Chỉnh sửa") },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: () => handleDeleteContract(contract) 
        },
        { text: "Hủy", style: "cancel" },
      ]
    );
  };

  const handleDeleteContract = async (contract: Contract) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa hợp đồng "${contract.contractName}"?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "contracts", contract.id));
              Alert.alert("Thành công", "Đã xóa hợp đồng!");
            } catch (error) {
              console.error("Lỗi khi xóa hợp đồng:", error);
              Alert.alert("Lỗi", "Không thể xóa hợp đồng. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };

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

  const renderContractCard = ({ item }: { item: Contract }) => (
    <TouchableOpacity
      style={styles.contractCard}
      onPress={() => handleContractPress(item)}
    >
      <View style={styles.contractHeader}>
        <View style={styles.contractTitleContainer}>
          <Text style={styles.contractTitle}>{item.contractName}</Text>
          <View style={[
            styles.statusTag,
            { backgroundColor: getStatusColor(item.status) + "20" }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {item.status}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleMoreOptions(item)}
        >
          <FontAwesome name="ellipsis-v" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.contractDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Công ty:</Text>
          <Text style={styles.detailValue}>{item.companyName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Giá trị:</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(item.value, item.currency)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Thời hạn:</Text>
          <Text style={styles.detailValue}>{item.term} tháng</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            {item.signedDate ? "Ngày ký:" : "Ngày tạo:"}
          </Text>
          <Text style={styles.detailValue}>
            {item.signedDate 
              ? moment(item.signedDate.toDate()).format("DD/MM/YYYY")
              : moment(item.createAt.toDate()).format("DD/MM/YYYY")
            }
          </Text>
        </View>
        {item.expriryDate && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày hết hạn:</Text>
            <Text style={[
              styles.detailValue,
              isExpired(item.expriryDate) && styles.expiredText
            ]}>
              {moment(item.expriryDate.toDate()).format("DD/MM/YYYY")}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Hợp đồng"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={filteredContracts}
      keyExtractor={(item) => item.id}
      renderItem={renderContractCard}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <FontAwesome name="file-text-o" size={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Không có hợp đồng nào</Text>
          <Text style={styles.emptySubtext}>
            {selectedStatus === "Tất cả" 
              ? "Hãy tạo hợp đồng đầu tiên" 
              : `Không có hợp đồng nào ở trạng thái "${selectedStatus}"`
            }
          </Text>
        </View>
      }
      ListHeaderComponent={
        <>
          <View style={styles.cardContainer}>
            <ProjectOverview
              iconName="file-text-o"
              color="#000"
              label="Tổng hợp đồng"
              total={totalContracts.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="check-circle"
              color="#000"
              label="Đã ký"
              total={signedContracts.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="clock-o"
              color="#000"
              label="Chờ duyệt"
              total={pendingContracts.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="play-circle"
              color="#000"
              label="Đang thực hiện"
              total={inProgressContracts.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="flag-checkered"
              color="#000"
              label="Hoàn thành"
              total={completedContracts.toString()}
              bgColor="#fff"
            />
            <ProjectOverview
              iconName="exclamation-triangle"
              color="#000"
              label="Hết hạn"
              total={expiredContracts.toString()}
              bgColor="#fff"
            />
          </View>

          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push("/contracts/new")}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="plus" size={20} color="#fff" />
                <Text style={styles.buttonText}>Tạo hợp đồng mới</Text>
              </View>
            </TouchableOpacity>

            <StatusFilter
              statuses={statuses}
              selected={selectedStatus}
              onSelect={setSelectedStatus}
            />
          </View>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f4f6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
    gap: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
  contractCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  contractHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  contractTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contractTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreButton: {
    padding: 4,
  },
  contractDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  expiredText: {
    color: "#ef4444",
    fontWeight: "600",
  },
});
