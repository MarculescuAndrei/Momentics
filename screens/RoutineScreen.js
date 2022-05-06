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
import DayComponent from "../components/DayComponent";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { Ionicons } from "@expo/vector-icons";

const RoutineScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();
  const [tasks, setTasks] = useState([]);
  // const [tasksTitles, setTasksTitles] = useState([]);

  //read tasks
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");

    all_tasks.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const tasks_list = [];
        // const tasks_titles = [];
        snapshot.forEach((task_obj) => {
          // tasks_titles.push(task_obj.val().task);
          tasks_list.push({
            key: task_obj.key,
            task_title: task_obj.val().task,
            days: task_obj.val().days,
            time: task_obj.val().time,
            isDoneForToday: task_obj.val().isDoneForToday,
          });
        });
        setDataState(true);
        setTasks(tasks_list);
        // setTasksTitles(tasks_titles);
      } else {
        setDataState(false);
        console.log("Data Snapshot is null");
      }
    });
  }, [isFocused]);

  const handleAddTask = () => {
    navigation.navigate("AddTaskScreen");
  };

  const handleSeeTasks = () => {
    navigation.navigate("TasksScreen");
  };

  function getTasksForDay(day, tasks) {
    var day_tasks = [];
    tasks.forEach((task_obj) => {
      task_obj.days.forEach((task_day) => {
        if (day == task_day) {
          day_tasks.push(task_obj.task_title);
        }
      });
    });
    return day_tasks;
  }

  const handleSeeDoneDays = () => {
    navigation.navigate("DoneRoutineDaysScreen");
  };

  // cum am aici view sub scrollview trb sa folosesc si in home

  return (
    <View style={styles.big_container}>
      <ScrollView contentContainerStyle={styles.container}>
        <View>
          {dataState ? (
            <View style={styles.routine_header}>
              <Text style={{ color: "white", left: 20 }}>
                This is your week!
              </Text>
            </View>
          ) : (
            <View style={styles.routine_header}>
              <Text style={{ color: "white", left: 20 }}>
                Start by adding some tasks!
              </Text>
            </View>
          )}
        </View>

        <View style={styles.day_component}>
          {dataState ? (
            <>
              <DayComponent
                day="Monday"
                tasks={getTasksForDay("Monday", tasks)}
              />
            </>
          ) : null}

          {dataState ? (
            <DayComponent
              day="Tuesday"
              tasks={getTasksForDay("Tuesday", tasks)}
            />
          ) : null}

          {dataState ? (
            <DayComponent
              day="Wednesday"
              tasks={getTasksForDay("Wednesday", tasks)}
            />
          ) : null}

          {dataState ? (
            <DayComponent
              day="Thursday"
              tasks={getTasksForDay("Thursday", tasks)}
            />
          ) : null}

          {dataState ? (
            <DayComponent
              day="Friday"
              tasks={getTasksForDay("Friday", tasks)}
            />
          ) : null}

          {dataState ? (
            <DayComponent
              day="Saturday"
              tasks={getTasksForDay("Saturday", tasks)}
            />
          ) : null}

          {dataState ? (
            <DayComponent
              day="Sunday"
              tasks={getTasksForDay("Sunday", tasks)}
            />
          ) : null}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.tasks_button} onPress={handleSeeTasks}>
        <Octicons name="tasklist" size={26} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.calendar_button}
        onPress={handleSeeDoneDays}
      >
        <Feather name="calendar" size={26} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.plus_button} onPress={handleAddTask}>
        <MaterialCommunityIcons name="playlist-plus" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default RoutineScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#666666",
  },

  routine_header: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 5,
    height: 40,
    width: 300,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#62de81",
  },

  big_container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#666666",
  },

  day_component: {
    padding: 10,
  },

  tasks_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 170,
    right: 20,
    height: 60,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 300,
  },

  calendar_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 100,
    right: 20,
    height: 60,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 300,
  },

  plus_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 60,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 300,
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
