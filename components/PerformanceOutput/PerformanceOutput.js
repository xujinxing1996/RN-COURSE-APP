import { View } from "react-native";
import { commonStyles } from "../../styles/common";
import PerformanceFilter from "./PerformanceFilter";
import PerformanceList from "./PerformanceList";

const DUMMY_FINANCES = [
  {
    id: "e1",
  },
  {
    id: "e2",
  },
  {
    id: "e3",
  },
  {
    id: "e4",
  },
  {
    id: "e5",
  },
];

function PerformanceOutput() {
  return (
    <View style={commonStyles.container}>
      <PerformanceFilter />
      <PerformanceList performances={DUMMY_FINANCES} />
    </View>
  );
}

export default PerformanceOutput;
