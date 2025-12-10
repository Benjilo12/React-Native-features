import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";
import { Colors } from "../../contstants/colors";
import OutlinesButton from "../UI/OutlinesButton";

export default function ImagePicker({ onTakeImage }) {
  const [pickedImage, setPickedImage] = useState(); // stores selected image URI

  // get camera permission info + function to request permission
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  // check and request camera permission
  async function verifyPermissions() {
    // first time → ask for permission
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    // user denied permission earlier
    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant camera permissions to use this app"
      );
      return false;
    }

    // already granted
    return true;
  }

  // open camera and take picture
  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) return;

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    // FIXED: ImagePicker now returns an assets array
    if (!image.canceled) {
      setPickedImage(image.assets[0].uri); // save the image URI
    }
    onTakeImage(image.assets[0].uri);
  }

  // default preview text
  let imagePreview = <Text>No image taken yet</Text>;

  // show real image once selected
  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      {/* preview box */}
      <View style={styles.imagePreview}>{imagePreview}</View>

      {/* Button to take image */}
      <OutlinesButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinesButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
