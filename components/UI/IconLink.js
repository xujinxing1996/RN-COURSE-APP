import { useNavigation } from "@react-navigation/native";
import { Text } from "native-base";
import { Image, Pressable, StyleSheet } from "react-native";

function IconLink({ title, pathName, iconPath }) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={styles.pressable}
      onPress={() => navigation.navigate(pathName)}
    >
      <Image style={styles.icon} source={iconPath} />
      <Text style={styles.link}>{title}</Text>
    </Pressable>
  );
}

export default IconLink;

const styles = StyleSheet.create({
  pressable: {
    width: "25%",
    marginTop: 20,
    display: "flex",
    alignItems: "center",
  },
  icon: { width: 50, height: 50, marginBottom: 13 },
  link: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
  },
});
