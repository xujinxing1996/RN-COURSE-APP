import { Button, Icon, Input } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

function AuthForm({ credentialsInvalid, onSubmit }) {
  const [show, setShow] = useState(false);
  const [enteredPhone, setEnteredPhone] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");

  const { phone: phoneIsValid, password: passwordIsValid } = credentialsInvalid;

  useEffect(() => {
    async function getLoginInfo() {
      const phone = await AsyncStorage.getItem("phone");
      const password = await AsyncStorage.getItem("password");

      setEnteredPhone(phone || "");
      setEnteredPassword(password || "");
    }

    getLoginInfo();
  }, []);

  function handleChangeText(inputIdentifier, enteredValue) {
    switch (inputIdentifier) {
      case "phone":
        setEnteredPhone(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
    }
  }

  function handleSubmit() {
    onSubmit({
      phone: enteredPhone,
      password: enteredPassword,
    });
  }

  return (
    <View>
      <Input
        borderColor="primary.400"
        keyboardType="phone-pad"
        isInvalid={phoneIsValid}
        value={enteredPhone}
        onChangeText={handleChangeText.bind(null, "phone")}
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="person" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="请输入手机号"
      />
      <Input
        mt="4"
        borderColor="primary.400"
        type={show ? "text" : "password"}
        isInvalid={passwordIsValid}
        value={enteredPassword}
        onChangeText={handleChangeText.bind(null, "password")}
        InputRightElement={
          <Icon
            as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />}
            size={5}
            mr="2"
            color="muted.400"
            onPress={() => setShow(!show)}
          />
        }
        InputLeftElement={
          <Icon
            as={<MaterialIcons name="lock" />}
            size={5}
            ml="2"
            color="muted.400"
          />
        }
        placeholder="请输入密码"
      />
      <View style={styles.buttons}>
        <Button colorScheme="blue" onPress={handleSubmit}>
          登录
        </Button>
      </View>
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 22,
  },
});
