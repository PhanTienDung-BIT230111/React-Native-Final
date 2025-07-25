// components/StatusFilter.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const statuses = ["Tất cả", "Đang thực hiện", "Hoàn thành", "Tạm dừng"];

type Props = {
  selected: string;
  onSelect: (status: string) => void;
};

export default function StatusFilter({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {statuses.map((status) => (
        <TouchableOpacity
          key={status}
          style={[styles.tag, selected === status && styles.activeTag]}
          onPress={() => onSelect(status)}
        >
          <Text
            style={[styles.tagText, selected === status && styles.activeText]}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
  },
  activeTag: {
    backgroundColor: "#111827",
  },
  tagText: {
    color: "#374151",
    fontSize: 14,
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
