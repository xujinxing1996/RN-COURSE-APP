import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { Fragment, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import IconButton from "./components/UI/IconButton";
import { pages } from "./constants/page";
import { GlobalStyles } from "./constants/styles";
import AllFinances from "./screens/AllFinances";
import AllPerformances from "./screens/AllPerformances";
import AllStudents from "./screens/AllStudents";
import AllTeachers from "./screens/AllTeachers";
import CollectionHome from "./screens/CollectionHome";
import EducationManage from "./screens/EducationManage";
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import OccupationManage from "./screens/OccupationManage";
import TitleManage from "./screens/TitleManage";
import TrainManage from "./screens/TrainManage";
import AuditManage from "./screens/AuditManage";
import ReceiptUpload from "./screens/ReceiptUpload";
import PersonalPerformance from "./screens/PersonalPerformance";

const Stack = createNativeStackNavigator();

function CollectionOverview() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerRight: () => (
          <IconButton
            icon="home-outline"
            size={24}
            color={GlobalStyles.colors.black500}
            onPress={() => navigation.navigate(pages.HOME)}
          />
        ),
      })}
    >
      <Stack.Screen
        name={pages.COLLECTION_HOME}
        component={CollectionHome}
        options={({ navigation }) => ({
          headerTitle: "信息采集",
          headerLeft: () => (
            <IconButton
              icon="chevron-back-outline"
              size={28}
              color={GlobalStyles.colors.black500}
              onPress={() => navigation.navigate(pages.HOME)}
            />
          ),
          headerRight: null,
        })}
      />
      <Stack.Screen
        name={pages.EDUCATION_COLLECTION}
        component={EducationManage}
      />
      <Stack.Screen
        name={pages.OCCUPATION_COLLECTION}
        component={OccupationManage}
      />
      <Stack.Screen name={pages.TITLE_COLLECTION} component={TitleManage} />
      <Stack.Screen name={pages.TRAIN_COLLECTION} component={TrainManage} />
    </Stack.Navigator>
  );
}

function FinancesOverview() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerRight: () => (
          <IconButton
            icon="home-outline"
            size={24}
            color={GlobalStyles.colors.black500}
            onPress={() => navigation.navigate(pages.HOME)}
          />
        ),
      })}
    >
      <Stack.Screen
        name={pages.ALL_FINANCES}
        component={AllFinances}
        options={({ navigation }) => ({
          headerLeft: () => (
            <IconButton
              icon="chevron-back-outline"
              size={28}
              color={GlobalStyles.colors.black500}
              onPress={() => navigation.navigate(pages.HOME)}
            />
          ),
          headerRight: null,
          headerTitle: "财务审核",
        })}
      />
      <Stack.Screen name={pages.AUDIT_MANAGE} component={AuditManage} />
    </Stack.Navigator>
  );
}

function TeacherOverview() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerRight: () => (
          <IconButton
            icon="home-outline"
            size={24}
            color={GlobalStyles.colors.black500}
            onPress={() => navigation.navigate(pages.HOME)}
          />
        ),
      })}
    >
      <Stack.Screen
        name={pages.ALL_TEACHERS}
        component={AllTeachers}
        options={({ navigation }) => ({
          headerLeft: () => (
            <IconButton
              icon="chevron-back-outline"
              size={28}
              color={GlobalStyles.colors.black500}
              onPress={() => navigation.navigate(pages.HOME)}
            />
          ),
          headerRight: null,
          headerTitle: "教务审核",
        })}
      />
      <Stack.Screen name={pages.AUDIT_MANAGE} component={AuditManage} />
    </Stack.Navigator>
  );
}

function StudentOverview() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerRight: () => (
          <IconButton
            icon="home-outline"
            size={24}
            color={GlobalStyles.colors.black500}
            onPress={() => navigation.navigate(pages.HOME)}
          />
        ),
      })}
    >
      <Stack.Screen
        name={pages.ALL_STUDENTS}
        component={AllStudents}
        options={({ navigation }) => ({
          headerLeft: () => (
            <IconButton
              icon="chevron-back-outline"
              size={28}
              color={GlobalStyles.colors.black500}
              onPress={() => navigation.navigate(pages.HOME)}
            />
          ),
          headerRight: null,
          headerTitle: "学生信息查询",
        })}
      />
      <Stack.Screen name={pages.STUDENT_VIEW} component={AuditManage} />
      <Stack.Screen name={pages.AUDIT_MANAGE} component={AuditManage} />
      <Stack.Screen name={pages.EDUCATION_UPDATE} component={EducationManage} />
      <Stack.Screen
        name={pages.OCCUPATION_UPDATE}
        component={OccupationManage}
      />
      <Stack.Screen name={pages.TITLE_UPDATE} component={TitleManage} />
      <Stack.Screen name={pages.TRAIN_UPDATE} component={TrainManage} />
      <Stack.Screen
        name={pages.RECEIPT_UPLOAD}
        component={ReceiptUpload}
        options={{ headerTitle: "上传凭证" }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name={pages.LOGIN}
        component={LoginScreen}
        options={{
          headerTitle: "登录",
        }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: "center" }}
    >
      <Stack.Screen
        name={pages.HOME}
        component={Home}
        options={{
          headerTitle: "宏宇教育",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: GlobalStyles.colors.primary500,
          },
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={tintColor}
              size={24}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
      <Stack.Screen
        name={pages.COLLECTION_OVERVIEW}
        component={CollectionOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={pages.FINANCES_OVERVIEW}
        component={FinancesOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={pages.TEACHER_OVERVIEW}
        component={TeacherOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={pages.STUDENT_OVERVIEW}
        component={StudentOverview}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={pages.ALL_PERFORMANCES}
        component={AllPerformances}
        options={{
          headerTitle: "业绩查询",
        }}
      />
      <Stack.Screen
        name={pages.PERSONAL_PERFORMANCES}
        component={PersonalPerformance}
        options={{
          headerTitle: "个人业绩查询",
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const userInfo = await AsyncStorage.getItem("userInfo");
      const phone = await AsyncStorage.getItem("phone");
      const password = await AsyncStorage.getItem("password");
      if (userInfo) {
        authCtx.authenticate(JSON.parse(userInfo), phone, password);
      }
      await SplashScreen.hideAsync();
      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return null;
  }

  return <Navigation />;
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <NativeBaseProvider>
      <Fragment>
        <StatusBar style="light" />
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </Fragment>
    </NativeBaseProvider>
  );
}
