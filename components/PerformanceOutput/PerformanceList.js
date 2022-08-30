import { FlatList } from "react-native";
import PerformanceItem from "./PerformanceItem";

function renderPerformanceItem() {
  return <PerformanceItem />;
}

function PerformanceList({ performances }) {
  return (
    <FlatList
      data={performances}
      keyExtractor={(item) => item.id}
      renderItem={renderPerformanceItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default PerformanceList;
