import { useContext, useMemo } from "react";
import RefreshListView from "../../libs/refresh-list/components/RefreshListView";
import { AuthContext } from "../../store/auth-context";
import FinanceItem from "./FinanceItem";

const maps = {
  education: "学历提升",
  occupation: "职业技能",
  title: "职称评审",
  train: "执业资格",
};

function renderFinanceItem(searchType, perm, { item }) {
  let title = maps[item.trainType];
  let statusName = "";

  if (item.businessProgress === 0) {
    statusName = "报考";
  } else if (item.businessProgress === 1) {
    statusName = "退款";
  } else if (item.businessProgress === 2) {
    statusName = "分期缴费";
  }

  const data = {
    perm,
    trainType: item.trainType,
    studentId: item.id,
    studyId: item.studyId,
    title,
    idNo: item.idNo,
    studentName: item.name,
    teacherName: item.teacherName,
    takeProjectName: "",
    takeMajorName: "",
    statusName,
    searchType,
    // searchName,
    applyProject: item.applyProject,
    studentMajor: item.studentMajor,
    businessProgress: item.businessProgress,
    commitStr: item.commitStr,
  };
  return <FinanceItem {...data} />;
}

function FinancesList({
  finances,
  refreshState,
  // onHeaderRefresh,
  searchType = "",
  // searchName = "",
  onFooterRefresh,
}) {
  const authCtx = useContext(AuthContext);
  const memoRenderItem = useMemo(
    () =>
      renderFinanceItem.bind(
        null,
        // searchName,
        searchType,
        authCtx.userInfo.perm
      ),
    [finances]
  );

  return (
    <RefreshListView
      data={finances}
      initialNumToRender={5}
      refreshState={refreshState}
      // onHeaderRefresh={onHeaderRefresh}
      onFooterRefresh={onFooterRefresh}
      renderItem={memoRenderItem}
      keyExtractor={(item) => item.feeId}
    />
  );
}

export default FinancesList;
