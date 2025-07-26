import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
type Props = {
  placeholder?: string;
  searchProject: string;
  setSearchProject: (text: string) => void;
};

const SearchBar = ({ placeholder, searchProject, setSearchProject }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={searchProject}
        onChangeText={(value) => setSearchProject(value)}
      />
    </View>
  );
};
export default SearchBar;
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
