import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  userInfo: null,
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState();

  function authenticate(userInfo, phone, password) {
    setUserInfo(userInfo);
    AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
    AsyncStorage.setItem("phone", phone || "");
    AsyncStorage.setItem("password", password || "");
  }

  function logout() {
    setUserInfo(null);
    AsyncStorage.removeItem("userInfo");
  }

  const value = {
    token: userInfo && userInfo.token,
    userInfo,
    isAuthenticated: !!userInfo,
    authenticate,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
