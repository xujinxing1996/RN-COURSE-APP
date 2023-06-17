import { FlatList } from "react-native";
import RefreshListView from "../../libs/refresh-list/components/RefreshListView";
import PerformanceItem from "./PerformanceItem";

function renderPerformanceItem({ item }) {
  const data = {
    trainType: item.trainType,
    studentName: item.studentName,
    studentMobile: item.studentMobile,
    teacherName: item.teacherName,
    applyProject: item.applyProject,
    major: item.major,
    incomeFlag: item.incomeFlag,
    performance: item.performance,
    createDate: item.createDate,
  };

  return <PerformanceItem {...data} />;
}

function PerformanceList({ performances, refreshState, onFooterRefresh }) {
  return (
    <RefreshListView
      data={performances}
      initialNumToRender={5}
      refreshState={refreshState}
      keyExtractor={(item, index) => index}
      renderItem={renderPerformanceItem}
      onFooterRefresh={onFooterRefresh}
    />
  );
}

export default PerformanceList;
