import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const HandlePasswordReset = () => {
    auth.sendPasswordResetEmail(auth.currentUser?.email);
  };

  const HandleEmailVerify = () => {
    setEmailSent(true);
    auth.currentUser.sendEmailVerification();
  };

  useEffect(() => {
    const user = auth.currentUser;
    console.log(user.emailVerified);
    if (user.emailVerified) {
      setVerified(true);
    } else {
      setVerified(false);
    }
  }, []);

  //read name function
  useEffect(() => {
    const uid = auth.currentUser.uid;
    var name = db.ref("users/" + uid + "/name");
    name.on("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((name_obj) => {
          //console.log(note_obj.key);
          setName(name_obj.val().name);
        });
      } else {
        console.log("Data Snapshot is null");
      }
    });
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Text>Your Profile</Text>
      <Text>E-mail : {auth.currentUser?.email}</Text>
      <Text>Name : {name}</Text>
      {auth.currentUser.emailVerified ? (
        <Text>Your email is verified</Text>
      ) : (
        <Text>Your email is not verified</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={HandlePasswordReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
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

  note_item: {
    padding: 15,
    fontSize: 11,
    marginTop: 12,
    backgroundColor: "#E6E6E6",
    borderRadius: 10,
  },

  button: {
    backgroundColor: "#1f1f1f",
    width: "70%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
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
