import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../contstants/colors";

export default function OutlinesButton({ onPress, icon, children }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]} // 👈 FIXED
      onPress={onPress}
    >
      <Ionicons
        style={styles.icon}
        name={icon}
        size={20}
        color={Colors.accent500}
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1, // 👈 add border so outline shows
    borderColor: Colors.primary500,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.5, // darker when pressed
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: Colors.primary200,
  },
});
