// App.js
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import CreatePostScreen from "./screens/CreatePostScreen";
import PostScreen from "./screens/PostScreen";
import EditPostScreen from "./screens/EditPostScreen"; // Import EditPostScreen
import axios from "axios";
import { authContext } from "./helpers/authContext";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppHeader() {
  return (
    <View>
      <Text style={styles.appName}>Twitter</Text>
    </View>
  );
}

function LoginTabScreen({ navigation }) {
  return (
    <>
      <AppHeader />
      <LoginScreen navigation={navigation} />
    </>
  );
}

function RegisterTabScreen({ navigation }) {
  return (
    <>
      <AppHeader />
      <RegisterScreen navigation={navigation} />
    </>
  );
}

function HomeTabScreen({ navigation }) {
  return (
    <>
      <HomeScreen navigation={navigation} />
    </>
  );
}

function CreatePostTabScreen({ navigation }) {
  return (
    <>
      <CreatePostScreen navigation={navigation} />
    </>
  );
}

function AuthTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Login" component={LoginTabScreen} />
      <Tab.Screen name="Register" component={RegisterTabScreen} />
    </Tab.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home " component={HomeTabScreen} />
      <Tab.Screen name="Add Post" component={CreatePostTabScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [authState, setAuthState] = React.useState({
    username: "",
    id: 0,
    status: false,
  });

  React.useEffect(() => {
    axios.get("http://192.168.1.104:3000/auth/check").then((res) => {
      if (res.data.error) {
        setAuthState({ ...authState, status: false });
        console.log("Error");
      } else {
        setAuthState({
          username: res.data.username,
          id: res.data.id,
          status: true,
        });
      }
    });
  }, []);

  return (
    <authContext.Provider value={{ authState, setAuthState }}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthTabs} />
          <Stack.Screen name="Home" component={MainTabs} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="EditPost" component={EditPostScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </authContext.Provider>
  );
}

const styles = StyleSheet.create({
  appName: {
    fontSize: 29,
    marginBottom: 16,
    textAlign: "left",
    fontWeight: "bold",
    color: "#1DA1F2",
    marginLeft: 10,
    marginTop: 25,
  },
});
