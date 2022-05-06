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
import DoneRoutineDayComponent from "../components/DoneRoutineDayComponent";

const DoneRoutineDaysScreen = () => {
  const navigation = useNavigation();
  const [routineDays, setRoutineDays] = useState([]);
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_routine_days = db.ref("users/" + uid + "/routine_days");

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
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.routine_header}>
        <Text style={{ color: "white", left: 20 }}>
          Days of Routine that you completed!
        </Text>
      </View>

      <View>
        {dataState && (
          <FlatList
            ListFooterComponent={<View style={{ height: 100 }} />}
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
});
