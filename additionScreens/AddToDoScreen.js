import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { auth, db } from "../firebase";
import React, { useState, useEffect } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";

const AddToDoScreen = () => {
  const [task, setTask] = useState("");
  const [details, setDetails] = useState("");
  const [importance, setImportance] = useState("");
  const [date, setDate] = useState(new Date());
  const [dueDate, setDueDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [showDateText, setShowDateText] = useState(false);

  const [toDosDueDates, setToDosDueDates] = useState([]);
  const [recommendation, setRecommendation] = useState(
    "Select importance for a due date recommendation."
  );
  const [dataState, setDataState] = useState(true);
  const isFocused = useIsFocused();

  // read other existing todos to recommend a due date
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_todos = db.ref("users/" + uid + "/todos");

    all_todos.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const todosdue_list = [];
        snapshot.forEach((todo_obj) => {
          if (todo_obj.val().isDone == "false") {
            // Processing of due date field
            var splitted_date = todo_obj.val().dueDate.split(" / ");
            if (splitted_date[1].length < 2) {
              var month = "0" + splitted_date[1];
            } else {
              var month = splitted_date[1];
            }

            if (splitted_date[0].length < 2) {
              var day = "0" + splitted_date[0];
            } else {
              var day = splitted_date[0];
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            var date_info = splitted_date[2] + "-" + month + "-" + day;

            // Places all todo's that have due dates after current date => We don't look at late To Do's.
            if (new Date(date_info.toString()) > today) {
              todosdue_list.push({
                key: todo_obj.key,
                importance: todo_obj.val().importance,
                dueDate: new Date(date_info.toString()),
              });
            }
          }
        });
        setDataState(true);
        setToDosDueDates(todosdue_list.sort((a, b) => a.dueDate - b.dueDate));
      } else {
        setDataState(false);
        console.log("Data Snapshot is null");
      }
    });
  }, [isFocused]);

  ////////////////////////

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

  // function that handles the change of importance and calculates recommended due Date.
  function handleSetImportance(itemValue) {
    // importance = how fast it should be completed, not how hard
    setImportance(itemValue);
    let hasRecommendedDateLocal = false;
    let recommendedDate = "";
    let timeWindow = 0;
    const today = new Date();

    if (itemValue == "Critical") {
      timeWindow = 4;
    } else if (itemValue == "Important") {
      timeWindow = 6;
    } else if (itemValue == "Normal") {
      timeWindow = 8;
    } else {
      hasRecommendedDateLocal = true;
      setRecommendation("Select importance for a due date recommendation.");
    }

    // This Works if there's already at least 1 ToDo in Place

    if (toDosDueDates.length > 0) {
      // verifies if it can recommend a due date before the first existig due date depending on importance
      if (
        Math.ceil(
          (toDosDueDates[0].dueDate.getTime() - today.getTime()) /
            (1000 * 3600 * 24)
        ) >= timeWindow &&
        !hasRecommendedDateLocal
      ) {
        hasRecommendedDateLocal = true;
        today.setDate(today.getDate() + timeWindow / 2);
        recommendedDate =
          today.getDate() +
          " / " +
          (parseInt(today.getMonth(), 10) + 1) +
          " / " +
          today.getFullYear();
        setRecommendation("Recommended date " + recommendedDate);
      }

      // verifies if it can recommend a due date between existing due dates depending on importance
      if (hasRecommendedDateLocal == false) {
        for (let index = 0; index < toDosDueDates.length - 1; index += 1) {
          console.log(toDosDueDates[index].dueDate.getDate());
          if (
            ((toDosDueDates[index].dueDate.getTime() -
              toDosDueDates[index + 1].dueDate.getTime()) /
              (1000 * 3600 * 24)) *
              -1 >=
              timeWindow &&
            !hasRecommendedDateLocal
          ) {
            console.log(index);
            var duplicate = toDosDueDates[index].dueDate;
            duplicate.setDate(duplicate.getDate() + timeWindow / 2);

            hasRecommendedDateLocal = true;
            recommendedDate =
              duplicate.getDate() +
              " / " +
              (parseInt(duplicate.getMonth(), 10) + 1) +
              " / " +
              duplicate.getFullYear();

            duplicate.setDate(duplicate.getDate() - timeWindow / 2);
            setRecommendation("Recommended date " + recommendedDate);
          }
        }
      }

      // sets a due date after the existing due dates if it couldnt find a good time window, depending on importance
      if (hasRecommendedDateLocal == false) {
        var duplicate = toDosDueDates[toDosDueDates.length - 1].dueDate;
        duplicate.setDate(duplicate.getDate() + timeWindow / 2);
        hasRecommendedDateLocal = true;
        recommendedDate =
          duplicate.getDate() +
          " / " +
          (parseInt(duplicate.getMonth(), 10) + 1) +
          " / " +
          duplicate.getFullYear();
        duplicate.setDate(duplicate.getDate() - timeWindow / 2);
        setRecommendation("Recommended date " + recommendedDate);
      }
    } else {
      hasRecommendedDateLocal = true;
      today.setDate(today.getDate() + timeWindow / 2);
      recommendedDate =
        today.getDate() +
        " / " +
        (parseInt(today.getMonth(), 10) + 1) +
        " / " +
        today.getFullYear();
      setRecommendation("Recommended date " + recommendedDate);
    }
  }

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
          placeholder="To Do"
          onChangeText={(text) => setTask(text)}
          style={styles.inputTitle}
        />
      </View>

      <View style={styles.picker_container}>
        <Picker
          placeholder="Choose Importance"
          style={styles.picker}
          selectedValue={importance}
          onValueChange={(itemValue, itemIndex) =>
            handleSetImportance(itemValue)
          }
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
          height={100}
          multiline={true}
          placeholder="Details"
          onChangeText={(text) => setDetails(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.duedate_recommendation}>
        <Text style={{ color: "white", margin: 2 }}>{recommendation}</Text>
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

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={styles.button} onPress={showDatePicker}>
          <Text style={styles.buttonText}>
            {showDateText ? dueDate : "Select Due Date"}
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

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 600,
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

  duedate_recommendation: {
    padding: 5,
    marginTop: 40,
    backgroundColor: "#1f1f1f",
    width: "80%",
    borderRadius: 6,
    borderBottomColor: "#fc7f03",
    borderBottomWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    elevation: 4,
    margin: 10,
    backgroundColor: "#1f1f1f",
    width: 138,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",

    borderBottomWidth: 4,
    borderColor: "#4ddb73",
    bottom: 10,
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
