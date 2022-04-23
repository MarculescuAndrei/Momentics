import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const image = { uri: "https://i.imgur.com/qDWMTWA.png" };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeScreen");
      }
    });

    return unsubscribe;
  }, []);

  // When we leave the screen the unsubscribe will close the listener so it does not ping it.

  //const handleSignUp = () => {
  //  auth
  //    .createUserWithEmailAndPassword(email, password)
  //    .then((userCredentials) => {
  //      const user = userCredentials.user;
  //      console.log(user.email);
  //    })
  //    .catch((error) => alert(error.message));
  //};

  const handleSignUp = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <ImageBackground source={image} style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={-500}
        style={styles.containerView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <Image
            source={require("../assets/Logo.png")}
            style={{ width: 350, height: 100, marginBottom: 100 }}
          />
        </View>

        <View style={styles.inputContainer}>
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
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#666666",
  },

  containerView: {
    width: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#666666",
  },

  inputContainer: {
    width: "80%",
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
    margin: 7,
  },

  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
