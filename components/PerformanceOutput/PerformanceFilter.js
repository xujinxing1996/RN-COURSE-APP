import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function PerformanceFilter() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>查询日期</Text>
    </View>
  );
}

export default PerformanceFilter;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.gray700,
  },
});
