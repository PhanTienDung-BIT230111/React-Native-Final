import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
};

const DashboardCard = ({ label, value }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

export default DashboardCard;

// function DashboardCard({ label, value }: { label: string; value: string }) {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.cardLabel}>{label}</Text>
//       <Text style={styles.cardValue}>{value}</Text>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    width: "47%",
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
