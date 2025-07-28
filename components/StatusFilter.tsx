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
      {statuses.map((status) => {
        const isSelected = selected === status;
        
        return (
          <TouchableOpacity
            key={status}
            style={[
              styles.tag,
              { 
                backgroundColor: isSelected ? "#111827" : "#f1f1f1",
              }
            ]}
            onPress={() => onSelect(status)}
          >
            <Text
              style={[
                styles.tagText,
                { 
                  color: isSelected ? "#fff" : "#374151",
                  fontWeight: isSelected ? "bold" : "500"
                }
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        );
      })}
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  tagText: {
    fontSize: 14,
  },
});
