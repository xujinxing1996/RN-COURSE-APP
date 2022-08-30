import { useContext } from "react";
import FinancesOutput from "../components/FinancesOutput/FinancesOutput";
import { AuthContext } from "../store/auth-context";

function AllTeachers() {
  const authCtx = useContext(AuthContext);

  const { perm } = authCtx.userInfo;
  const trainTypeNames = ["education", "train", "occupation", "title"];
  const trainPerm = [21, 22, 23, 24];
  const userPermIndex = trainPerm.indexOf(perm);
  let trainType = trainTypeNames[userPermIndex];

  if (userPermIndex < 0) trainType = "";

  return <FinancesOutput searchType="jiaowu" trainType={trainType} />;
}

export default AllTeachers;
