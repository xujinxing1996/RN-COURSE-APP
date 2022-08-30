import { ScrollView, View } from "native-base";
import { useLayoutEffect } from "react";
import { commonStyles } from "../styles/common";

function TeacherManage({ route, navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.headerTitle,
    });
  }, [navigation, route]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={commonStyles.container}></View>
    </ScrollView>
  );
}

export default TeacherManage;
