import HomeScreen from "../screens/HomeScreen";
import ToDoScreen from "../screens/ToDoScreen";
import NotesScreen from "../screens/NotesScreen";
import RoutineScreen from "../screens/RoutineScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FocusScreen from "../screens/FocusScreen";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const isFocused = useIsFocused();

  const switchToProfile = () => {
    navigation.navigate("ProfileScreen");
  };
  const drawerOptions = {
    drawerStyle: {
      backgroundColor: "#242424",
      width: 210,
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
    headerRight: () => (
      <Feather
        name="user"
        size={22}
        color="white"
        onPress={switchToProfile}
        style={{ paddingRight: 20 }}
      />
    ),
  };

  useEffect(() => {
    let isCancelled = false;
    db.ref("users/" + auth.currentUser.uid + "/name").once(
      "value",
      (snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
        } else {
          console.log("Data Snapshot is null");
        }
      }
    );

    return () => {
      isCancelled = true;
    };
  }, [isFocused]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert(error.message));
  };

  const CustomDrawer = (props) => {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <View style={styles.drawer_header}>
            <View>
              <Text style={{ color: "white", fontSize: 16 }}>{name}</Text>
            </View>

            <Feather
              name="user"
              size={20}
              color="white"
              onPress={switchToProfile}
              style={{ paddingLeft: 25 }}
            />
            <Text style={{ color: "#62de81", fontSize: 12.5, paddingTop: 5 }}>
              {new Date(new Date().valueOf()).toString().slice(0, 15)}
            </Text>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        <TouchableOpacity style={styles.signout_button} onPress={handleSignOut}>
          <Text style={{ color: "white", fontSize: 13, paddingTop: 10 }}>
            Sign Out{" "}
          </Text>
          <Ionicons
            name="exit-outline"
            size={17}
            color="white"
            style={{ paddingTop: 10, paddingLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
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
      <Drawer.Screen
        name="Focus"
        component={FocusScreen}
        options={drawerOptions}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  drawer_header: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 100,
    padding: 15,
    margin: 15,
    width: 180,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
  },

  signout_button: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 40,
    margin: 15,
    width: 180,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
  },
});
