import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [passwordEmailSent, setPasswordEmailSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const HandlePasswordReset = () => {
    setPasswordEmailSent(true);
    auth.sendPasswordResetEmail(auth.currentUser?.email);
  };

  const HandleEmailVerify = () => {
    setEmailSent(true);
    auth.currentUser.sendEmailVerification();
  };

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
    var name = db.ref("users/" + uid + "/name");
    name.on("value", (snapshot) => {
      if (snapshot.exists()) {
        setName(snapshot.val().name);
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
      <Feather name="user" size={62} color="black" style={{ bottom: 50 }} />
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

  profile_card: {
    height: 150,
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
    padding: 13,
    borderRadius: 6,
    alignItems: "center",
    margin: 10,
    borderBottomColor: "white",
    borderBottomWidth: 2,
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
