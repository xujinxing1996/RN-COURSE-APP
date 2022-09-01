import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Text, Button, HStack } from "native-base";
import { StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { useState } from "react";
import dayjs from "dayjs";
import { dateFormat } from "../../constants/dateFormat";

function PerformanceFilter({ onSearch }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isStart, setIsStart] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  function showDatePicker(isStart) {
    setIsStart(isStart);
    setDatePickerVisibility(true);
  }

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  function handleConfirm(date) {
    const formatDate = dayjs(date).format(dateFormat.DATE);
    if (isStart) {
      setStartDate(formatDate);
    } else {
      setEndDate(formatDate);
    }
    hideDatePicker();
  }

  function handlePress() {
    onSearch(startDate, endDate);
  }

  return (
    <View style={styles.container}>
      <HStack alignItems="center" justifyContent="space-around">
        <Text fontSize={13} style={styles.title}>
          查询日期:
        </Text>
        <Button
          textAlign="center"
          _text={{ fontWeight: "bold", fontSize: 13 }}
          py="2"
          px="0"
          borderWidth={1}
          variant="link"
          borderColor="gray.300"
          borderRadius="md"
          minW={105}
          onPress={showDatePicker.bind(null, true)}
        >
          {startDate || "开始时间"}
        </Button>
        <Text fontWeight="bold" color="primary.400">
          -
        </Text>
        <Button
          textAlign="center"
          _text={{ fontWeight: "bold", fontSize: 13 }}
          py="2"
          px="0"
          borderWidth={1}
          variant="link"
          borderColor="gray.300"
          borderRadius="md"
          minW={105}
          onPress={showDatePicker.bind(null, false)}
        >
          {endDate || "结束时间"}
        </Button>
        <Button
          borderRadius="md"
          _text={{ fontWeight: "bold", fontSize: 13 }}
          py="2"
          px="2"
          colorScheme="blue"
          onPress={handlePress}
        >
          查询
        </Button>
      </HStack>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

export default PerformanceFilter;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: GlobalStyles.colors.gray700,
  },
});
