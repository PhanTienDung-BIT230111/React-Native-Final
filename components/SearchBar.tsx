import React from "react";
import { View, TextInput, FlatList, StyleSheet, Text } from "react-native";
import { useState } from "react";
type Props = {
  placeholder?: string;
  data: Array<any>;
};

const SearchBar = ({ placeholder, data }: Props) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(data);

  const filteredData = filter.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};
export default SearchBar;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
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
