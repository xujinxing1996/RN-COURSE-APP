import { StyleSheet, View } from "react-native";
import IconLink from "../UI/IconLink";

function HomeHeader({ headerData = [] }) {
  return (
    <View style={styles.container}>
      {headerData.map((link, index) => (
        <IconLink
          key={index}
          title={link.title}
          iconPath={link.iconPath}
          pathName={link.pathName}
        />
      ))}
    </View>
  );
}

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
