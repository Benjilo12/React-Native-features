import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../componenets/UI/IconButton";

function Map({ navigation }) {
  // store the user's selected point on the map
  const [selectedLocation, setSelectedLocation] = useState();

  // default map region (San Francisco example)
  const region = {
    latitude: 5.6037, // Accra latitude
    longitude: -0.187, // Accra longitude
    latitudeDelta: 0.0922, // vertical zoom
    longitudeDelta: 0.0421, // horizontal zoom
  };

  // runs when user taps on the map to select a location
  function selectLocationHandler(event) {
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    // save chosen coordinates
    setSelectedLocation({ lat: lat, lng: lng });
  }

  // save the picked location and navigate back
  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No location picked!",
        "You have to pick a location (by tapping on the map) first!"
      );
      return;
    }
    // pass selected location to AddPlace screen
    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  // set header button to save location
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler} // save button action
        />
      ),
    });
  }, [navigation, savePickedLocationHandler]);

  return (
    <MapView
      style={styles.map}
      initialRegion={region} // initial map position
      onPress={selectLocationHandler} // handle user tap
    >
      {/* show a marker only when a location is selected */}
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1, // fill the entire screen
  },
});
