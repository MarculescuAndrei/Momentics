import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";

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
