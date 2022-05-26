import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import TaskComponent from "../components/TaskComponent";
import { LinearGradient } from "expo-linear-gradient";

const TasksScreen = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  const handleAddTask = () => {
    navigation.navigate("AddTaskScreen");
  };

  // read all individual tasks

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
      <LinearGradient
        // Background Linear Gradient
        colors={["#4287f5", "#666666"]}
        start={{ x: -1, y: -0.8 }}
        style={styles.background}
      />
      <View>
        {dataState && (
          <FlatList
            style={{ flexGrow: 0 }}
            ListFooterComponent={
              <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                <Text style={styles.buttonText}>Add More Tasks</Text>
              </TouchableOpacity>
            }
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

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "95%",
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 3,
    borderColor: "#62de81",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
