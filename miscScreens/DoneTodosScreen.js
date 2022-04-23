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

const DoneToDoScreen = () => {
  const [toDos, setToDos] = useState([]);
  const navigation = useNavigation();
  const [name, setName] = useState("");

  const handleAddToDo = () => {
    navigation.navigate("AddToDoScreen");
  };

  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  useEffect(() => {
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
      <View>
        {dataState && (
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
