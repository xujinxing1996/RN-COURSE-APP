import { useToast } from "native-base";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { isInvalidPhone } from "../../util/common";
import AuthForm from "./AuthForm";

function AuthContent({ onAuthenticate }) {
  const toast = useToast();
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    phone: false,
    password: false,
  });

  function handleSubmit(credentials) {
    let { phone, password } = credentials;
    phone = phone.trim();
    password = password.trim();

    const phoneIsValid = isInvalidPhone(phone);
    const passwordIsValid = password.length >= 6;

    if (!phoneIsValid || !passwordIsValid) {
      toast.show({
        description: "无效的输入，请检查输入的内容是否符合规则!",
        placement: "top",
      });
      setCredentialsInvalid({
        phone: !phoneIsValid,
        password: !passwordIsValid,
      });
      return;
    }
    onAuthenticate({ phone, password });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.authTitle}>宏 宇 教 育 招 生 管 理 系 统</Text>
      <View style={styles.authContent}>
        <AuthForm
          onSubmit={handleSubmit}
          credentialsInvalid={credentialsInvalid}
        />
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 32,
  },
  authTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary500,
    marginTop: 37,
    textAlign: "center",
  },
  authContent: {
    marginTop: 34,
    paddingHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 8,
    backgroundColor: "#e4e4e4",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
});
