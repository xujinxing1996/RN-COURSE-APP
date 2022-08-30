import {
  HStack,
  Box,
  Input as InputBase,
  Select,
  CheckIcon,
  Button,
} from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { useEffect, useState } from "react";
import { dateFormat } from "../../constants/dateFormat";
import FormLabel from "./FormLabel";
import DropDownPicker from "react-native-dropdown-picker";

function Input({
  label,
  invalid,
  selectOptions = [],
  isObjectValue,
  textInputConfig,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    textInputConfig.type === "MultiSelect" && textInputConfig.value
  );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const inputStyles = [styles.title];

  useEffect(() => {
    if (textInputConfig.type === "MultiSelect") {
      handleValueChange(value);
    }
  }, [value]);

  // useEffect(() => {
  //   if (textInputConfig.type === "MultiSelect") {
  //     setValue([]);
  //   }
  // }, [selectOptions]);

  if (textInputConfig && textInputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  function showDatePicker() {
    if (textInputConfig.isDisabled) return;
    setDatePickerVisibility(true);
  }

  function hideDatePicker() {
    setDatePickerVisibility(false);
  }

  function handleConfirm(date) {
    const formatDate = dayjs(date).format(dateFormat.DATE);
    textInputConfig.onChangeText(formatDate);
    hideDatePicker();
  }

  function handleValueChange(value) {
    let selectedValue = value;
    if (isObjectValue) {
      selectedValue = selectOptions.find((option) => value === option.id);
    }
    textInputConfig.onChangeText(selectedValue);
  }

  let InputOutput = (
    <InputBase
      style={inputStyles}
      w="63%"
      borderRadius="md"
      borderWidth={0}
      {...textInputConfig}
    />
  );

  switch (textInputConfig.type) {
    case "Select":
      InputOutput = (
        <Select
          style={inputStyles}
          isDisabled={textInputConfig.isDisabled}
          selectedValue={
            isObjectValue
              ? textInputConfig.value && textInputConfig.value.value
              : textInputConfig.value
          }
          flex="1"
          borderWidth={0}
          bgColor="#fff"
          placeholder={textInputConfig.placeholder}
          _selectedItem={{
            endIcon: <CheckIcon size="5" />,
          }}
          onValueChange={handleValueChange}
        >
          {selectOptions.map((option) => (
            <Select.Item
              key={option.id}
              shadow={2}
              label={option.label}
              value={option.value}
            />
          ))}
        </Select>
      );
      break;
    case "Date":
      InputOutput = (
        <Box flex="1">
          <Button
            style={inputStyles}
            flex="1"
            textAlign="center"
            borderWidth={0}
            variant="link"
            borderRadius="md"
            onPress={showDatePicker}
          >
            {textInputConfig.value || "请选择时间"}
          </Button>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </Box>
      );
      break;
    case "MultiSelect":
      InputOutput = (
        <Box flex="1">
          <DropDownPicker
            style={{ ...inputStyles, borderWidth: 0 }}
            placeholderStyle={{
              color: "#94a3b8",
              fontSize: 12,
              textAlign: "center",
            }}
            placeholder="请选择"
            open={open}
            value={textInputConfig.value}
            items={selectOptions}
            setOpen={setOpen}
            setValue={setValue}
            mode="BADGE"
            // setItems={setItems}
            multiple={true}
            listMode="MODAL"
            min={0}
            max={5}
          />
        </Box>
      );
      break;
  }

  if (!label) {
    return InputOutput;
  }

  return (
    <HStack marginBottom={2} flexWrap="wrap" alignItems="stretch">
      {label && <FormLabel label={label} invalid={invalid} />}
      {InputOutput}
    </HStack>
  );
}

export default Input;

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  inputMultiline: {
    minHeight: 100,
    textAlign: "left",
    textAlignVertical: "top",
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
