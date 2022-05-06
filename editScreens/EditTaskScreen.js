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
  useRoute,
  useIsFocused,
} from "@react-navigation/native";
import NoteComponent from "../components/NoteComponent";
import { MaterialIcons } from "@expo/vector-icons";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { set } from "react-native-reanimated";

const EditTask = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const uid = auth.currentUser.uid;
  const isFocused = useIsFocused();
  const task_obj = db.ref("users/" + uid + "/tasks/" + route.params.key);
  const [taskTitle, setTaskTitle] = useState(route.params.task);
  const [taskDays, setTaskDays] = useState(route.params.days);

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

  function onMultiChange() {
    return (item) => setSelectedDays(xorBy(selectedDays, [item], "id"));
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={taskTitle}
          placeholder="Task"
          onChangeText={(text) => updateTitle(text)}
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
        <Text style={styles.buttonText}>Finish Editing Task</Text>
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
