import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
type Props = {
  iconName: keyof typeof FontAwesome.glyphMap;
  color: string;
  label: string;
  onPress?: () => void;
  bgColor: string;
};

const ActionButton = ({ iconName, color, label, onPress, bgColor }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.actionContainer, { backgroundColor: bgColor }]}
    >
      <FontAwesome
        style={[styles.iconAction, { color: color }]}
        name={iconName}
        size={14}
        color={color}
      />
      <Text style={[styles.labelAction, { color: color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "column",
    padding: 20,
    width: "47%",
    borderRadius: 10,
  },
  iconAction: {},
  labelAction: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
