import { ScrollView, View } from "native-base";
import { useLayoutEffect, useState } from "react";
import Loading from "../components/UI/Loading";
import { commonStyles } from "../styles/common";

function StudentManage({ route, navigation }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}></View>
    </ScrollView>
  );
}

export default StudentManage;
