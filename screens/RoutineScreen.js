import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  View,
  SafeAreaView,
  BackHandler,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  NavigationContainer,
  useNavigation,
  useIsFocused,
} from "@react-navigation/native";
import NoteComponent from "../components/NoteComponent";
import { Entypo } from "@expo/vector-icons";
import ToDoComponent from "../components/ToDoComponent";
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
const RoutineScreen = () => {
  const navigation = useNavigation();

  const handleAddTask = () => {
    navigation.navigate("AddTaskScreen");
  };

  const handleSeeTasks = () => {
    navigation.navigate("TasksScreen");
  };

  return (
    <View style={styles.container}>
      <Text>Your Routine</Text>

      <TouchableOpacity style={styles.tasks_button} onPress={handleSeeTasks}>
        <Octicons name="tasklist" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.check_button}>
        <Feather name="calendar" size={30} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.plus_button} onPress={handleAddTask}>
        <MaterialCommunityIcons name="playlist-plus" size={34} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#666666",
  },

  tasks_button: {
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 190,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    zIndex: 3,
  },

  check_button: {
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 110,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    zIndex: 3,
  },

  plus_button: {
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    zIndex: 3,
  },

  todotitleview: {
    paddingBottom: 15,
  },

  todotitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  button: {
    backgroundColor: "#03b1fc",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },

  inputContainer: {
    width: "80%",
  },
});
