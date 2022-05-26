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
import { Entypo } from "@expo/vector-icons";
import ToDoComponent from "../components/ToDoComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ToDoScreen = () => {
  const [toDos, setToDos] = useState([]);
  const navigation = useNavigation();

  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  // navigation functions
  const handleAddToDo = () => {
    navigation.navigate("AddToDoScreen");
  };

  const handleSeeDoneTodos = () => {
    navigation.navigate("DoneTodosScreen");
  };

  // reads all todos that are not done
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_todos = db.ref("users/" + uid + "/todos");

    all_todos.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const todos_list = [];
        snapshot.forEach((todo_obj) => {
          if (todo_obj.val().isDone == "false") {
            todos_list.push({
              key: todo_obj.key,
              task: todo_obj.val().task,
              details: todo_obj.val().details,
              importance: todo_obj.val().importance,
              dueDate: todo_obj.val().dueDate,
              time: todo_obj.val().time,
              isDone: todo_obj.val().isDone,
            });
          }
        });
        setDataState(true);
        setToDos(todos_list);
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
        colors={["#d43939", "#666666"]}
        start={{ x: -1, y: -0.8 }}
        style={styles.background}
      />
      <TouchableOpacity
        style={styles.check_button}
        onPress={handleSeeDoneTodos}
      >
        <MaterialCommunityIcons
          name="clipboard-check-outline"
          size={37}
          color="black"
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.plus_button} onPress={handleAddToDo}>
        <Entypo name="plus" size={44} color="black" />
      </TouchableOpacity>

      <View>
        {dataState ? (
          <View style={styles.todo_header}>
            <Text style={{ color: "white", left: 20 }}>
              These are your important tasks!
            </Text>
          </View>
        ) : (
          <View style={styles.todo_header}>
            <Text style={{ color: "white", left: 20 }}>
              Start by adding some ToDo's.
            </Text>
          </View>
        )}
      </View>

      <View>
        {dataState && (
          <FlatList
            style={{ flexGrow: 0 }}
            ListFooterComponent={<View style={{ height: 240 }} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            numColumns={1}
            keyExtractor={(item) => item.time}
            data={toDos}
            renderItem={({ item }) => (
              <ToDoComponent
                pushkey={item.key}
                details={item.details}
                task={item.task}
                importance={item.importance}
                dueDate={item.dueDate}
                time={item.time.slice(0, 14)}
                isDone={item.isDone}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ToDoScreen;

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

  todo_header: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    height: 40,
    width: 315,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "red",
  },

  check_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 110,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 3,
  },

  plus_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 3,
  },
});
