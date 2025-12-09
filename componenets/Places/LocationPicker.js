import { Alert, StyleSheet, View } from "react-native";
import OutlinesButton from "../UI/OutlinesButton";
import {
  getCurrentPositionAsync,
  useForegroundPermissions, // 👈 use foreground instead
  PermissionStatus,
} from "expo-location";
import { Colors } from "../../contstants/colors";

export default function LocationPicker() {
  // 👇 check + request location permissions
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // 👇 verify if permission is granted
  async function verifyPermissions() {
    // first time opening app → ask user
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    // user previously denied permission
    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permission",
        "You need to grant location permissions to use this app"
      );
      return false; // 👈 must return false
    }

    return true; // permission already granted
  }

  // 👇 Get user location
  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    console.log(location); // log the location object
  }

  function pickOnMapHandler() {
    // open map screen later
  }

  return (
    <View>
      <View style={styles.mapPreview}></View>

      <View style={styles.actions}>
        <OutlinesButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinesButton>

        <OutlinesButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinesButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    marginVertical: 8,
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor: Colors.primary100,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
