import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileName from "./miscScreens/ProfileName";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerNavigator from "./components/DrawerNavigator";
import ProfileScreen from "./screens/ProfileScreen";
import AddNoteScreen from "./additionScreens/AddNoteScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddToDoScreen from "./additionScreens/AddToDoScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DoneToDoScreen from "./miscScreens/DoneTodosScreen";
import EditNoteScreen from "./editScreens/EditNoteScreen";
import EditToDo from "./editScreens/EditTodoScreen";
import AddTask from "./additionScreens/AddTaskScreen";
import TasksScreen from "./screens/TasksScreen";
import EditTask from "./editScreens/EditTaskScreen";
import FocusScreen from "./screens/FocusScreen";
import EditFocus from "./editScreens/EditFocusScreen";
import DoneRoutineDaysScreen from "./miscScreens/DoneRoutineDaysScreen";

LogBox.ignoreAllLogs(true);
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
          options={{
            title: "Your Profile",
            drawerStyle: {
              backgroundColor: "#242424",
              width: 240,
            },
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
            drawerActiveTintColor: "white",
            drawerInactiveTintColor: "white",
            headerShown: true,
          }}
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
        <Stack.Screen name="ToDoScreen" component={DrawerNavigator} />
        <Stack.Screen
          options={{
            title: "Edit ToDo",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="EditTodoScreen"
          component={EditToDo}
        />
        <Stack.Screen name="NotesScreen" component={DrawerNavigator} />
        <Stack.Screen name="RoutineScreen" component={DrawerNavigator} />
        <Stack.Screen
          options={{
            title: "Focus",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="FocusScreen"
          component={FocusScreen}
        />
        <Stack.Screen
          options={{
            title: "Edit Focus Parameters",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="EditFocusScreen"
          component={EditFocus}
        />
        <Stack.Screen
          options={{
            title: "Write Note",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
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
          options={{
            title: "Edit Note",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="EditNoteScreen"
          component={EditNoteScreen}
        />
        <Stack.Screen
          options={{
            title: "Add a To-Do",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="AddToDoScreen"
          component={AddToDoScreen}
        />
        <Stack.Screen
          options={{
            title: "Add a Task",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="AddTaskScreen"
          component={AddTask}
        />
        <Stack.Screen
          options={{
            title: "Done ToDo's",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="DoneTodosScreen"
          component={DoneToDoScreen}
        />
        <Stack.Screen
          options={{
            title: "Daily Tasks",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="TasksScreen"
          component={TasksScreen}
        />
        <Stack.Screen
          options={{
            title: "Routine Tracker",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="DoneRoutineDaysScreen"
          component={DoneRoutineDaysScreen}
        />
        <Stack.Screen
          options={{
            title: "Edit Task",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1a1a1a",
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTintColor: "white",
          }}
          name="EditTaskScreen"
          component={EditTask}
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
