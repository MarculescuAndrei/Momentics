import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native"; //sometimes touch opac needs to be imported from react-native not gestures
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import EditNote from "../editScreens/EditNoteScreen";
import { useEffect } from "react/cjs/react.production.min";

const TaskComponent = ({ pushkey, task_title, days, time }) => {
  const navigation = useNavigation();
  // const handleEditPress = () => {
  //   navigation.navigate("EditTaskScreen", {
  //     title: title,
  //     note: note,
  //     key: pushkey,
  //   });
  // };

  function daysMaker(days) {
    var days_string = "";
    days.forEach((day) => {
      days_string = days_string + " " + day;
    });
    return days_string;
  }

  function heightMaker(days) {
    if (days.length > 4) {
      return 85;
    } else {
      return 65;
    }
  }

  const handleDelete = () => {
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");
    all_tasks.child(pushkey).remove();
  };

  const handleAlert = () => {
    return Alert.alert(
      "Are your sure you want to delete this Task?",
      "It'll be gone forever..",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            handleDelete();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.navigate("EditTaskScreen", {
      task: task_title,
      key: pushkey,
      days: days,
    });
  };

  return (
    <TouchableOpacity
      key={time}
      style={[styles.container, { height: heightMaker(days) }]}
      onPress={handleEdit}
    >
      <View style={styles.title}>
        <Text style={styles.texttitle}>
          {task_title}
          {/* {task_title.length > 15 ? task_title.slice(0, 15) + ".." : task_title} */}
        </Text>
      </View>

      {/* <View style={styles.content}>
        <Text style={styles.content_text}>{daysMaker(days)}</Text>
      </View> */}

      <View style={styles.content}>
        <FlatList
          numColumns={4}
          data={days}
          renderItem={({ item }) => (
            <Text style={{ color: "gray" }}>{item} </Text>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>

      <View style={styles.deletebutton}>
        <TouchableOpacity onPress={handleAlert}>
          <MaterialIcons name="delete" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default TaskComponent;

const styles = StyleSheet.create({
  title: {
    padding: 10,
    left: 5,

    position: "absolute",
  },

  content: {
    right: 4.3,
    top: 11,
  },

  content_text: {
    fontSize: 11,
    color: "#6b6b6b",
  },

  date: {
    position: "absolute",
    top: 120,
    right: 10,
  },

  textdate: {
    color: "#5e5e5e",
    fontSize: 11,
  },

  texttitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "bold",
  },

  deletebutton: {
    position: "absolute",
    zIndex: 400,
    width: 40,
    height: 100,
    top: 17,
    left: 270,
  },

  container: {
    width: 300,
    borderRadius: 6.7,
    margin: 10,
    padding: 20,

    backgroundColor: "#ededed",
    elevation: 4,
    borderBottomWidth: 6,
    borderColor: "#4f81ff",
  },
});
