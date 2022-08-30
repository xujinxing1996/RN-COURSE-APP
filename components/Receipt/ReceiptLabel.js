import { Box, Text } from "native-base";
import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function ReceiptLabel({ label, invalid }) {
  return (
    <Box
      style={styles.title}
      justifyContent="center"
      mr="2%"
      borderRadius="md"
      w="35%"
    >
      <Text style={[styles.label, invalid && styles.invalidLabel]}>
        {label}
      </Text>
    </Box>
  );
}

export default ReceiptLabel;

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    paddingVertical: 12,
    fontWeight: "bold",
    color: GlobalStyles.colors.black500,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
});
