import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const [pageInfo, setPageInfo] = useState({
    refreshState: RefreshState.EmptyData,
    page: 0,
  });
  const [finances, setFinances] = useState([]);
  useFocusEffect(
    useCallback(() => {
      getList();
      return () => {
        setFinances([]);
      };
    }, [])
  );

  useEffect(() => {
    let { refreshState } = pageInfo;
    if (
      refreshState === RefreshState.NoMoreData ||
      refreshState === RefreshState.Idle ||
      refreshState === RefreshState.EmptyData
    )
      return;
    getList();
  }, [pageInfo]);

  async function getList() {
    let list = [];
    let { refreshState, page } = pageInfo;

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
        setFinances((f) => [...f, ...list]);
        setPageInfo((pi) => ({
          ...pi,
          refreshState: RefreshState.Idle,
        }));
      } else {
        if (refreshState === RefreshState.FooterRefreshing) {
          setPageInfo((pi) => ({
            ...pi,
            refreshState: RefreshState.NoMoreData,
          }));
        }
      }
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
      refreshState: RefreshState.FooterRefreshing,
      page: pi.page + 1,
    }));
  }

  return (
    <View style={commonStyles.container}>
      <FinancesList
        refreshState={pageInfo.refreshState}
        finances={finances}
        searchType={searchType}
        // onHeaderRefresh={handleHeaderRefresh}
        onFooterRefresh={handleFooterRefresh}
      />
    </View>
  );
}

export default FinancesOutput;
