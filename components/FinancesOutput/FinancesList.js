import { useMemo } from "react";
import RefreshListView from "../../libs/refresh-list/components/RefreshListView";
import FinanceItem from "./FinanceItem";

const maps = {
  education: "学历信息",
  occupation: "职业信息",
  title: "职称信息",
  train: "培训信息",
};

function renderFinanceItem(searchType, { item }) {
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
    trainType: item.trainType,
    studentId: item.id,
    studyId: item.studyId,
    title,
    idNo: item.idNo,
    studentName: item.name,
    teacherName: item.teacherName,
    statusName,
    searchType,
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
  onFooterRefresh,
}) {
  const memoRenderItem = useMemo(
    () => renderFinanceItem.bind(null, searchType),
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
