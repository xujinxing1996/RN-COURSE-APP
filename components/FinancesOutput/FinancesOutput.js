import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useCallback, useContext, useState } from "react";
import { View } from "react-native";
import { getFinanceList } from "../../fetches";
import { fetchNumber } from "../../fetches/configure";
import { RefreshState } from "../../libs/refresh-list/constant";
import { AuthContext } from "../../store/auth-context";
import { commonStyles } from "../../styles/common";
import FinancesList from "./FinancesList";

function FinancesOutput({
  searchType = "",
  teacherMobile = "",
  trainType = "",
}) {
  const authCtx = useContext(AuthContext);
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState({
    finances: [],
    refreshState: RefreshState.HeaderRefreshing,
    page: 0,
  });

  useFocusEffect(
    useCallback(() => {
      getList();
    }, [])
  );

  let { refreshState } = pageInfo;
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
    let { finances, refreshState, page } = pageInfo;

    const response = await getFinanceList(
      page,
      searchType,
      teacherMobile,
      trainType,
      authCtx.token
    );
    if (response.code === fetchNumber.CODE_200) {
      list = response.data.result.records;
      if (list.length > 0) {
        setPageInfo((pi) => ({
          ...pi,
          finances:
            refreshState === RefreshState.HeaderRefreshing
              ? list
              : finances.concat(list),
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
      toast.show({
        description: "查询错误",
        placement: "top",
      });
    }
  }

  // function handleHeaderRefresh() {
  //   setPageInfo({
  //     refreshState: RefreshState.HeaderRefreshing,
  //     page: 1,
  //   });
  // }

  function handleFooterRefresh() {
    setPageInfo((pi) => ({
      ...pi,
      refreshState: RefreshState.FooterRefreshing,
      page: pi.page + 1,
    }));
  }

  return (
    <View style={commonStyles.container}>
      <FinancesList
        refreshState={pageInfo.refreshState}
        finances={pageInfo.finances}
        searchType={searchType}
        // onHeaderRefresh={handleHeaderRefresh}
        onFooterRefresh={handleFooterRefresh}
      />
    </View>
  );
}

export default FinancesOutput;
