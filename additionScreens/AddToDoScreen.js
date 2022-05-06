import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { addValidStylePropTypes } from "react-native/Libraries/StyleSheet/StyleSheetValidation";

const AddToDoScreen = () => {
  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [importance, setImportance] = useState("");
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [showDateText, setShowDateText] = useState(false);

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
    setDueDate(fdate);
  };

  const showDatePicker = () => {
    setShowDate(true);
  };

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
    db.ref("users/" + uid + "/todos").push({
      task: task,
      details: details,
      importance: importance,
      dueDate: dueDate,
      time: now,
      isDone: "false",
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Task"
          onChangeText={(text) => setTask(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.picker_container}>
        <Picker
          placeholder="Choose Importance"
          style={styles.picker}
          selectedValue={importance}
          onValueChange={(itemValue, itemIndex) => setImportance(itemValue)}
        >
          <Picker.Item
            value=""
            label="Choose  importance.."
            style={{ color: "black" }}
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
          height={100}
          multiline={true}
          placeholder="Details"
          onChangeText={(text) => setDetails(text)}
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

      <View style={{ marginTop: 100 }}>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonText}>
            {showDateText ? dueDate : "Choose a due date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={writeToDb}>
          <Text style={styles.buttonText}>Add this ToDo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddToDoScreen;

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
    borderRadius: 6.5,
    margin: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    elevation: 4,
  },

  button: {
    elevation: 4,
    backgroundColor: "#1f1f1f",
    width: 281,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
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
