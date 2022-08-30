import { useToast } from "native-base";
import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthContent from "../components/Auth/AuthContent";
import Loading from "../components/UI/Loading";
import { fetchNumber } from "../fetches/configure";
import { signIn } from "../fetches/modules/auth";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);
  const toast = useToast();

  async function handleLogin({ phone, password }) {
    setIsAuthenticating(true);
    const response = await signIn(phone, password);
    if (response.code === fetchNumber.CODE_200) {
      authCtx.authenticate(response.data, phone, password);
    } else {
      authCtx.authenticate(null, phone, password);
      toast.show({
        description: response.message,
        placement: "top",
      });
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <Loading loading={isAuthenticating} loadingText="登录中" />;
  }

  return (
    <View style={styles.container}>
      <AuthContent onAuthenticate={handleLogin} />
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
