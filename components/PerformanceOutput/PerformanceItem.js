import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function PerformanceItem() {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.textTitle}>学历信息审核</Text>
        <Text style={styles.textBase}>学生姓名：张三</Text>
        <Text style={styles.textBase}>手机号：13820131862</Text>
        <Text style={styles.textBase}>招生老师：李四</Text>
        <Text style={styles.textBase}>收入/退款：收入</Text>
      </View>
      <View style={styles.statusContainer}>
        <View>
          <Text style={styles.textTitle}>业绩</Text>
          <Text style={styles.status}>1500</Text>
        </View>
        <Text style={styles.textBase}>日期：2022-07-21</Text>
      </View>
    </View>
  );
}

export default PerformanceItem;

const styles = StyleSheet.create({
  item: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: GlobalStyles.colors.accent200,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 6,
    elevation: 3,
    shadowColor: GlobalStyles.colors.gray500,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
  },
  textTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: GlobalStyles.colors.black500,
    marginBottom: 8,
  },
  textBase: {
    marginVertical: 4,
    color: GlobalStyles.colors.gray700,
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
});
