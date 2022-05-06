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
  Button,
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
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { set } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

const FocusScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(10);
  const [workTime, setWorkTime] = useState(10);
  const [relaxTime, setRelaxTime] = useState(10);
  const [cycles, setCycles] = useState(0);
  const [pushkey, setPushKey] = useState(null);
  const [key, setKey] = useState(0);
  const [workStatus, setWorkStatus] = useState(true);

  // read
  useEffect(() => {
    db.ref("users/" + auth.currentUser.uid + "/focus").once(
      "value",
      (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((time_obj) => {
            setPushKey(time_obj.key);
            setWorkTime(time_obj.val().worktime);
            setRelaxTime(time_obj.val().relaxtime);
            setCycles(time_obj.val().cycles);
          });
        } else {
          console.log("Data Snapshot is null");
        }
      }
    );
    console.log(workTime);
    setDuration(workTime);
    setKey((prevKey) => prevKey + 1);
    setIsPlaying(false);
    setWorkStatus(true);
  }, [isFocused]);

  //handle restart
  function handleDuration(workStatus) {
    if (workStatus == true) {
      return workTime;
    }
    if (workStatus == false) {
      return relaxTime;
    }
  }

  //handle edit
  const handleEdit = () => {
    navigation.navigate("EditFocusScreen", {
      workTime: workTime,
      relaxTime: relaxTime,
      key: pushkey,
    });
  };

  //read and update cycles
  const increaseCycles = () => {
    const focus_obj = db.ref(
      "users/" + auth.currentUser.uid + "/focus/" + pushkey
    );
    if (workStatus == true) {
      setCycles(cycles + 1);
      focus_obj.update({
        cycles: cycles + 1,
      });
    }
  };

  // render minutes:seconds
  function renderSeconds(remainingTime) {
    if (remainingTime - Math.floor(remainingTime / 60) * 60 == 0) {
      return "00";
    } else if (remainingTime - Math.floor(remainingTime / 60) * 60 < 10) {
      return (
        "0" + (remainingTime - Math.floor(remainingTime / 60) * 60).toString()
      );
    } else {
      return (remainingTime - Math.floor(remainingTime / 60) * 60).toString();
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <CountdownCircleTimer
          key={key}
          isPlaying={isPlaying}
          duration={handleDuration(workStatus)}
          colors={["#4ddb73", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => {
            setKey((prevKey) => prevKey + 1);
            increaseCycles();
            setWorkStatus(!workStatus);
            return { shouldRepeat: true, delay: 1.5 };
          }}
        >
          {({ remainingTime, color }) => (
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 40, color: "white" }}>
                {Math.floor(remainingTime / 60)}:{renderSeconds(remainingTime)}
              </Text>
              <Text style={{ color: "white", fontSize: 17 }}>
                {workStatus ? "Focus" : "Relax"}
              </Text>
            </View>
          )}
        </CountdownCircleTimer>
      </View>

      <TouchableOpacity style={styles.settings_button} onPress={handleEdit}>
        <Ionicons name="settings-sharp" size={35} color="black" />
      </TouchableOpacity>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsPlaying((prev) => !prev)}
        >
          <Text style={{ color: "white" }}>Start/Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setKey((prevKey) => prevKey + 1)}
        >
          <Text style={{ color: "white" }}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cycleswidget}>
        <Text style={{ color: "white" }}>
          You've done <Text style={{ color: "#4ddb73" }}>{cycles}</Text>{" "}
          Pomodoro Cycles
        </Text>
      </View>
    </View>
  );
};

export default FocusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#666666",
  },

  cycleswidget: {
    width: "70%",
    backgroundColor: "#1f1f1f",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    alignItems: "center",
  },

  settings_button: {
    elevation: 3,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    position: "absolute",
    bottom: 30,
    right: 20,
    height: 70,
    backgroundColor: "white",
    borderRadius: 15,
    zIndex: 3,
  },

  buttons: {
    flexDirection: "row",
    width: "80%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "40%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
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
