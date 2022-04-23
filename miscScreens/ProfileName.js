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
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const WelcomeProfileName = () => {
  const [name, setName] = useState("");

  //read name function
  useEffect(() => {
    db.ref("users/" + auth.currentUser.uid + "/name").once(
      "value",
      (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((name_obj) => {
            setName(name_obj.val().name);
          });
        } else {
          console.log("Data Snapshot is null");
        }
      }
    );
  }, []);

  return (
    <View>
      <Text>Welcome, {name}</Text>
    </View>
  );
};

export default WelcomeProfileName;
