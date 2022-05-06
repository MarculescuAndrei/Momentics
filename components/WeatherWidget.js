import { View, Text, StyleSheet, Alert, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth, db } from "../firebase";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import EditNote from "../editScreens/EditNoteScreen";
import { useEffect, useState } from "react/cjs/react.production.min";

const WeatherWidget = ({ temp, icon, city }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.temptext}>{temp}° </Text>

      <Image
        style={styles.tinyLogo}
        source={{
          uri: "http://openweathermap.org/img/wn/" + icon + "@2x.png",
        }}
      />

      <Text style={styles.citytext}>{city}</Text>
    </View>
  );
};

export default WeatherWidget;

const styles = StyleSheet.create({
  tinyLogo: {
    position: "absolute",
    left: 90,
    width: 50,
    height: 50,
  },

  temptext: {
    position: "absolute",
    left: 15,
    top: 10,
    color: "white",
  },

  citytext: {
    position: "absolute",
    left: 15,
    top: 30,
    color: "white",
  },

  container: {
    width: 150,
    height: 80,
    borderRadius: 6.7,

    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderBottomWidth: 6,
    borderColor: "#62de81",
  },
});
