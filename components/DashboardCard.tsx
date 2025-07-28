import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  icon?: string;
  color?: string;
};

const DashboardCard = ({ label, value, icon, color }: Props) => {
  return (
    <View style={styles.card}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <FontAwesome name={icon as any} size={16} color={color} />
        </View>
      )}
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={[styles.cardValue, { color: color }]}>{value}</Text>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    width: "47%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
});
