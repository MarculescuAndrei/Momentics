import { View, Text, StyleSheet, Alert, Switch } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { auth, db } from "../firebase";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ToDoComponent = ({
  pushkey,
  details,
  dueDate,
  importance,
  task,
  time,
  isDone,
}) => {
  const [switchValue, setSwitchValue] = useState(isDone === "true");
  const uid = auth.currentUser.uid;
  const todo_obj = db.ref("users/" + uid + "/todos/" + pushkey);
  const navigation = useNavigation();

  const toggleSwitch = () => {
    if (switchValue == true) {
      setSwitchValue(false);
      todo_obj.update({
        isDone: "false",
      });
    } else if (switchValue == false) {
      setSwitchValue(true);
      todo_obj.update({
        isDone: "true",
      });
    }
  };

  const recalculateDate = (dueDate) => {
    var splitted_date = dueDate.split(" / ");
    var today = new Date();
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
    var date_info = splitted_date[2] + "-" + month + "-" + day;

    if (new Date(date_info.toString()) > today) {
      return false;
    } else {
      return true;
    }
  };

  const handleDelete = () => {
    const uid = auth.currentUser.uid;
    var all_todos = db.ref("users/" + uid + "/todos");
    all_todos.child(pushkey).remove();
  };

  function getImportance(importance, isDone) {
    if (importance == "Critical" && isDone == "false") {
      return 1;
    }
    if (importance == "Important" && isDone == "false") {
      return 2;
    }
    if (importance == "Normal" && isDone == "false") {
      return 3;
    }
    if (isDone == "true") {
      return 4;
    }
  }

  const handleEdit = () => {
    navigation.navigate("EditTodoScreen", {
      task: task,
      details: details,
      key: pushkey,
      dueDate: dueDate,
      importance: importance,
    });
  };

  const handleAlert = () => {
    return Alert.alert(
      "Are your sure you want to delete this To-Do?",
      "It'll be gone forever..",
      [
        {
          text: "Yes",
          onPress: () => {
            handleDelete();
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <View
      key={pushkey}
      style={[
        styles.container,
        getImportance(importance, isDone) == 1
          ? styles.critical_border
          : styles.empty_border,
        getImportance(importance, isDone) == 2
          ? styles.important_border
          : styles.empty_border,
        getImportance(importance, isDone) == 3
          ? styles.normal_border
          : styles.empty_border,
        getImportance(importance, isDone) == 4
          ? styles.done_border
          : styles.empty_border,
      ]}
    >
      <View style={styles.task}>
        <Text style={styles.tasktitle}>{task}</Text>
      </View>

      <Switch
        style={styles.switch}
        thumbColor="#9effdd"
        onValueChange={toggleSwitch}
        value={switchValue}
      />

      <View style={styles.importance_view}>
        <Text
          style={[
            getImportance(importance, isDone) == 1
              ? styles.critical_text
              : styles.empty_text,
            getImportance(importance, isDone) == 2
              ? styles.important_text
              : styles.empty_text,
            getImportance(importance, isDone) == 3
              ? styles.normal_text
              : styles.empty_text,
            getImportance(importance, isDone) == 4
              ? styles.done_text
              : styles.empty_text,
          ]}
        >
          {importance}
        </Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={4}>{details}</Text>
      </View>

      <View style={styles.late_text}>
        {recalculateDate(dueDate) ? (
          <Text style={{ color: "orange" }}>Late</Text>
        ) : null}
      </View>

      <View style={styles.date}>
        <Text style={styles.textdate}>Due in {dueDate}</Text>
      </View>

      <View style={styles.deletebutton}>
        <TouchableOpacity onPress={handleAlert}>
          <MaterialIcons name="delete" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.editbutton}>
        <TouchableOpacity onPress={handleEdit}>
          <Feather name="edit" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ToDoComponent;

const styles = StyleSheet.create({
  switch: {
    marginTop: 5,
    position: "absolute",
    top: 17,
    right: 5,
  },

  task: {
    padding: 10,
    left: 5,
    justifyContent: "flex-start",
    position: "absolute",
  },

  content: {
    right: 5,
    paddingTop: 15,
    alignItems: "flex-start",
  },

  date: {
    position: "absolute",
    top: 75,
    right: 10,
  },

  textdate: {
    color: "#5e5e5e",
    fontSize: 11,
  },

  late_text: {
    position: "absolute",
    top: 72,
    left: 170,
  },

  tasktitle: {
    fontSize: 15,
    fontWeight: "bold",
  },

  deletebutton: {
    position: "absolute",
    zIndex: 9900,
    width: 30,
    height: 100,
    top: 70,
    left: 9,
  },

  editbutton: {
    position: "absolute",
    zIndex: 9900,
    width: 30,
    height: 100,
    top: 71.5,
    left: 36,
  },

  critical_border: {
    elevation: 3,
    borderRightWidth: 6,
    borderColor: "red",
  },

  important_border: {
    elevation: 3,
    borderRightWidth: 6,
    borderColor: "#b95eff",
  },

  normal_border: {
    elevation: 3,
    borderRightWidth: 6,
    borderColor: "#ffd000",
  },

  done_border: {
    elevation: 3,
    borderRightWidth: 6,
    borderColor: "green",
  },

  empty_border: {},

  importance_view: {
    position: "absolute",
    bottom: 75,
    right: 10,
  },

  critical_text: { color: "red" },
  important_text: { color: "#b95eff" },
  normal_text: { color: "#ffd000" },
  done_text: { color: "green" },
  empty_text: {},

  container: {
    borderRightWidth: 6,
    borderColor: "red",
    width: 315,
    height: 100,
    borderRadius: 7,
    margin: 10,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#ededed",
    elevation: 4,
  },
});
