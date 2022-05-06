import { View, Text, StyleSheet, Alert, FlatList } from "react-native";
import React from "react";

import { TouchableOpacity } from "react-native"; //sometimes touch opac needs to be imported from react-native not gestures
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import EditNote from "../editScreens/EditNoteScreen";
import { useEffect } from "react/cjs/react.production.min";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const DayComponent = ({ day, tasks }) => {
  const navigation = useNavigation();

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date(new Date().valueOf());

  function daysMaker(days) {
    var days_string = "";
    days.forEach((day) => {
      days_string = days_string + " " + day;
    });
    return days_string;
  }

  function heightMaker(tasks) {
    var height = tasks.length * 45;

    if (tasks.length == 1) {
      return 80;
    }
    if (tasks.length == 2) {
      return 90;
    }
    if (tasks.length == 3) {
      return 110;
    }
    if (tasks.length == 4) {
      return 135;
    }
    if (tasks.length == 5) {
      return 150;
    }
    if (tasks.length == 6) {
      return 170;
    }
    if (tasks.length == 7) {
      return 195;
    }
    if (tasks.length == 8) {
      return 205;
    }
    if (tasks.length == 9) {
      return 225;
    }
    if (tasks.length == 10) {
      return 250;
    }
    if (tasks.length > 10) {
      return tasks.length * 27;
    }
  }

  // de pus height dinamic cu functie ca aici: https://stackoverflow.com/questions/29363671/can-i-make-dynamic-styles-in-react-native

  return (
    <View>
      {tasks.length > 0 ? (
        <View
          style={[
            styles.container,
            {
              height: heightMaker(tasks),
            },
          ]}
        >
          <View style={styles.title}>
            <Text
              style={[
                styles.texttitle,
                day == days[today.getDay()]
                  ? styles.current_day
                  : styles.normal_day,
              ]}
            >
              {day}
            </Text>
          </View>

          {day == days[today.getDay()] ? (
            <MaterialIcons
              style={styles.today}
              name="today"
              size={27}
              color="#62de81"
            />
          ) : null}

          <View style={styles.content}>
            {tasks.map((n) => (
              <Text style={styles.content_text} key={n.toString()}>
                {n.toString()}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default DayComponent;

const styles = StyleSheet.create({
  title: {
    padding: 10,
    left: 6,
    justifyContent: "flex-end",
    position: "absolute",
  },

  current_day: {
    color: "#62de81",
  },

  normal_day: {
    color: "white",
  },

  today: {
    justifyContent: "center",
    alignItems: "flex-end",
    top: 13,
    right: 13,
    position: "absolute",
  },

  content: {
    right: 4,
    bottom: 40,
    marginTop: 20,
    alignItems: "flex-start",
  },

  content_text: {
    fontSize: 13,
    left: 1,
    color: "white",
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
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#1a1a1a",
    elevation: 4,
    borderLeftWidth: 5,
    borderColor: "#4f81ff",
  },
});
