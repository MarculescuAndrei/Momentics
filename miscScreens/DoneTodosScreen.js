import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import ToDoComponent from "../components/ToDoComponent";
import { LinearGradient } from "expo-linear-gradient";

const DoneToDoScreen = () => {
  const [toDos, setToDos] = useState([]);
  const navigation = useNavigation();

  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  // reads all ToDo's that have done value = true
  useEffect(() => {
    let isCancelled = false;
    const uid = auth.currentUser.uid;
    var all_todos = db.ref("users/" + uid + "/todos");

    all_todos.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const todos_list = [];
        snapshot.forEach((todo_obj) => {
          if (todo_obj.val().isDone == "true") {
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

        setToDos(todos_list);
        if (todos_list.length > 0) {
          setDataState(true);
        }
      } else if (todos_list.length > 0) {
        setDataState(false);
        console.log("Data Snapshot is null");
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#4ddb73", "#666666"]}
        start={{ x: 0, y: -1.5 }}
        style={styles.background}
      />
      <View>
        {dataState ? (
          <FlatList
            style={{ flexGrow: 0 }}
            ListFooterComponent={<View style={{ height: 70 }} />}
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
        ) : (
          <View style={styles.routine_header}>
            <Text style={{ color: "white", left: 20 }}>
              You haven't done a ToDo yet.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DoneToDoScreen;

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
    height: 250,
  },

  routine_header: {
    justifyContent: "center",
    marginTop: 20,
    height: 50,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "red",
  },
});
