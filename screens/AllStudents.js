import { useContext } from "react";
import FinancesOutput from "../components/FinancesOutput/FinancesOutput";
import { AuthContext } from "../store/auth-context";

function AllStudents() {
  const authCtx = useContext(AuthContext);

  const { perm, mobile } = authCtx.userInfo;
  let searchType = "";
  let teacherMobile = "";
  if (perm == 1) {
    searchType = "guanli";
  } else {
    searchType = "teacher";
    teacherMobile = mobile;
  }

  return <FinancesOutput searchType="guanli" teacherMobile={teacherMobile} />;
}

export default AllStudents;
