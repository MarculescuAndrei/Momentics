import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import WeatherWidget from "../components/WeatherWidget";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import DailyTaskComponent from "../components/DailyTaskComponent";
import NoteComponent from "../components/NoteComponent";
import ToDoComponent from "../components/ToDoComponent";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import TipComponent from "../components/TipComponent";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [dataState, setDataState] = useState();
  const isFocused = useIsFocused();

  const [location, setLocation] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const [temp, setTemp] = useState("Unknown");
  const [icon, setIcon] = useState("01d");
  const [city, setCity] = useState("Unknown");

  const [dayTasks, setDayTasks] = useState([]);
  const [dayCompleted, setDayCompleted] = useState(false);
  const [showNoTasks, setShowNoTasks] = useState(false);
  const [missedDays, setMissedDays] = useState(0);
  const [lastRoutineDay, setLastRoutineDay] = useState("");
  const [notes, setNotes] = useState([]);
  const [notesState, setNotesState] = useState(false);

  const [toDos, setToDos] = useState([]);
  const [todosState, setTodosState] = useState(false);

  const route = useRoute();

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  //disable back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    if (route.name == "Home") {
      return () => backHandler.remove();
    }
  }, [isFocused]);

  //read name function, triggers everytime the screen is in Focus
  useEffect(() => {
    db.ref("users/" + auth.currentUser.uid + "/name").once(
      "value",
      (snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val().name);
        } else {
          setDataState(false);
          console.log("Data Snapshot is null");
        }
      }
    );
  }, [isFocused]);

  //get location coordinates
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords).then(
        fetchWeather(location.coords.latitude, location.coords.longitude)
      );
      setLocation(location);
      setCity(address[0].city);
    })();
  }, [isFocused]);

  //fetch weather data
  async function fetchWeather(latitude, longitude) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=0ed48c13f6e5613ada2a141e010784c3&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        setTemp(json.main.temp);
        setIcon(json.weather[0].icon);
        getAllTasks(json.weather[0].description);
      });

    return;
  }

  //function to delay use effect
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //function that reads all tasks exactly when the weather condition is extracted.
  function getAllTasks(condition) {
    const uid = auth.currentUser.uid;
    const today = new Date(new Date().valueOf());
    var all_tasks = db.ref("users/" + uid + "/tasks");

    all_tasks.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const tasks_list = [];
        snapshot.forEach((task_obj) => {
          task_obj.val().days.forEach((task_day) => {
            if (task_day == days[today.getDay()]) {
              if (condition != "Unknown") {
                tasks_list.push({
                  key: task_obj.key,
                  task_title: task_obj.val().task,
                  days: task_obj.val().days,
                  time: task_obj.val().time,
                  isDoneForToday: task_obj.val().isDoneForToday,
                  isOutdoors: task_obj.val().isOutdoors,
                  condition: condition,
                });
              }
            }
          });
        });
        setDataState(true);
        setDayTasks(tasks_list);
      } else {
        setDataState(false);
        console.log("Data Snapshot is null");
      }
    });
  }

  //read todos, notes and more
  useEffect(async () => {
    await delay(200);
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");
    var all_notes = db.ref("users/" + uid + "/notes");
    var all_todos = db.ref("users/" + uid + "/todos");
    var routine_info = db.ref("users/" + uid + "/routine");

    const today = new Date(new Date().valueOf());
    const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);

    // read nr of days missed and get last routine day to calculate in case some days are missed
    routine_info.once("value", (snapshot) => {
      if (snapshot.exists()) {
        setMissedDays(snapshot.val().missed_routine_days);
        setLastRoutineDay(snapshot.val().last_routine_day);
      } else {
        console.log("Data Snapshot is null");
      }
    });

    // read all notes from db
    all_notes.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const notes_list = [];
        snapshot.forEach((note_obj) => {
          notes_list.push({
            key: note_obj.key,
            title: note_obj.val().title,
            note: note_obj.val().note,
            time: note_obj.val().time,
          });
        });
        setNotes(notes_list);
        setNotesState(true);
      } else {
        console.log("Data Snapshot is null");
        setNotesState(false);
      }
    });

    // read critical ToDos
    all_todos.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const todos_list = [];
        snapshot.forEach((todo_obj) => {
          if (
            todo_obj.val().isDone == "false" &&
            todo_obj.val().importance == "Critical"
          ) {
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
        if (todos_list.length > 0) {
          setTodosState(true);
        } else {
          setTodosState(false);
        }

        setToDos(todos_list);
      } else {
        setTodosState(false);
        console.log("Data Snapshot is null");
      }
    });

    // verifies if day was completed today, or if it needs to reset after midnight, or if the user resetted the routine before
    db.ref("users/" + uid + "/routine").once("value", (snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().last_routine_day == today.toString().slice(0, 15)) {
          setDayCompleted(true);
        } else if (
          snapshot.val().last_routine_day == yesterday.toString().slice(0, 15)
        ) {
          setDayCompleted(false);
        } else if (
          new Date(snapshot.val().last_routine_day.toString().slice(0, 15)) <
          new Date(yesterday.toString().slice(0, 15))
        ) {
          finishDay("reset_mode");
          setDayCompleted(false);
        } else if (snapshot.val().last_routine_day == "resetted" && dataState) {
          setDayCompleted(false);
          var routine_info = db.ref("users/" + uid + "/routine");
          routine_info.set({
            last_routine_day: yesterday.toString().slice(0, 15),
            missed_routine_days: 0,
          });
        }
      } else {
        console.log("Data Snapshot is null");
      }
    });

    // if today has no tasks then show special card
    if (dayTasks.length == 0) {
      setShowNoTasks(true);
    }
  }, [isFocused]);

  // function to get time remaining until reset of tasks
  function minsToMidnight() {
    var now = new Date();
    var then = new Date(now);
    then.setHours(24, 0, 0, 0);
    var minutes = (then - now) / 6e4;
    return (
      Math.floor(minutes / 60).toString() +
      ":" +
      Math.floor((Math.floor(minutes / 60) * 60 - minutes) * -1).toString()
    );
  }

  // function to finish the current day of routine
  const finishDay = (mode = "finish_mode") => {
    var now = new Date();
    var done_tasks = 0;
    var all_tasks = db.ref("users/" + auth.currentUser.uid + "/tasks");

    all_tasks.once("value", (snapshot) => {
      if (snapshot.exists()) {
        dayTasks.forEach((task_obj) => {
          task_obj_ref = db.ref(
            "users/" +
              auth.currentUser.uid +
              "/tasks/" +
              task_obj.key.toString()
          );
          task_obj_ref.update({
            isDoneForToday: false,
          });
        });
      } else {
        console.log("Data Snapshot is null");
      }
    });

    if (mode == "reset_mode") {
      // de verificat dc nu merge uneori diferenta, pot sa fac split-ul ala
      var yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
      var difference = Math.abs(yesterday - new Date(lastRoutineDay).getTime());

      // const date1 = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
      // const date2 = new Date(lastRoutineDay);

      // const diffTime = Math.abs(date2 - date1);
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log(Math.ceil(difference / (1000 * 3600 * 24)));

      // console.log(new Date(lastRoutineDay).getTime());
      // console.log(new Date(yesterday.toString().slice(0, 15)).getTime());

      db.ref("users/" + auth.currentUser.uid + "/routine").set({
        last_routine_day: yesterday.toString().slice(0, 15),
        missed_routine_days:
          missedDays + Math.ceil(difference / (1000 * 3600 * 24)),
      });

      setDayCompleted(false);
    } else {
      dayTasks.forEach((task_obj) => {
        if (task_obj.isDoneForToday == true) {
          done_tasks = done_tasks + 1;
        }
      });

      setDayCompleted(true);

      // update last day of done routine
      var today = new Date(new Date().valueOf());
      db.ref("users/" + auth.currentUser.uid + "/routine").set({
        last_routine_day: today.toString().slice(0, 15),
        missed_routine_days: missedDays,
      });

      var date = new Date();
      db.ref("users/" + auth.currentUser.uid + "/routine_days").push({
        tasks_done: done_tasks.toString() + "/" + dayTasks.length.toString(),
        day: date.getDate(),
        month: months[new Date().getMonth()],
      });
    }
  };

  // routing functions
  const startFocus = () => {
    navigation.navigate("FocusScreen");
  };

  const takeNotes = () => {
    navigation.navigate("AddNoteScreen");
  };

  const makeTodos = () => {
    navigation.navigate("AddToDoScreen");
  };

  const addTasks = () => {
    navigation.navigate("AddTaskScreen");
  };

  return (
    <View style={styles.big_container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#4287f5", "#545454"]}
        start={{ x: -0.6, y: -0.6 }}
        style={styles.background}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcome}>
          Welcome,{"\n"}
          {name}
        </Text>

        <View style={styles.widget_view}>
          <WeatherWidget temp={temp} icon={icon} city={city} />
        </View>

        {!dayCompleted && dataState ? (
          <View>
            <View style={{ left: 12 }}>
              {dayTasks.length > 0 ? (
                <View style={styles.task_header}>
                  <Text style={{ color: "white", elevation: 3 }}>
                    Here's what your day looks like
                  </Text>
                </View>
              ) : (
                <View style={styles.routine_header}>
                  <Text style={{ color: "white", left: 20 }}>
                    No tasks for today!
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.tasks_view}>
              {dayTasks.map((item) => {
                return (
                  <DailyTaskComponent
                    task_title={item.task_title}
                    pushkey={item.key}
                    key={item.key}
                    isDoneForToday={item.isDoneForToday}
                    isOutdoors={item.isOutdoors}
                    condition={item.condition}
                  />
                );
              })}
            </View>
            <View style={styles.routine_functions}>
              <View style={styles.midnight_countdown}>
                <Text style={{ color: "white" }}>
                  Time Until Reset: {minsToMidnight()}h
                </Text>
              </View>

              <TouchableOpacity
                style={styles.finish_button}
                onPress={finishDay}
              >
                <Text style={{ color: "black" }}>Finish Day</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            {dataState ? (
              <>
                <View style={styles.routine_header}>
                  <Text style={{ color: "white", left: 20 }}>
                    Come back tomorrow!
                  </Text>
                </View>

                <View style={styles.midnight_countdown}>
                  <Text style={{ color: "white" }}>
                    Time Until Reset: {minsToMidnight()}
                  </Text>
                </View>
              </>
            ) : (
              <TouchableOpacity
                style={styles.routine_header}
                onPress={addTasks}
              >
                <Text style={{ color: "white", left: 20 }}>
                  Start by adding some daily tasks!
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {todosState ? (
          <View>
            <Text
              style={{
                color: "white",
                elevation: 3,
                top: 10,
                left: 11,
                marginTop: 10,
              }}
            >
              Your Critical ToDo's :
            </Text>
            <View style={styles.todos_view}>
              {toDos.map((item) => {
                return (
                  <ToDoComponent
                    key={item.key}
                    pushkey={item.key}
                    details={item.details}
                    task={item.task}
                    importance={item.importance}
                    dueDate={item.dueDate}
                    time={item.time.slice(0, 14)}
                    isDone={item.isDone}
                  />
                );
              })}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.todos_header} onPress={makeTodos}>
            <Text style={{ color: "white", left: 20 }}>
              Add Critical ToDo's
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.focus_header} onPress={startFocus}>
          <Text style={{ color: "white", left: 24 }}>Start Focusing </Text>
          <Entypo
            name="circle"
            size={24}
            color="#62de81"
            style={{ position: "absolute", left: 130, bottom: 12 }}
          />
        </TouchableOpacity>

        {notesState ? (
          <View style={styles.notes_view}>
            {notes.map((item) => {
              return (
                <NoteComponent
                  key={item.key}
                  pushkey={item.key}
                  time={item.time.slice(0, 14)}
                  note={item.note}
                  title={item.title}
                />
              );
            })}
          </View>
        ) : (
          <TouchableOpacity style={styles.notes_header} onPress={takeNotes}>
            <Text style={{ color: "white", left: 20 }}>Take some Notes!</Text>
          </TouchableOpacity>
        )}

        <TipComponent />

        {notesState && todosState ? (
          <View style={{ marginTop: 10, flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.buttonExtra, { borderBottomColor: "#e8b02e" }]}
              onPress={takeNotes}
            >
              <Text style={styles.buttonTextExtra}>Write Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonExtra, { borderBottomColor: "#62de81" }]}
              onPress={makeTodos}
            >
              <Text style={styles.buttonTextExtra}>Add ToDo</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },

  buttonExtra: {
    elevation: 4,
    margin: 15,
    backgroundColor: "#1f1f1f",
    width: 145,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
  },

  buttonTextExtra: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },

  task_header: { marginTop: 25, left: 15 },

  midnight_countdown: {
    marginTop: 15,
    marginRight: 30,
    height: 50,
    width: 190,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "white",
    borderLeftWidth: 4,
  },

  finish_button: {
    marginTop: 15,
    height: 50,
    width: 100,
    backgroundColor: "#ededed",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: "#1a1a1a",
    borderRightWidth: 3,
  },

  routine_functions: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },

  notes_view: {
    left: 16,
    width: "100%",
    marginTop: 10,
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
  },

  todos_view: {
    width: "100%",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  tasks_view: {
    left: 2,
  },

  routine_header: {
    justifyContent: "center",
    marginTop: 20,
    height: 50,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#4f81ff",
  },

  notes_header: {
    justifyContent: "center",
    marginTop: 20,
    height: 50,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#e8b02e",
  },

  todos_header: {
    justifyContent: "center",
    marginTop: 20,
    height: 50,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "red",
  },

  focus_header: {
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 20,
    height: 50,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#62de81",
  },

  welcome: {
    fontSize: 18,
    color: "white",
    top: 12,
    right: 31,
  },

  big_container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#545454",
  },

  widget_view: {
    left: 28,
    bottom: 45,
  },
});
