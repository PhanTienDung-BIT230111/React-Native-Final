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
  const [contractPending, setContractPending] = useState(0); // mock
  const [employeeCount, setEmployeeCount] = useState(0); // mock
  const [revenue, setRevenue] = useState("2.5B VND"); // mock

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
          title="Admin Dashboard"
          avatarUrl="https://i.pravatar.cc/150?img=1"
        />
      ),
    });
  }, [navigation]);

  const fetchDashboardData = async () => {
    const snapshotProject = await getDocs(collection(db, "projects"));
    setProjectCount(snapshotProject.size);

    // const snapshotContract = await getDocs(collection(db, "contracts"));
    // setContractPending(snapshotContract.size);

    const snapshotEmployee = await getDocs(collection(db, "employees"));
    setEmployeeCount(snapshotEmployee.size);

    // có thể thêm các fetch khác như hợp đồng / nhân sự ở đây
  };
  

  // Tự load lại mỗi khi quay lại tab Home
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tổng quan hôm nay</Text>
      <View style={styles.cardContainer}>
        <DashboardCard
          label="Dự án đang chạy"
          value={projectCount.toString()}
        />
        <DashboardCard
          label="Hợp đồng chờ duyệt"
          value={contractPending.toString()}
        />
        <DashboardCard
          label="Nhân sự hiện tại"
          value={employeeCount.toString()}
        />
        <DashboardCard label="Tổng doanh thu" value={revenue} />
      </View>

      {/* Thao tác nhanh */}
      <Text style={styles.title}>Thao tác nhanh</Text>
      <View style={styles.cardContainer}>
        <ActionButton
          iconName="plus"
          color="#fff"
          label="Tạo dự án mới"
          bgColor="#000"
        />
        <ActionButton
          iconName="clipboard"
          color="#000"
          label="Báo cáo tuần"
          bgColor="#ccc"
        />
      </View>

      <Text style={styles.title}>Dự án gần đây</Text>
      {/* Có thể thêm FlatList dự án ở đây sau này */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
});
