import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  View,
  SafeAreaView,
  BackHandler,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import WeatherWidget from "../components/WeatherWidget";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import { add, and } from "react-native-reanimated";
import DailyTaskComponent from "../components/DailyTaskComponent";
import NoteComponent from "../components/NoteComponent";
import ToDoComponent from "../components/ToDoComponent";
import { Entypo } from "@expo/vector-icons";

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

  const [notes, setNotes] = useState([]);
  const [notesState, setNotesState] = useState(false);

  const [toDos, setToDos] = useState([]);
  const [todosState, setTodosState] = useState(false);

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
    return () => backHandler.remove();
  }, []);

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
  }, []);

  //fetch weather data
  function fetchWeather(latitude, longitude) {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=0ed48c13f6e5613ada2a141e010784c3&units=metric`
    )
      .then((res) => res.json())
      .then((json) => {
        setTemp(json.main.temp);
        setIcon(json.weather[0].icon);
      });
  }

  //read tasks, notes and more
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");
    var all_notes = db.ref("users/" + uid + "/notes");
    var all_todos = db.ref("users/" + uid + "/todos");

    const today = new Date(new Date().valueOf());
    const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24);
    const day_before_yesterday = new Date(
      new Date().valueOf() - 1000 * 60 * 60 * 48
    );

    db.ref("users/" + uid + "/routine").once("value", (snapshot) => {
      if (snapshot.exists()) {
        // verifies if day was completed today, or if it needs to reset after midnight

        if (snapshot.val().last_routine_day == today.toString().slice(0, 15)) {
          setDayCompleted(true);
        } else if (
          snapshot.val().last_routine_day == yesterday.toString().slice(0, 15)
        ) {
          setDayCompleted(false);
          console.log(dayCompleted);
        } else if (
          snapshot.val().last_routine_day ==
          day_before_yesterday.toString().slice(0, 15)
        ) {
          finishDay();
          setDayCompleted(false);

          setDayCompleted(false);
          console.log(dayCompleted);
        }
      } else {
        console.log("Data Snapshot is null");
      }
    });

    // read all tasks for current day from db
    all_tasks.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const tasks_list = [];
        snapshot.forEach((task_obj) => {
          task_obj.val().days.forEach((task_day) => {
            if (task_day == days[today.getDay()]) {
              tasks_list.push({
                key: task_obj.key,
                task_title: task_obj.val().task,
                days: task_obj.val().days,
                time: task_obj.val().time,
                isDoneForToday: task_obj.val().isDoneForToday,
              });
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

    // read all notes from db
    all_notes.on("value", (snapshot) => {
      if (snapshot.exists()) {
        //console.log(Object.keys(snapshot.val()));
        const notes_list = [];
        snapshot.forEach((note_obj) => {
          //console.log(note_obj.key);
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
        setTodosState(true);
        setToDos(todos_list);
      } else {
        setTodosState(false);
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
  const finishDay = () => {
    var now = new Date();
    var done_tasks = 0;
    var all_tasks = db.ref("users/" + auth.currentUser.uid + "/tasks");
    // asta isi ia true si cand se reseteaza doar ca trece ziua ceea ce nu e ok
    console.log(dayTasks);
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

    dayTasks.forEach((task_obj) => {
      if (task_obj.isDoneForToday == true) {
        done_tasks = done_tasks + 1;
      }
    });

    setDayCompleted(true);

    // update last day of done routine
    var new_date = new Date(new Date().valueOf());
    db.ref("users/" + auth.currentUser.uid + "/routine").set({
      last_routine_day: new_date.toString().slice(0, 15),
    });

    var date = new Date();
    db.ref("users/" + auth.currentUser.uid + "/routine_days").push({
      tasks_done: done_tasks.toString() + "/" + dayTasks.length.toString(),
      day: date.getDate(),
      month: months[new Date().getMonth()],
    });

    // console.log(done_tasks.toString() + "/" + dayTasks.length.toString());
  };

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
  // console.log(months[new Date().getMonth()]);

  return (
    <View style={styles.big_container}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>
          Welcome,{"\n"}
          {name}
        </Text>

        <View style={styles.widget_view}>
          <WeatherWidget temp={temp} icon={icon} city={city} />
        </View>

        {!dayCompleted && dataState ? (
          <View>
            {/* {!showNoTasks ? (
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
            )} */}

            <View style={styles.task_header}>
              <Text style={{ color: "white", elevation: 3 }}>
                Here's what your day looks like
              </Text>
            </View>

            <View style={styles.tasksView}>
              {dayTasks.map((item) => {
                return (
                  <DailyTaskComponent
                    task_title={item.task_title}
                    pushkey={item.key}
                    key={item.time}
                    isDoneForToday={item.isDoneForToday}
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
      </ScrollView>
    </View>
  );
};

// ? = tells js that its ok if email is undefined

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#545454",
  },

  tasksView: {},

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
    marginLeft: 10,
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
    backgroundColor: "#666666",
  },

  widget_view: {
    left: 40,
    bottom: 45,
  },

  button: {
    backgroundColor: "#03b1fc",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
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
