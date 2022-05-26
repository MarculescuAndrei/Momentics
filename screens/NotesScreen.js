import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import NoteComponent from "../components/NoteComponent";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";

const NotesScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [notes, setNotes] = useState([]);
  const [dataState, setDataState] = useState();

  // read notes
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_notes = db.ref("users/" + uid + "/notes");

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
      <LinearGradient
        // Background Linear Gradient
        colors={["#e8b02e", "#545454"]}
        start={{ x: -1, y: -0.8 }}
        style={styles.background}
      />
      <TouchableOpacity style={styles.plus_button} onPress={handleAddNote}>
        <SimpleLineIcons name="note" size={25} color="black" />
      </TouchableOpacity>

      <View>
        {dataState ? (
          <View style={styles.note_header}>
            <Text style={{ color: "white", left: 20 }}>
              These are your Notes!
            </Text>
          </View>
        ) : (
          <View style={styles.note_header}>
            <Text style={{ color: "white", left: 20 }}>
              Start by adding some Notes.
            </Text>
          </View>
        )}
      </View>

      <View>
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
    backgroundColor: "#545454",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
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

  note_header: {
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    height: 40,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#e8b02e",
  },

  button: {
    backgroundColor: "#03b1fc",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
});
