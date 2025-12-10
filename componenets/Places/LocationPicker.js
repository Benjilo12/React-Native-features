import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import { Colors } from "../../contstants/colors";
import { useEffect, useState } from "react";
import { getAddress, getMapPreview } from "../../utils/location";
import OutlinesButton from "../UI/OutlinesButton";
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from "@react-navigation/native";

export default function LocationPicker({ onPickLocation }) {
  const navigation = useNavigation(); // access navigation
  const route = useRoute(); // access route params
  const [pickedLocation, setPickedLocation] = useState(); // store selected location
  const isFocused = useIsFocused(); // check if screen is active

  // location permission handler
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // update selected location when returning from Map screen
  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAddress(
          pickedLocation.lat,
          pickedLocation.lng
        );
        onPickLocation({ ...pickedLocation, address: address });
      }
    }
    handleLocation();
  }, [pickedLocation, onPickLocation]);

  // check and request permissions
  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted; // user just responded
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true; // permission already granted
  }

  // get user's current GPS location
  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  // go to full map screen
  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  // default preview text
  let locationPreview = <Text>No location picked yet.</Text>;

  // show static image preview when a location is chosen
  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Static preview box */}
      <View style={styles.mapPreview}>{locationPreview}</View>

      {/* Action buttons */}
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
  container: {
    marginTop: 16,
    marginBottom: 45,
  },

  mapPreview: {
    marginVertical: 12,
    width: "100%",
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Colors.primary100,
    borderWidth: 1,
    borderColor: Colors.primary500,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  fallbackText: {
    fontSize: 14,
    color: Colors.primary700,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
});
