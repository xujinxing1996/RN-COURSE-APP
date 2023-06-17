import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function PerformanceItem({
  trainType,
  studentName,
  studentMobile,
  teacherName,
  applyProject,
  major,
  incomeFlag,
  performance,
  createDate,
}) {
  let trainTypeTitle = "学历提升";
  switch (trainType) {
    case "职业":
      trainTypeTitle = "职业技能";
      break;
    case "职称":
      trainTypeTitle = "职称评审";
      break;
    case "培训":
      trainTypeTitle = "执业资格";
      break;
  }

  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.textTitle}>{trainTypeTitle}</Text>
        <Text style={styles.textBase}>学生姓名：{studentName}</Text>
        <Text style={styles.textBase}>手机号：{studentMobile}</Text>
        <Text style={styles.textBase}>报考项目：{applyProject}</Text>
        <Text style={styles.textBase}>报考专业：{major}</Text>
        <Text style={styles.textBase}>招生老师：{teacherName}</Text>
        <Text style={styles.textBase}>收入/退款：{incomeFlag}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View>
          <Text style={styles.textTitle}>业绩</Text>
          <Text style={styles.status}>{performance}</Text>
        </View>
        <Text style={styles.textBase}>日期：{createDate}</Text>
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
