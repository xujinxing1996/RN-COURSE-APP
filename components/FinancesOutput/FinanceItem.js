import { useNavigation } from "@react-navigation/native";
import { Box, Button } from "native-base";
import { StyleSheet, Text, View } from "react-native";
import {
  EDUCATION_FORM,
  OCCUPATION_FORM,
  TITLE_FORM,
  TRAIN_FORM,
} from "../../constants/collections";
import { pages } from "../../constants/page";
import { GlobalStyles } from "../../constants/styles";

function FinanceItem({
  perm,
  title,
  trainType,
  studentId,
  studyId,
  idNo,
  studentName,
  teacherName,
  statusName,
  searchType,
  // searchName,
  applyProject,
  studentMajor,
  businessProgress,
  commitStr,
}) {
  const navigation = useNavigation();
  let editRoute = "";
  switch (trainType) {
    case EDUCATION_FORM:
      editRoute = pages.EDUCATION_UPDATE;
      break;
    case OCCUPATION_FORM:
      editRoute = pages.OCCUPATION_UPDATE;
      break;
    case TITLE_FORM:
      editRoute = pages.TITLE_UPDATE;
      break;
    case TRAIN_FORM:
      editRoute = pages.TRAIN_UPDATE;
      break;
  }

  const majorText =
    studentMajor.length >= 10
      ? studentMajor.slice(0, 10) + "..."
      : studentMajor;

  return (
    <View style={styles.financeItem}>
      <View>
        <Text style={styles.textTitle}>{title}</Text>
        <Text style={styles.textBase}>学生姓名：{studentName}</Text>
        <Text style={styles.textBase}>证件号：{idNo}</Text>
        <Text style={styles.textBase}>报考项目：{applyProject}</Text>
        <Text style={styles.textBase}>报考专业：{majorText}</Text>
        <Text style={styles.textBase}>招生老师：{teacherName}</Text>
        <Text style={styles.textBase}>业务进度：{statusName}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{commitStr}</Text>
        <Box>
          {commitStr === "待财务审核" && searchType === "caiwu" && (
            <Button
              size="sm"
              colorScheme="blue"
              onPress={() => {
                navigation.navigate(pages.AUDIT_MANAGE, {
                  headerTitle: title + "审核",
                  trainType,
                  idNo,
                  studyId,
                  resolveType: "caiwu",
                  // searchName,
                });
              }}
            >
              审核
            </Button>
          )}
          {commitStr === "待教务审核" && searchType === "jiaowu" && perm !== 2 && (
            <Button
              size="sm"
              colorScheme="blue"
              onPress={() => {
                navigation.navigate(pages.AUDIT_MANAGE, {
                  headerTitle: title + "审核",
                  trainType,
                  idNo,
                  studyId,
                  resolveType: "jiaowu",
                  // searchName,
                });
              }}
            >
              审核
            </Button>
          )}
          {(commitStr === "财务驳回" ||
            commitStr === "教务驳回" ||
            commitStr === "已保存") && (
            <Button
              size="sm"
              colorScheme="blue"
              onPress={() => {
                navigation.navigate(editRoute, {
                  headerTitle: title + "修改",
                  idNo,
                  studyId,
                  // searchName,
                });
              }}
            >
              修改
            </Button>
          )}
          {commitStr === "已提交" && (
            <Button
              size="sm"
              colorScheme="blue"
              onPress={() => {
                navigation.navigate(pages.RECEIPT_UPLOAD, {
                  trainType,
                  studyId,
                  studentId,
                  // searchName,
                });
              }}
            >
              上传凭证
            </Button>
          )}
          <Button
            mt="2"
            size="sm"
            colorScheme="green"
            onPress={() => {
              navigation.navigate(
                searchType === "guanli"
                  ? pages.STUDENT_VIEW
                  : pages.AUDIT_MANAGE,
                {
                  headerTitle: title + "查看",
                  trainType,
                  idNo,
                  studyId,
                  businessProgress,
                  isLook: true,
                  // searchName,
                }
              );
            }}
          >
            查看
          </Button>
        </Box>
      </View>
    </View>
  );
}

export default FinanceItem;

const styles = StyleSheet.create({
  financeItem: {
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
    justifyContent: "space-between",
    minWidth: 80,
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
});
