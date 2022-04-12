import HomeScreen from "../screens/HomeScreen";
import ToDoScreen from "../screens/ToDoScreen";
import NotesScreen from "../screens/NotesScreen";
import RoutineScreen from "../screens/RoutineScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, StyleSheet, Alert, Button } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  const switchToProfile = () => {
    navigation.navigate("ProfileScreen");
  };
  const drawerOptions = {
    drawerStyle: {
      backgroundColor: "#242424",
      width: 240,
    },
    headerStyle: {
      backgroundColor: "#292929",
    },
    headerTitleStyle: {
      color: "white",
    },
    headerTintColor: "white",
    drawerActiveTintColor: "white",
    drawerInactiveTintColor: "white",
    headerShown: true,
    headerRight: () => (
      <MaterialCommunityIcons
        name="face-profile"
        size={24}
        color="#cccccc"
        onPress={switchToProfile}
        style={{ paddingRight: 20 }}
      />
    ),
  };

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={drawerOptions}
      />
      <Drawer.Screen
        name="ToDo's"
        component={ToDoScreen}
        options={drawerOptions}
      />
      <Drawer.Screen
        name="Notes"
        component={NotesScreen}
        options={drawerOptions}
      />
      <Drawer.Screen
        name="Routine"
        component={RoutineScreen}
        options={drawerOptions}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
