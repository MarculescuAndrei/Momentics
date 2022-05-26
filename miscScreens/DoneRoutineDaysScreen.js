import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import DoneRoutineDayComponent from "../components/DoneRoutineDayComponent";
import { LinearGradient } from "expo-linear-gradient";

const DoneRoutineDaysScreen = () => {
  const [routineDays, setRoutineDays] = useState([]);
  const [missedDays, setMissedDays] = useState(0);
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  // reads all routine days that have been done
  useEffect(() => {
    let isCancelled = false;
    const uid = auth.currentUser.uid;
    var all_routine_days = db.ref("users/" + uid + "/routine_days");
    var routine_info = db.ref("users/" + uid + "/routine");

    routine_info.once("value", (snapshot) => {
      if (snapshot.exists()) {
        setMissedDays(snapshot.val().missed_routine_days);
      } else {
        console.log("Data Snapshot is null");
      }
    });

    all_routine_days.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const routine_days_list = [];
        snapshot.forEach((routine_day_obj) => {
          routine_days_list.push({
            key: routine_day_obj.key,
            day: routine_day_obj.val().day,
            tasks_done: routine_day_obj.val().tasks_done,
            month: routine_day_obj.val().month,
          });
        });
        setDataState(true);
        setRoutineDays(routine_days_list);
      } else {
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
        colors={["#4287f5", "#666666"]}
        start={{ x: -1, y: -0.8 }}
        style={styles.background}
      />
      <View style={styles.routine_header}>
        <Text style={{ color: "white", left: 20 }}>
          Days of Routine that you completed!
        </Text>
      </View>

      <View>
        {dataState && (
          <FlatList
            ListFooterComponent={
              <View style={styles.missed_days_card}>
                <Text style={{ color: "white", left: 20 }}>
                  So far you've missed{" "}
                  <Text style={{ color: "red" }}>{missedDays}</Text> days.
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            numColumns={4}
            keyExtractor={(item) => item.key}
            data={routineDays}
            renderItem={({ item }) => (
              <DoneRoutineDayComponent
                pushkey={item.key}
                day={item.day}
                tasks_done={item.tasks_done}
                month={item.month}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default DoneRoutineDaysScreen;

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

  routine_header: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 30,
    height: 50,
    width: 340,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#62de81",
  },

  missed_days_card: {
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
    height: 50,
    width: 340,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "red",
  },
});
