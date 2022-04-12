import { View, Text, StyleSheet, Alert } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";

const NoteComponent = ({ pushkey, time, note, title }) => {
  const handleDelete = () => {
    const uid = auth.currentUser.uid;
    var all_notes = db.ref("users/" + uid + "/notes");
    all_notes.child(pushkey).remove();
  };

  const handleAlert = () => {
    return Alert.alert(
      "Are your sure you want to delete this Note?",
      "It'll be gone forever..",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            handleDelete();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <View key={time} style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.texttitle}>{title}</Text>
      </View>
      <View style={styles.content}>
        <Text numberOfLines={4}>{note}</Text>
      </View>
      <View style={styles.date}>
        <Text style={styles.textdate}>{time}</Text>
      </View>

      <View style={styles.deletebutton}>
        <TouchableOpacity onPress={handleAlert}>
          <MaterialIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoteComponent;

const styles = StyleSheet.create({
  title: {
    padding: 15,
    left: 5,
    justifyContent: "flex-start",
    position: "absolute",
  },

  content: {
    paddingTop: 15,
    alignItems: "flex-start",
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
    fontSize: 15,
    fontWeight: "bold",
  },

  deletebutton: {
    position: "absolute",
    zIndex: 400,
    width: 100,
    height: 100,
    top: 115,
    left: 9,
  },

  container: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#b0b0b0",
    elevation: 4,
  },
});
