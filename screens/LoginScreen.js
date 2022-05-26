import {
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
import { LinearGradient } from "expo-linear-gradient";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const image = { uri: "https://i.imgur.com/68Hqqfq.png" };

  // logins the user by checking that the auth state has changed
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("HomeScreen");
      }
    });

    return unsubscribe;
  }, []);

  // navigate to sign up screen
  const handleSignUp = () => {
    navigation.navigate("RegisterScreen");
  };

  // signs the user with email and password
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
      <LinearGradient
        // Background Linear Gradient
        colors={["#4287f5", "transparent"]}
        start={{ x: -1, y: -1.4 }}
        style={styles.background}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={-500}
        style={styles.containerView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <Image
            source={require("../assets/Logo.png")}
            style={{ width: 350, height: 100 }}
          />
        </View>

        <View style={styles.motto}>
          <Text style={{ color: "white" }}>Your go-to productivity app.</Text>
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

          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
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
  },

  containerView: {
    width: "75%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    width: "100%",
  },

  motto: {
    marginBottom: 10,
    bottom: 20,
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },

  input: {
    elevation: 4,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderLeftColor: "#4287f5",
    borderLeftWidth: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin: 7,
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
