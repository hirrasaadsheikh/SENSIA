import React from 'react';
import { Alert, StyleSheet, View, PermissionsAndroid, Text, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Button from "../Button/button";
import DocumentPicker from 'react-native-document-picker';
import Icon from "react-native-vector-icons/FontAwesome";
// import TesseractOcr, { LANG_ENGLISH } from 'react-native-tesseract-ocr';
import TesseractOcr, { LANG_ENGLISH, LEVEL_WORD } from 'react-native-tesseract-ocr';
import * as ImagePicker from 'react-native-image-picker';
import pdf from '../../assets/simple_pdf.pdf';
import image from '../../assets/simple_image.jpg';
import { erring, wait } from 'synonyms/dictionary';
// import { Button, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

export default class ImportDocument extends React.Component {
  state = {
    textString: "Import Image from phone's gallery!",
  }
   handleChoosePhoto  = async () => {


     if (Platform.OS === 'android') {
       PermissionsAndroid.requestMultiple([
         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE]
       ).then((result) => {
         if (
           result['android.permission.READ_EXTERNAL_STORAGE']
           && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
           (async () => {
             const res = await
               DocumentPicker.pick({
                 type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
                 copyTo: "cachesDirectory"
               });
             console.log(
               res.fileCopyUri,
               res.type, // mime type
               res.name,
               res.size
             );
             console.log('Hirra is getting path : ', res);
             this.recognizeTextFromImage(res.fileCopyUri)
             //  this.recognizeTextFromImage(response.uri)
           })();
           console.log('Yes ');
         } else {
           //   this.refs.toast.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
           console.log('No !');
         }
       });
     }

  }
  pickFile = async () => {
    // Pick a single file
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState({ textString: res.uri })
      console.log("URI: ", res.fileCopyUri)
      console.log("Type: ", res.type)
      console.log("path: ", res)
      console.log("size: ", res.size)
      this.recognizeTextFromImage(res.fileCopyUri)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  recognizeTextFromImage = async (path) => {
    try {
      this.setState({ textString: 'Processing.......' })
      const tesseractOptions = {};

      console.log("path: ", path)

      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      this.setState({ textString: recognizedText })
    } catch (err) {
      this.setState({ textString: 'Error !. Please try again' })
      console.error(err);
    }
  };
  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "#E7E7E7" }}>
        <View style={{ flexDirection: "row", margin: 10, width: "95%", height: "10%", backgroundColor: "orange", borderRadius: 5 }}>
          <Text style={{ fontSize: 20, color: "black", margin: 15, fontFamily: "Arvo-Regular" }}>Import Document</Text>
          <Icon
            name="save"
            size={40}
            onPress={() => Alert.alert('document saved!')}
            style={{ color: "black", marginTop: "3%", marginLeft: "15%" }}
          />
        </View>
        <View style={{ width: "100%", height: "100%" }}>
          <View style={{ width: "100%", height: "65%" }} >
            <TextInput
              multiline={true}
              style={{
                fontSize: 20,
                color: "black",
                margin: 15,
                fontFamily: "Arvo-Regular",
                borderRadius: 15,
                height: 450,
                borderWidth: 2,
                borderColor: "orange"
              }}
            >{this.state.textString}</TextInput>

            <Button
              outerHeight={"15%"}
              innerHeight={"100%"}
              outerWidth={"95%"}
              innerWidth={"85%"}
              outerColor={"orange"}
              innerColor={"white"}
              Text={"Import Document"}
              onPress={this.handleChoosePhoto}
            />
          </View>
        </View>
      </View>
    )
  }
}


