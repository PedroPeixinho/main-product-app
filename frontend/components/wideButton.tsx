import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WideButton = ({ text, onPress, variant }: any) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {variant === "noIcon" ? null : (
        <MaterialCommunityIcons
          name="plus-thick"
          size={18}
          color="white"
          style={styles.icon}
        />
      )}

      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A5CFF",
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignSelf: "center",
  },
  text: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  icon: {
    marginRight: 8,
  },
});

export default WideButton;
