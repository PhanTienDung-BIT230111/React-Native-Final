// components/StatusFilter.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  statuses?: string[];
  selected: string;
  onSelect: (status: string) => void;
};

export default function StatusFilter({
  statuses = [],
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    flexDirection: "row",
    gap: 10,
    flexWrap: "nowrap",
    paddingHorizontal: 2,
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
