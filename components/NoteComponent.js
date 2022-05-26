import { View, Text, StyleSheet, Alert } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
const NoteComponent = ({ pushkey, time, note, title }) => {
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate("EditNoteScreen", {
      title: title,
      note: note,
      key: pushkey,
    });
  };

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
        {
          text: "Yes",
          onPress: () => {
            handleDelete();
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      key={pushkey}
      style={styles.container}
      onPress={handleEditPress}
    >
      <View style={styles.title}>
        <Text style={styles.texttitle}>
          {title.length > 15 ? title.slice(0, 15) + ".." : title}
        </Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={4}>{note}</Text>
      </View>

      <View style={styles.date}>
        <Text style={styles.textdate}>{time}</Text>
      </View>

      <View style={styles.deletebutton}>
        <TouchableOpacity onPress={handleAlert}>
          <MaterialIcons name="delete" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    right: 1,
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
    flex: 1,
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
    borderRadius: 6.7,
    margin: 10,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#ededed",
    elevation: 4,
    borderBottomWidth: 6,
    borderColor: "#e8b02e",
  },
});
