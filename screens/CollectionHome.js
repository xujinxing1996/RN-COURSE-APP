import { Button } from "native-base";
import { StyleSheet, View } from "react-native";
import { pages } from "../constants/page";

function CollectionHome({ navigation }) {
  const links = [
    {
      bgColor: "blue",
      title: "学历信息采集",
      pathName: pages.EDUCATION_COLLECTION,
    },
    {
      bgColor: "violet",
      title: "职业信息采集",
      pathName: pages.OCCUPATION_COLLECTION,
    },
    {
      bgColor: "green",
      title: "职称信息采集",
      pathName: pages.TITLE_COLLECTION,
    },
    {
      bgColor: "pink",
      title: "培训信息采集",
      pathName: pages.TRAIN_COLLECTION,
    },
  ];

  return (
    <View style={styles.container}>
      {links.map((link) => (
        <Button
          key={link.title}
          w="40%"
          marginX="5%"
          borderRadius="10"
          marginBottom="7%"
          colorScheme={link.bgColor}
          onPress={() =>
            navigation.navigate(link.pathName, { headerTitle: link.title })
          }
        >
          {link.title}
        </Button>
      ))}
    </View>
  );
}

export default CollectionHome;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: "15%",
    paddingHorizontal: "5%",
    backgroundColor: "#fff",
  },
});
