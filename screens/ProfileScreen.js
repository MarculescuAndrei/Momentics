import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [name, setName] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [hasRoutine, setHasRoutine] = useState(false);
  const [resetRoutine, setResetRoutine] = useState(false);

  // reset and verify functions with Firebase
  const HandlePasswordReset = () => {
    setPasswordEmailSent(true);
    auth.sendPasswordResetEmail(auth.currentUser?.email);
  };

  const HandleEmailVerify = () => {
    setEmailSent(true);
    auth.currentUser.sendEmailVerification();
  };

  // reads if the email of the user is verified
  useEffect(() => {
    const user = auth.currentUser;

    if (user.emailVerified) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  //read name function
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var all_tasks = db.ref("users/" + uid + "/tasks");

    var name = db.ref("users/" + uid + "/name");
    name.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setName(snapshot.val().name);
      } else {
        console.log("Data Snapshot is null");
      }
    });

    // verify if the user has a routine
    all_tasks.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setHasRoutine(true);
      } else {
        setHasRoutine(false);
      }
    });
  }, [isFocused]);

  // signs the user out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert(error.message));
  };

  // resets routine by deleting all content and adding last day of routine as "resetted" for a checkup in Home
  const handleResetRoutine = () => {
    const uid = auth.currentUser.uid;

    var all_tasks = db.ref("users/" + uid + "/tasks");
    var all_routine_days = db.ref("users/" + uid + "/routine_days");
    var routine_info = db.ref("users/" + uid + "/routine");
    routine_info.set({
      last_routine_day: "resetted",
      missed_routine_days: 0,
    });
    all_tasks.remove();
    all_routine_days.remove();
    setResetRoutine(true);
  };

  const handleAlert = () => {
    return Alert.alert(
      "Are your sure you want to reset your Routine?",
      "This will delete all tasks!",
      [
        {
          text: "Yes",
          onPress: () => {
            handleResetRoutine();
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#4ddb73", "#666666"]}
        start={{ x: 0, y: -0.9 }}
        style={styles.background}
      />
      <Feather name="user" size={62} color="black" style={{ bottom: 25 }} />
      <View style={styles.profile_card}>
        <View style={styles.profile_text}>
          <Text style={{ color: "#62de81", fontSize: 20 }}>{name}</Text>
          <Text style={{ color: "white", fontSize: 16 }}>
            {auth.currentUser?.email}
          </Text>

          {auth.currentUser.emailVerified ? (
            <Text style={{ color: "white", fontSize: 16, marginTop: 35 }}>
              Your email is verified
            </Text>
          ) : (
            <Text style={{ color: "white", fontSize: 16, marginTop: 35 }}>
              Your email is not verified
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={HandlePasswordReset}>
        {passwordEmailSent ? (
          <Text style={styles.buttonText}>Password Reset Email Sent</Text>
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {auth.currentUser.emailVerified ? null : (
        <TouchableOpacity style={styles.button} onPress={HandleEmailVerify}>
          {emailSent ? (
            <Text style={styles.buttonText}>Pending verification</Text>
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </TouchableOpacity>
      )}

      {auth.currentUser.emailVerified ? null : (
        <Text style={{ color: "white" }}>
          Email verification requires a re-login
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

      {hasRoutine ? (
        <TouchableOpacity style={styles.button_reset} onPress={handleAlert}>
          <Text style={styles.buttonText}>Reset Routine</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#666666",
  },

  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 170,
  },

  profile_card: {
    height: 135,
    width: 258,
    justifyContent: "flex-start",
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    borderBottomWidth: 4,
    borderBottomColor: "#62de81",
    marginBottom: 20,
  },

  profile_text: {
    right: 10,
    padding: 20,
    margin: 10,
    bottom: 17,
  },

  button: {
    backgroundColor: "#1a1a1a",
    width: "70%",
    padding: 11,
    borderRadius: 6,
    alignItems: "center",
    margin: 10,
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },

  button_reset: {
    backgroundColor: "#1a1a1a",
    width: "70%",
    padding: 11,
    borderRadius: 6,
    alignItems: "center",
    margin: 10,
    borderBottomColor: "red",
    borderBottomWidth: 2,
  },

  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
