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
import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TaskComponent from "../components/TaskComponent";
const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  //read
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");

    all_tasks.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const tasks_list = [];
        snapshot.forEach((task_obj) => {
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
      } else {
        setDataState(false);
        console.log("Data Snapshot is null");
      }
    });
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View>
        {dataState && (
          <FlatList
            style={{ flexGrow: 0 }}
            ListFooterComponent={<View style={{ height: 70 }} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            numColumns={1}
            keyExtractor={(item) => item.time}
            data={tasks}
            renderItem={({ item }) => (
              <TaskComponent
                pushkey={item.key}
                task_title={item.task_title}
                days={item.days}
                time={item.time}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default TasksScreen;

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
