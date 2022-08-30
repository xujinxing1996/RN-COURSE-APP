import { StyleSheet, View, Text } from "react-native";

function CollectionFormHeader({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
}

export default CollectionFormHeader;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    width: 134,
    backgroundColor: "#0066ff",
    alignItems: "center",
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    fontWeight: "bold",
    fontSize: 19,
    color: "#fff",
  },
});
