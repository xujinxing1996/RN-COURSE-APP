import { HStack, Text } from "native-base";
import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import HomeHeader from "../components/Home/HomeHeader";
import { pages } from "../constants/page";
import { AuthContext } from "../store/auth-context";

const headerData = [
  {
    title: "信息采集",
    perms: [1, 2, 3, 21, 22, 23, 24],
    pathName: pages.COLLECTION_OVERVIEW,
    iconPath: require("../assets/home/info-collection.png"),
  },
  {
    title: "学生信息查询",
    perms: [1, 2, 3, 21, 22, 23, 24],
    pathName: pages.STUDENT_OVERVIEW,
    iconPath: require("../assets/home/student-search.png"),
  },
  {
    title: "财务审核",
    perms: [1, 3],
    pathName: pages.FINANCES_OVERVIEW,
    iconPath: require("../assets/home/financial-audit.png"),
  },
  {
    title: "教务审核",
    perms: [1, 2, 21, 22, 23, 24],
    pathName: pages.TEACHER_OVERVIEW,
    iconPath: require("../assets/home/education-audit.png"),
  },
  {
    title: "业绩查询",
    perms: [1, 2, 3, 21, 22, 23, 24],
    pathName: pages.ALL_PERFORMANCES,
    iconPath: require("../assets/home/info-collection.png"),
  },
];

function Home() {
  const authCtx = useContext(AuthContext);
  const perm = authCtx.userInfo.perm;
  const headerDataFilterForPerm = headerData.filter((item) =>
    item.perms.includes(perm)
  );

  return (
    <View style={styles.container}>
      <Text>欢迎 {authCtx.userInfo && authCtx.userInfo?.mobile}!</Text>
      <HomeHeader headerData={headerDataFilterForPerm} />
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
});
