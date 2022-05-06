import { View, Text, StyleSheet, Alert, FlatList, Switch } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native"; //sometimes touch opac needs to be imported from react-native not gestures
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import EditNote from "../editScreens/EditNoteScreen";
import { useEffect } from "react/cjs/react.production.min";

const DailyTaskComponent = ({ task_title, pushkey, isDoneForToday }) => {
  const navigation = useNavigation();

  const [switchValue, setSwitchValue] = useState(isDoneForToday === "true");
  const task_obj = db.ref(
    "users/" + auth.currentUser.uid + "/tasks/" + pushkey
  );

  const toggleSwitch = () => {
    if (switchValue == true) {
      setSwitchValue(false);

      task_obj.update({
        isDoneForToday: false,
      });
    } else if (switchValue == false) {
      setSwitchValue(true);
      console.log(switchValue);
      task_obj.update({
        isDoneForToday: true,
      });
    }
  };

  const thumbColorOn = "#62de81";
  const thumbColorOff = "#4f81ff";

  function makeContainer() {
    if (switchValue) {
      return { borderColor: "#62de81" };
    } else {
      return { borderColor: "#4f81ff" };
    }
  }

  return (
    <View key={pushkey}>
      <View style={[styles.container, makeContainer()]}>
        <View style={styles.title}>
          <Text style={styles.texttitle}>{task_title}</Text>
        </View>

        <Switch
          style={styles.switch}
          thumbColor={switchValue ? thumbColorOn : thumbColorOff}
          onValueChange={toggleSwitch}
          value={switchValue}
        />
      </View>
    </View>
  );
};

export default DailyTaskComponent;

const styles = StyleSheet.create({
  title: {
    padding: 10,
    left: 5,
    justifyContent: "flex-start",
    position: "absolute",
  },

  switch: {
    position: "absolute",
    right: 10,
  },

  content: {
    right: 4,
    bottom: 40,
    marginTop: 20,
    alignItems: "flex-start",
  },

  content_text: {
    fontSize: 12,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  container: {
    height: 50,
    width: 320,
    borderRadius: 6.7,
    margin: 10,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderLeftWidth: 4,
    borderColor: "#4f81ff",
  },
});
