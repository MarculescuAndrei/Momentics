import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerifier, setPasswordVerifier] = useState("");
  const [warningText, setWarningText] = useState(false);

  const image = { uri: "https://i.imgur.com/68Hqqfq.png" };
  const navigation = useNavigation();

  // logins the user as he registers
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

  // timer for the password error message to disappear
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

          // adds info regarding the routine - I should change yesterday to a custom name so it can be checked in Home
          db.ref("users/" + uid + "/routine").set({
            last_routine_day: yesterday.toString().slice(0, 15),
            missed_routine_days: 0,
          });
        })
        .catch((error) => alert(error.message));
    } else {
      setWarningText(true);
    }
  };

  return (
    <ImageBackground source={image} style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#4287f5", "transparent"]}
        start={{ x: -0.5, y: -1 }}
        style={styles.background}
      />
      <KeyboardAvoidingView
        style={styles.containerView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../assets/regpic.png")}
          style={{ width: 350, height: 60 }}
        />
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
          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBack} style={styles.button}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    width: "100%",
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
    borderRadius: 5,
    borderBottomColor: "#4287f5",
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin: 6,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },

  containerView: {
    width: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 40,
  },

  button: {
    backgroundColor: "black",
    width: 138,
    padding: 15,
    margin: 10,
    borderRadius: 6,
    alignItems: "center",
    borderColor: "#4287f5",
    borderBottomWidth: 2,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  buttonOutlineText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
