import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigator from "./components/DrawerNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import AddNoteScreen from "./additionScreens/AddNoteScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddToDoScreen from "./additionScreens/AddToDoScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RegisterScreen"
          component={RegisterScreen}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="HomeScreen"
          component={DrawerNavigator}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          name="ToDoScreen"
          component={DrawerNavigator}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          name="NotesScreen"
          component={DrawerNavigator}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          name="RoutineScreen"
          component={DrawerNavigator}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          options={{
            title: "Add a Note",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#292929",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="AddNoteScreen"
          component={AddNoteScreen}
        />
        <Stack.Screen
          //options={{ headerShown: false }}
          options={{
            title: "Add a To-Do",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#292929",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="AddToDoScreen"
          component={AddToDoScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

//<Stack.Navigator>
//        <Stack.Screen
//          options={{ headerShown: false }}
//          name="LoginScreen"
//          component={LoginScreen}
//        />
//        <Stack.Screen
//          options={{ headerShown: false }}
//          name="HomeScreen"
//          component={HomeScreen}
//        />
//        <Stack.Screen
//          options={{ headerShown: false }}
//          name="RegisterScreen"
//          component={RegisterScreen}
//        />
//      </Stack.Navigator>

//<Drawer.Navigator initialRouteName="Login Screen">
//        <Drawer.Screen name="Home" component={HomeScreen} />
//        <Drawer.Screen name="Login Screen" component={LoginScreen} />
//        <Drawer.Screen name="Register Screen" component={RegisterScreen} />
//        <Drawer.Screen
//          name="Email Verification Screen"
//          component={EmailVerificationScreen}
//        />
//      </Drawer.Navigator>
