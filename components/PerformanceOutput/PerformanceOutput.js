import { useToast } from "native-base";
import { useContext, useState } from "react";
import { View } from "react-native";
import { fetchNumber } from "../../fetches/configure";
import {
  getPerformances,
  getPersonalPerformances,
} from "../../fetches/modules/performance";
import { RefreshState } from "../../libs/refresh-list/constant";
import { AuthContext } from "../../store/auth-context";
import { commonStyles } from "../../styles/common";
import PerformanceFilter from "./PerformanceFilter";
import PerformanceList from "./PerformanceList";

function PerformanceOutput({ isAll }) {
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState({
    performances: [],
    startDate: "",
    endDate: "",
    refreshState: RefreshState.HeaderRefreshing,
    page: 0,
  });

  const { refreshState } = pageInfo;

  if (
    !(
      refreshState === RefreshState.NoMoreData ||
      refreshState === RefreshState.Idle ||
      refreshState === RefreshState.EmptyData
    )
  ) {
    getList();
  }

  async function getList() {
    let list = [];
    let {
      performances,
      startDate = "",
      endDate = "",
      refreshState,
      page,
    } = pageInfo;
    const teacherId = authCtx.userInfo.account.split("-")[1];
    const action = isAll ? getPerformances : getPersonalPerformances;
    const response = await action(
      {
        limit: 10,
        offset: page,
        trainType: "",
        startDate,
        endDate,
        teacherid: teacherId,
      },
      authCtx.token
    );

    if (response.code === fetchNumber.CODE_200) {
      list = response.data.result.records;
      if (list.length > 0) {
        setPageInfo((pi) => ({
          ...pi,
          performances:
            refreshState === RefreshState.HeaderRefreshing
              ? list
              : performances.concat(list),
          refreshState: RefreshState.Idle,
        }));
      } else {
        setPageInfo((pi) => ({
          ...pi,
          refreshState:
            refreshState === RefreshState.FooterRefreshing
              ? RefreshState.NoMoreData
              : RefreshState.EmptyData,
        }));
      }
    } else {
      setPageInfo({
        performances: [],
        startDate: "",
        endDate: "",
        refreshState: RefreshState.EmptyData,
        page: 0,
      });
      toast.show({
        description: "查询错误",
        placement: "top",
      });
    }
  }

  function handleSearch(startDate, endDate) {
    setPageInfo({
      performances: [],
      startDate,
      endDate,
      refreshState: RefreshState.HeaderRefreshing,
      page: 0,
    });
  }

  function handleFooterRefresh() {
    setPageInfo((pi) => ({
      ...pi,
      refreshState: RefreshState.FooterRefreshing,
      page: pi.page + 1,
    }));
  }

  return (
    <View style={commonStyles.container}>
      <PerformanceFilter onSearch={handleSearch} />
      <PerformanceList
        performances={pageInfo.performances}
        refreshState={pageInfo.refreshState}
        onFooterRefresh={handleFooterRefresh}
      />
    </View>
  );
}

export default PerformanceOutput;
