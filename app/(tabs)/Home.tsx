import DashboardCard from "@/components/DashboardCard";
import ActionButton from "@/components/HomeComponent/ActionButton";
import HeaderWithAvatar from "@/components/HomeComponent/HeaderWithAvatar";
import { auth, db } from "@/firebase/config";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";



export default function DashboardScreen() {
  const [projectCount, setProjectCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth/login");
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <HeaderWithAvatar
          title="Dashboard"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch counts
      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const contractsSnapshot = await getDocs(collection(db, "contracts"));
      const employeesSnapshot = await getDocs(collection(db, "employees"));
      
      setProjectCount(projectsSnapshot.size);
      setContractCount(contractsSnapshot.size);
      setEmployeeCount(employeesSnapshot.size);
      

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = fetchDashboardData();
      return () => {
        if (unsubscribe) unsubscribe;
      };
    }, [])
  );

  const calculateRevenue = () => {
    // Mock calculation based on contract count
    return `${(contractCount * 500).toLocaleString()} VND`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Chào mừng trở lại!</Text>
        <Text style={styles.welcomeSubtitle}>Đây là tổng quan hoạt động hôm nay</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <DashboardCard
          label="Dự án"
          value={projectCount.toString()}
          icon="folder"
          color="#3B82F6"
        />
        <DashboardCard
          label="Hợp đồng"
          value={contractCount.toString()}
          icon="file-text"
          color="#10B981"
        />
        <DashboardCard
          label="Nhân sự"
          value={employeeCount.toString()}
          icon="users"
          color="#F59E0B"
        />
        <DashboardCard
          label="Doanh thu"
          value={calculateRevenue()}
          icon="money"
          color="#8B5CF6"
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
        <View style={styles.actionButtons}>
          <ActionButton
            iconName="plus"
            color="#fff"
            label="Tạo dự án"
            bgColor="#3B82F6"
            onPress={() => router.push("/projects/new")}
          />
          <ActionButton
            iconName="file-text"
            color="#fff"
            label="Tạo hợp đồng"
            bgColor="#10B981"
            onPress={() => router.push("/contracts/new")}
          />
          <ActionButton
            iconName="user-plus"
            color="#fff"
            label="Thêm nhân sự"
            bgColor="#F59E0B"
            onPress={() => router.push("/employees/new")}
          />
          <ActionButton
            iconName="bar-chart"
            color="#fff"
            label="Báo cáo"
            bgColor="#8B5CF6"
            onPress={() => router.push("/report")}
          />
        </View>
      </View>

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  welcomeSection: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  statsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
