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

const NotesScreen = () => {
  const [note_prototype, setNotePrototype] = useState("");
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();
  const [dataState, setDataState] = useState();

  //write
  const writeToDb = () => {
    const uid = auth.currentUser.uid;
    var date = new Date();
    var now =
      date.getDate() +
      " - " +
      (date.getMonth() + 1) +
      " - " +
      date.getFullYear() +
      "  " +
      date.getHours() +
      " " +
      date.getSeconds();
    db.ref("users/" + uid + "/notes").push({
      note: note_prototype,
      time: now,
    });
  };

  //read
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_notes = db.ref("users/" + uid + "/notes");

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
        setDataState(true);
      } else {
        console.log("Data Snapshot is null");
        setDataState(false);
      }
    });
  }, [isFocused]);

  const handleAddNote = () => {
    navigation.navigate("AddNoteScreen");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plus_button} onPress={handleAddNote}>
        <Entypo name="plus" size={44} color="black" />
      </TouchableOpacity>

      <View>
        {/* {notes.map((item) => {
          return (
            <View key={item.time}>
              <Text style={styles.note_item}>
                {item.note} - {item.time.slice(0, 14)}
              </Text>
            </View>
          );
        })} */}

        {/* {notes.map((item) => {
          return (
            <NoteComponent time={item.time.slice(0, 14)} note={item.note} />
          );
        })} */}
        {dataState && (
          <FlatList
            ListFooterComponent={<View style={{ height: 150 }} />}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item) => item.time}
            data={notes}
            renderItem={({ item }) => (
              <NoteComponent
                pushkey={item.key}
                time={item.time.slice(0, 14)}
                note={item.note}
                title={item.title}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default NotesScreen;

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

  plus_button: {
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

  note_item: {
    padding: 15,
    fontSize: 11,
    marginTop: 12,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
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
