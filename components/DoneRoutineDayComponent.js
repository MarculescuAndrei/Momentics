import { View, Text, StyleSheet } from "react-native";
import React from "react";

const DoneRoutineDayComponent = ({ pushkey, day, tasks_done, month }) => {
  return (
    <View key={pushkey} style={styles.container}>
      <Text style={styles.done_tasks}>{tasks_done}</Text>
      <Text
        style={{
          color: "#d1d1d1",
          position: "absolute",
          top: 50,
          marginLeft: 12,
          marginRight: 10,
          fontSize: 11.5,
        }}
      >
        {day} {month.toString().slice(0, 3)}
      </Text>
    </View>
  );
};

export default DoneRoutineDayComponent;

const styles = StyleSheet.create({
  done_tasks: {
    color: "white",
    fontSize: 20,
    position: "absolute",
    left: 15,
    top: 15,
    fontWeight: "bold",
  },
  container: {
    width: 65,
    height: 80,
    borderRadius: 6,
    margin: 10,
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#1a1a1a",
    elevation: 4,
    borderBottomWidth: 4,
    borderColor: "#62de81",
  },
});
