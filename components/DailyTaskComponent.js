import { View, Text, StyleSheet, Switch } from "react-native";
import React, { useState } from "react";
import { auth, db } from "../firebase";

const DailyTaskComponent = ({
  task_title,
  pushkey,
  isDoneForToday,
  isOutdoors,
  condition,
}) => {
  const [switchValue, setSwitchValue] = useState(isDoneForToday === "true");
  const conditions = [
    "clear sky",
    "broken clouds",
    "shower rain",
    "rain",
    "thunderstorm",
    "snow",
    "mist",
  ];

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

  function getCondition(condition, isOutdoors) {
    if (conditions.includes(condition) && isOutdoors) {
      return { height: 64 };
    } else {
      return { height: 50 };
    }
  }

  return (
    <View key={pushkey}>
      <View
        style={[
          styles.container,
          makeContainer(),
          getCondition(condition, isOutdoors),
        ]}
      >
        <View style={styles.title}>
          <Text style={styles.texttitle}>{task_title}</Text>
        </View>

        {conditions.includes(condition) && isOutdoors ? (
          <Text style={styles.weather_warning}>Weather Warning</Text>
        ) : null}

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

  weather_warning: {
    fontSize: 11.5,
    top: 37,
    left: 15.5,
    color: "#fc7f03",
    position: "absolute",
  },

  switch: {
    position: "absolute",
    right: 10,
  },

  texttitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  container: {
    height: 58,
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
