import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerifier, setPasswordVerifier] = useState("");
  const [warningText, setWarningText] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeScreen");
      }
    });

    return unsubscribe;
  }, []);

  const handleBack = () => {
    navigation.navigate("LoginScreen");
  };

  // When we leave the screen the unsubscribe will close the listener so it does not ping it.

  var timer = setTimeout(() => {
    setWarningText(false);
  }, 30000);

  const handleSignUp = () => {
    if (password == passwordVerifier) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user.email);
          clearTimeout(timer);
          var uid = auth.currentUser.uid;
          db.ref("users/" + uid + "/name").set({
            name: name,
          });
          db.ref("users/" + uid + "/focus").push({
            worktime: 1500,
            relaxtime: 300,
            cycles: 0,
          });

          // initiate first day of routine different from day of registration
          const yesterday = new Date(
            new Date().valueOf() - 1000 * 60 * 60 * 24
          );

          db.ref("users/" + uid + "/routine").set({
            last_routine_day: yesterday.toString().slice(0, 15),
          });
        })
        .catch((error) => alert(error.message));
    } else {
      setWarningText(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Repeat Password"
          value={passwordVerifier}
          onChangeText={(text) => setPasswordVerifier(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      {warningText ? (
        <Text style={styles.wrongPass}>Passwords do not match!</Text>
      ) : (
        console.log("")
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.button}>
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#666666",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    width: "70%",
    margin: 7,
  },

  wrongPass: {
    paddingTop: 10,
    color: "red",
  },

  input: {
    elevation: 4,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6.5,
    borderBottomColor: "#121212",
    borderBottomWidth: 4,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin: 6,
  },

  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonOutline: {
    backgroundColor: "#1f1f1f",
    marginTop: 5,
    borderColor: "white",
    borderWidth: 1,
  },

  buttonOutlineText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
