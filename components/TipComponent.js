import { View, Text, StyleSheet } from "react-native";
import React from "react";

const TipComponent = () => {
  const tips = [
    "Try to set goals on a daily basis for best results!",
    "Try to review past days to make an idea of how you manage your work.",
    "Identify your most productive time of day!",
    "It's not about how much time you have, it's about how you choose to spend it.",
    "Isolate yourself from other distractions to get things done.",
    "Don't waste your time on long emails...",
    "Try to not spend more time than you need to in the shower..",
    "Get some well needed sleep, at least 7 hours.",
    "Take regular, well-needed breaks, it will be easier to focus after one.",
    "The best way to hit the ground running, is to start the night before.",
    "Do your most dreaded task first, it will motivate you when you're done.",
    "Eat a healthy and consistent breakfast, you need energy in the morning.",
    "Regular exercise, no matter how little, will always make you feel better.",
    "Don't be afraid of saying no, take on tasks that you really have to.",
    "Stop procrastinating, it'll be more stressful later on.",
    "Try to find the productivity methodology that works for you!",
    "Focus on why exactly you are doing something.",
    "Surround yourself with productive people and growing mindsets",
    "Try to wake up at the same time everyday, or at least, never go to sleep in the morning!",
    "Don't tackle the easy tasks first, leave them for when you will be more exhausted.",
    "Don't try to multitask too much, it will sooner or later wear you out",
    "Don't skip a meal because of work, you will be more productive with a full belly.",
    "Power naps in the afternoon can be a great method to boost your energy.",
    "Try to disconnect sometimes, an internet detox can go a long way.",
    "Social media can affect your focus and limit your attention span, try to regulate it.",
    "Take 30 Day challanges, this can go a long way when you try to implement new habits.",
    "Have realistic expectations, don't push yourself to do too much.",
    "Track everything, your time, your done tasks and your failures.",
    "Start every day right with a 5 minute exercise",
    "Sometimes you need to manage your energy, not your time.",
    "Try to sit up and walk for a bit, staying on a chiar for long periods of time is harmful.",
  ];
  const day = new Date(new Date()).getDate();
  return (
    <View style={styles.tip_view}>
      <Text style={styles.tip_title}>Tip of the Day</Text>
      <Text style={styles.tip_content}>{tips[day]}</Text>
    </View>
  );
};

export default TipComponent;

const styles = StyleSheet.create({
  tip_view: {
    justifyContent: "center",
    marginBottom: 5,
    marginTop: 20,
    height: 85,
    width: 320,
    backgroundColor: "#2e2e2e",
    elevation: 4,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderColor: "#b95eff",
  },

  tip_title: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    left: 15,
    top: 7,
  },

  tip_content: {
    position: "absolute",
    color: "white",
    right: 25,
    paddingBottom: 10,
    top: 35,
    left: 15,
  },
});
