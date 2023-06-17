import { useFocusEffect } from "@react-navigation/native";
import { useToast } from "native-base";
import { useCallback, useContext, useState, useRef } from "react";
import { View } from "react-native";
import { getFinanceList } from "../../fetches";
import { fetchNumber } from "../../fetches/configure";
import { RefreshState } from "../../libs/refresh-list/constant";
import { AuthContext } from "../../store/auth-context";
import { commonStyles } from "../../styles/common";
import FinanceSearch from "./FinanceSearch";
import FinancesList from "./FinancesList";

function FinancesOutput({ searchType = "", trainType = "" }) {
  const authCtx = useContext(AuthContext);
  let searchName = useRef("");
  const toast = useToast();
  const [pageInfo, setPageInfo] = useState({
    finances: [],
    refreshState: RefreshState.HeaderRefreshing,
    page: 0,
  });

  useFocusEffect(
    useCallback(() => {
      getList(searchName.current);
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
    console.log(`searchName.current`, searchName.current);
    getList(searchName.current);
  }

  async function getList(name = "") {
    let list = [];
    let { finances, refreshState, page } = pageInfo;

    const response = await getFinanceList(
      name,
      page,
      searchType,
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
      setPageInfo({
        name,
        finances: [],
        refreshState: RefreshState.EmptyData,
        page: 0,
      });
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

  function handleSearchByName(name) {
    searchName.current = name;
    // getList(name);
    setPageInfo({
      finances: [],
      refreshState: RefreshState.HeaderRefreshing,
      page: 0,
    });
  }

  return (
    <View style={commonStyles.container}>
      <FinanceSearch onSearch={handleSearchByName} />
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
