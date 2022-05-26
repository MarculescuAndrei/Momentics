import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { LinearGradient } from "expo-linear-gradient";

const AddTask = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [allWeek, setAllWeek] = useState(false);
  const [isOutdoors, setIsOutDoors] = useState(false);

  const days = [
    { item: "Monday", id: 1 },
    { item: "Tuesday", id: 2 },
    { item: "Wednesday", id: 3 },
    { item: "Thursday", id: 4 },
    { item: "Friday", id: 5 },
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
      isOutdoors: isOutdoors,
      time: now,
    });
    navigation.goBack();
  };

  const makeAllWeekTask = () => {
    if (allWeek == true) {
      setSelectedDays([]);
      setAllWeek(false);
    } else {
      setAllWeek(true);
      setSelectedDays(days);
    }
  };

  const makeOutdoors = () => {
    if (isOutdoors == true) {
      setIsOutDoors(false);
    } else {
      setIsOutDoors(true);
    }
  };

  function onMultiChange() {
    return (item) => setSelectedDays(xorBy(selectedDays, [item], "id"));
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
          placeholder="Task Title"
          onChangeText={(text) => setTaskTitle(text)}
          style={styles.inputTitle}
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

      <TouchableOpacity
        style={[styles.button_week, allWeek ? styles.button_all_week : null]}
        onPress={makeAllWeekTask}
      >
        <Text style={styles.buttonText}>All-Week</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button_outdoor,
          isOutdoors ? styles.button_is_outdoor : null,
        ]}
        onPress={makeOutdoors}
      >
        <Text style={styles.buttonText}>Outdoors Task</Text>
      </TouchableOpacity>

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

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 600,
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
    width: "79%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    margin: 5,
    marginTop: 30,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
  },

  button_week: {
    backgroundColor: "#1f1f1f",
    width: "38%",
    padding: 12,
    margin: 5,
    borderRadius: 6,
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: "#4f81ff",
  },

  button_outdoor: {
    backgroundColor: "#1f1f1f",
    width: "38%",
    padding: 12,
    margin: 5,
    borderRadius: 6,
    alignItems: "center",
    borderBottomWidth: 4,
    borderColor: "#fc7f03",
  },

  button_is_outdoor: {
    backgroundColor: "#fc7f03",
    borderBottomWidth: 4,
    borderColor: "#1f1f1f",
  },

  button_all_week: {
    backgroundColor: "#4f81ff",
    borderBottomWidth: 4,
    borderColor: "#1f1f1f",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
    textAlignVertical: "top",
    width: "80%",
    paddingTop: 10,
  },
});
