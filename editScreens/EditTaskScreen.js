import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { LinearGradient } from "expo-linear-gradient";

const EditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const uid = auth.currentUser.uid;
  const isFocused = useIsFocused();
  const task_obj = db.ref("users/" + uid + "/tasks/" + route.params.key);
  const [taskTitle, setTaskTitle] = useState(route.params.task);
  const [allWeek, setAllWeek] = useState(false);

  const days = [
    { item: "Monday", id: 1 },
    { item: "Tuesday", id: 2 },
    { item: "Wednesday", id: 3 },
    { item: "Thursday", id: 4 },
    { item: "Friday", id: 5 },
    { item: "Saturday", id: 6 },
    { item: "Sunday", id: 7 },
  ];

  // reads preselected days in correct format
  const [selectedDays, setSelectedDays] = useState([]);
  useEffect(() => {
    var editable_days = [];
    var preselected_days = route.params.days;
    days.forEach((day_obj) => {
      preselected_days.forEach((preselectedday_obj) => {
        if (preselectedday_obj == day_obj.item) {
          editable_days.push(day_obj);
        }
      });
    });
    setSelectedDays(editable_days);
  }, [isFocused]);

  const updateTitle = (text) => {
    task_obj.update({
      task: text,
    });
    setTaskTitle(text);
  };

  // adds days to the selected ones
  function onMultiChange() {
    return (item) => setSelectedDays(xorBy(selectedDays, [item], "id"));
  }

  const makeAllWeekTask = () => {
    if (allWeek == true) {
      setSelectedDays([]);
      setAllWeek(false);
    } else {
      setAllWeek(true);
      setSelectedDays(days);
    }
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
          value={taskTitle}
          placeholder="Task"
          onChangeText={(text) => updateTitle(text)}
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
        style={styles.button}
        onPress={() => {
          var task_days = [];
          selectedDays.forEach((day_obj) => {
            task_days.push(day_obj.item);
          });
          task_obj.update({
            days: task_days,
          });
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>Finish Editing</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTask;

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
    width: "38%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    margin: 5,
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
