import { Project } from "@/app/projects";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: Project;
  onPress?: () => void;
};

import { TouchableOpacity } from "react-native";

export default function ProjectCard({ item, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>
            {item.name.split(" ").slice(0, 4).join(" ") +
              (item.name.split(" ").length > 4 ? "..." : "")}
          </Text>
          <Text style={styles.client}>
            {item.client
              ? item.client.split(" ").slice(0, 4).join(" ") +
                (item.client.split(" ").length > 4 ? "..." : "")
              : ""}
          </Text>
        </View>
        <View style={styles.statusTag}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.row}>
        <FontAwesome name="calendar" size={16} color="#6b7280" />
        <Text style={styles.metaText}>
          {"  "}
          {item.deadline?.toLocaleDateString("vi-VN")}
        </Text>
        <FontAwesome
          name="users"
          size={16}
          color="#6b7280"
          style={{ marginLeft: 15 }}
        />
        <Text style={styles.metaText}>
          {"  "}
          {item.members?.length || 0} thành viên
        </Text>
      </View>

      {/* Progress */}
      <Text style={styles.progressLabel}>Tiến độ</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${item.progress || 0}%` as unknown as number },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{item.progress}%</Text>

      {/* Avatars */}
      <View style={styles.avatars}>
        {/* <Image
          source={{ uri: "https://i.pravatar.cc/100?img=1" }}
          style={styles.avatar}
        />
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=2" }}
          style={styles.avatar}
        />
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=3" }}
          style={styles.avatar}
        /> */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  client: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  statusTag: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#374151",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  metaText: {
    fontSize: 14,
    color: "#6b7280",
  },
  progressLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 5,
  },
  progressFill: {
    height: 8,
    backgroundColor: "#374151",
    borderRadius: 4,
  },
  progressText: {
    textAlign: "right",
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginTop: 2,
  },
  avatars: {
    flexDirection: "row",
    marginTop: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: -6,
    borderWidth: 1,
    borderColor: "#fff",
  },
});
