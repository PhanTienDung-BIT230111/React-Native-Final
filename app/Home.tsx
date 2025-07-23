import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { ActivityIndicator } from "react-native";
import DashboardCard from "../components/HomeComponent/DashboardCard";
import ActionButton from "@/components/HomeComponent/ActionButton";
import HeaderWithAvatar from "../components/HomeComponent/HeaderWithAvatar";
export default function DashboardScreen() {
  const [projectCount, setProjectCount] = useState(0);
  const [contractPending, setContractPending] = useState(0); // tạm mock
  const [employeeCount, setEmployeeCount] = useState(0); // tạm mock
  const [revenue, setRevenue] = useState("2.5B VND"); // tạm mock

  const navigation = useNavigation<any>();

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
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      setProjectCount(snapshot.size);
      snapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
      });
    };

    fetchData();
  }, []);

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

      {/*Quick Action button  */}
      <Text style={styles.title}>Thao tác nhanh</Text>
      <View style={styles.cardContainer}>
        <ActionButton
          iconName="plus"
          color="#fff"
          label="Tạo dự án mới"
          bgColor="#000"
        ></ActionButton>

        <ActionButton
          iconName="clipboard"
          color="#000"
          label="Báo cáo tuần"
          bgColor="#ccc"
        ></ActionButton>
      </View>
      <Text style={styles.title}>Dự án gần đây</Text>
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
  createPjBtn: {
    color: "#fff",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "47%",
    height: 80,
  },
});
