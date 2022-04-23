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
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import NoteComponent from "../components/NoteComponent";
import { MaterialIcons } from "@expo/vector-icons";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDays, setTaskDays] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const days = [
    { item: "Monday", id: 1 },
    { item: "Tuesday", id: 2 },
    { item: "Wednesday", id: 3 },
    { item: "Thursday", id: 4 },
    { item: "Friday ", id: 5 },
    { item: "Saturday", id: 6 },
    { item: "Sunday", id: 7 },
  ];
  const navigation = useNavigation();

  //write
  const writeToDb = () => {
    const uid = auth.currentUser.uid;
    var date = new Date();
    var now =
      date.getDate() +
      " - " +
      (date.getMonth() + 1) +
      " - " +
      date.getFullYear() +
      "  " +
      date.getHours() +
      " " +
      date.getSeconds();

    var task_days = [];
    selectedDays.forEach((day_obj) => {
      task_days.push(day_obj.item);
    });

    db.ref("users/" + uid + "/tasks").push({
      task: taskTitle,
      days: task_days,
      isDoneForToday: false,
      time: now,
    });
    navigation.goBack();
  };

  function onMultiChange() {
    return (item) => setSelectedDays(xorBy(selectedDays, [item], "id"));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Task"
          onChangeText={(text) => setTaskTitle(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.pickerview}>
        <SelectBox
          multiOptionContainerStyle={{ backgroundColor: "#141414" }}
          multiOptionsLabelStyle={{ backgroundColor: "#141414" }}
          arrowIconColor={"#141414"}
          searchIconColor={"#141414"}
          toggleIconColor={"#141414"}
          label="Select Days"
          options={days}
          selectedValues={selectedDays}
          onMultiSelect={onMultiChange()}
          onTapClose={onMultiChange()}
          isMulti
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={writeToDb}>
        <Text style={styles.buttonText}>Add this Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#666666",
  },

  note_item: {
    padding: 15,
    fontSize: 11,
    marginTop: 12,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },

  pickerview: {
    borderRadius: 6.5,
    padding: 12,
    marginTop: 30,
    backgroundColor: "white",
    width: "80%",
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    elevation: 4,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "80%",
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
    color: "black",
    textAlignVertical: "top",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 6.5,
    marginTop: 5,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    elevation: 4,
  },

  inputContainer: {
    textAlignVertical: "top",
    width: "80%",
    paddingTop: 10,
  },
});
