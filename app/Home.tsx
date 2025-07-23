import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { ActivityIndicator } from "react-native";

export default function DashboardScreen() {
  const [projectCount, setProjectCount] = useState(0);
  const [contractPending, setContractPending] = useState(0); // tạm mock
  const [employeeCount, setEmployeeCount] = useState(0); // tạm mock
  const [revenue, setRevenue] = useState("2.5B VND"); // tạm mock

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      setProjectCount(snapshot.size);
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
    </ScrollView>
  );
}

function DashboardCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  card: {
    width: "45%",
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 10,
  },
  cardLabel: {
    fontSize: 14,
    color: "#555",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
});
