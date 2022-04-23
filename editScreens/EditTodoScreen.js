import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

import { Entypo } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { addValidStylePropTypes } from "react-native/Libraries/StyleSheet/StyleSheetValidation";
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { styleProps } from "react-native-web/dist/cjs/modules/forwardedProps";

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

  //write

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={todoTask}
          placeholder="Task"
          onChangeText={(text) => updateTask(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.picker_container}>
        <Picker
          placeholder="Choose Importance"
          style={styles.picker}
          selectedValue={todoImportance}
          onValueChange={(itemValue, itemIndex) => updateImportance(itemValue)}
        >
          <Picker.Item value="" label="Choose  importance.." />
          <Picker.Item label="Critical" value="Critical" />
          <Picker.Item label="Important" value="Important" />
          <Picker.Item label="Normal" value="Normal" />
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

      <View style={styles.buttonContainer}>
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

  date_input: {
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    width: "60%",
    backgroundColor: "white",
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
    borderRadius: 10,
    margin: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    elevation: 4,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: "95%",
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  input: {
    elevation: 4,
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

  inputContainer: {
    width: "80%",
  },
});
