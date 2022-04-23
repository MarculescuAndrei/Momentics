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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  NavigationContainer,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";

const HomeScreen = () => {
  const [note_prototype, setNotePrototype] = useState("");
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState("");
  const [dataState, setDataState] = useState();
  const isFocused = useIsFocused();
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
          snapshot.forEach((name_obj) => {
            setName(name_obj.val().name);
          });
        } else {
          setDataState(false);
          console.log("Data Snapshot is null");
        }
      }
    );
  }, [isFocused]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text>Welcome, {name}</Text>
    </ScrollView>
  );
};

// ? = tells js that its ok if email is undefined

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
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
