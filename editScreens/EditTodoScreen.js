import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { auth, db } from "../firebase";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const EditToDo = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const uid = auth.currentUser.uid;
  const todo_obj = db.ref("users/" + uid + "/todos/" + route.params.key);

  const [showDate, setShowDate] = useState(false);
  const [showDateText, setShowDateText] = useState(true);
  const [date, setDate] = useState(new Date());
  const [todoTask, setTodoTask] = useState(route.params.task);
  const [todoDetails, setTodoDetails] = useState(route.params.details);
  const [todoDueDate, setTodoDueDate] = useState(route.params.dueDate);
  const [todoImportance, setTodoImportance] = useState(route.params.importance);

  // update functions
  const updateTask = (text) => {
    todo_obj.update({
      task: text,
    });
    setTodoTask(text);
  };

  const updateDetails = (text) => {
    todo_obj.update({
      details: text,
    });
    setTodoDetails(text);
  };

  const updateImportance = (text) => {
    todo_obj.update({
      importance: text,
    });
    setTodoImportance(text);
  };

  const updateDueDate = (text) => {
    todo_obj.update({
      dueDate: text,
    });
    setTodoDueDate(text);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDate(false);
    setShowDateText(true);
    let tempDate = new Date(currentDate);
    let fdate =
      tempDate.getDate() +
      " / " +
      (tempDate.getMonth() + 1) +
      " / " +
      tempDate.getFullYear();

    setTodoDueDate(fdate);
    updateDueDate(fdate);
  };

  const showDatePicker = () => {
    setShowDate(true);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["white", "#666666"]}
        start={{ x: 0, y: -2 }}
        style={styles.background}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={todoTask}
          placeholder="Task"
          onChangeText={(text) => updateTask(text)}
          style={styles.inputTitle}
        />
      </View>

      <View style={styles.picker_container}>
        <Picker
          placeholder="Choose Importance"
          style={styles.picker}
          selectedValue={todoImportance}
          onValueChange={(itemValue, itemIndex) => updateImportance(itemValue)}
        >
          <Picker.Item
            value=""
            label="Choose  importance.."
            style={{ color: "gray", fontSize: 13 }}
          />
          <Picker.Item
            label="Critical"
            value="Critical"
            style={{ color: "red" }}
          />
          <Picker.Item
            label="Important"
            value="Important"
            style={{ color: "#b95eff" }}
          />
          <Picker.Item
            label="Normal"
            value="Normal"
            style={{ color: "#fcb130" }}
          />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={todoDetails}
          height={100}
          multiline={true}
          placeholder="Details"
          onChangeText={(text) => updateDetails(text)}
          style={styles.input}
        />
      </View>

      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View style={{ marginTop: 30, flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonText}>
            {showDateText ? todoDueDate : "Choose a due date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Finish editing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditToDo;

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

  picker: {
    justifyContent: "center",
    height: 20,
    width: "100%",
  },

  picker_container: {
    justifyContent: "center",
    width: "80%",
    backgroundColor: "white",
    height: 50,
    borderRadius: 6.5,
    margin: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    elevation: 4,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 600,
  },

  button: {
    elevation: 4,
    margin: 10,
    backgroundColor: "#1f1f1f",
    width: 138,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  input: {
    elevation: 4,
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 15,
    padding: 10,
    borderRadius: 6.5,
    marginTop: 3,
    color: "black",
    textAlignVertical: "top",
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
  },

  inputTitle: {
    color: "black",
    textAlignVertical: "top",
    backgroundColor: "transparent",
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 5,
    marginTop: 15,
  },

  inputContainer: {
    width: "80%",
  },
});
