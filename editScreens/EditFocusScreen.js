import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const EditFocus = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const uid = auth.currentUser.uid;
  const focus_obj = db.ref("users/" + uid + "/focus/" + route.params.key);
  const [workTime, setWorkTime] = useState(route.params.workTime);
  const [relaxTime, setRelaxTime] = useState(route.params.relaxTime);

  // update functions
  const updateWork = (nr) => {
    setWorkTime(nr);
    if (!isNaN(parseInt(nr, 10))) {
      focus_obj.update({
        worktime: nr * 60,
      });
    }
  };

  const updateRelax = (nr) => {
    setRelaxTime(nr);
    if (!isNaN(parseInt(nr, 10))) {
      focus_obj.update({
        relaxtime: nr * 60,
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["white", "#666666"]}
        start={{ x: 0, y: -2 }}
        style={styles.background}
      />
      <View style={styles.inputs}>
        <View style={styles.inputContainer}>
          <TextInput
            defaultValue={
              Math.floor(workTime / 60).toString() > 0
                ? Math.floor(workTime / 60).toString()
                : 1
            }
            placeholder="Work Time"
            onChangeText={(nr) => updateWork(nr)}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            defaultValue={
              Math.floor(relaxTime / 60).toString() > 0
                ? Math.floor(relaxTime / 60).toString()
                : 1
            }
            placeholder="Relax Time"
            onChangeText={(nr) => updateRelax(nr)}
            style={styles.input}
          />
        </View>
      </View>
      <View>
        <Text style={{ color: "white", marginBottom: 15 }}>
          Write values in minutes.
        </Text>
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

export default EditFocus;

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

  inputs: {
    flexDirection: "row",
    width: "80%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "70%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
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
    paddingVertical: 10,
    borderRadius: 6.5,
    fontSize: 16,
    borderBottomWidth: 4,
    borderBottomColor: "#121212",
  },

  inputContainer: {
    margin: 10,
    textAlignVertical: "top",
    width: "40%",
  },
});
