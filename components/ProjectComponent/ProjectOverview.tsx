import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import { StyleSheet, View, Text } from "react-native";

type Props = {
  iconName: keyof typeof FontAwesome.glyphMap;
  color: string;
  label: string;
  total: string;
  bgColor: string;
};

const ProjectOverview = ({ iconName, color, label, total, bgColor }: Props) => {
  return (
    <View style={[styles.cardContainer, { backgroundColor: bgColor }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <FontAwesome
          style={{ marginTop: 10 }}
          name={iconName}
          size={24}
          color={color}
        />
        <Text style={[styles.label, { color }]}>{label}</Text>
      </View>

      <Text style={[styles.total, { color }]}>{total}</Text>
    </View>
  );
};

export default ProjectOverview;
const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    width: "47%",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
    marginTop: 5,
  },
});
