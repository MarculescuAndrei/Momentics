import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const AddNoteScreen = () => {
  const [noteText, setNoteText] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const navigation = useNavigation();

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
      note: noteText,
      title: noteTitle,
      time: now,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["white", "#666666"]}
        start={{ x: 0, y: -2 }}
        style={styles.background}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title"
          onChangeText={(text) => setNoteTitle(text)}
          style={styles.inputTitle}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          height={200}
          multiline={true}
          placeholder="Note"
          onChangeText={(text) => setNoteText(text)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={writeToDb}>
        <Text style={styles.buttonText}>Add this Note</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddNoteScreen;

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

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 600,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "80%",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    margin: 20,
    borderBottomWidth: 4,
    borderColor: "#e8b02e",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  inputTitle: {
    color: "black",
    textAlignVertical: "top",
    backgroundColor: "transparent",
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 5,
    marginTop: 15,
  },

  input: {
    color: "black",
    textAlignVertical: "top",
    backgroundColor: "white",
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 6.5,
    marginTop: 5,
  },

  inputContainer: {
    textAlignVertical: "top",
    width: "80%",
    paddingTop: 10,
  },
});
