import { useContext } from "react";
import FinancesOutput from "../components/FinancesOutput/FinancesOutput";
import { AuthContext } from "../store/auth-context";

function AllStudents() {
  const authCtx = useContext(AuthContext);

  const { perm } = authCtx.userInfo;
  let searchType = "";
  if (perm == 1) {
    searchType = "guanli";
  } else {
    searchType = "teacher";
  }

  return <FinancesOutput searchType={searchType} />;
}

export default AllStudents;
