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
  useRoute,
} from "@react-navigation/native";

const EditNote = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const uid = auth.currentUser.uid;
  const note_obj = db.ref("users/" + uid + "/notes/" + route.params.key);

  const [noteTitle, setNoteTitle] = useState(route.params.title);
  const [noteNote, setNoteNote] = useState(route.params.note);

  const updateTitle = (text) => {
    note_obj.update({
      title: text,
    });
    setNoteTitle(text);
  };

  const updateContent = (text) => {
    note_obj.update({
      note: text,
    });
    setNoteNote(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={noteTitle}
          placeholder="Title"
          onChangeText={(text) => updateTitle(text)}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          height={200}
          value={noteNote}
          multiline={true}
          placeholder="Note"
          onChangeText={(text) => updateContent(text)}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.buttonText}>Finish Editing</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditNote;

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

  note_item: {
    padding: 15,
    fontSize: 11,
    marginTop: 12,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
    borderBottomWidth: 4,
    borderColor: "#4ddb73",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  input: {
    color: "black",
    textAlignVertical: "top",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 6.5,
    marginTop: 5,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
  },

  inputContainer: {
    textAlignVertical: "top",
    width: "80%",
    paddingTop: 10,
  },
});
