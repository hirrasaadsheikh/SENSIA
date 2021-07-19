import React from 'react';
import {
  Alert,
  StyleSheet,
  View,
  PermissionsAndroid,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import Button from "../Button/button";
import DocumentPicker from 'react-native-document-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import TesseractOcr, { LANG_ENGLISH, LEVEL_WORD } from 'react-native-tesseract-ocr';
import * as ImagePicker from 'react-native-image-picker';
import image from '../../assets/simple_image.jpg';
import { erring, wait } from 'synonyms/dictionary';
import * as RNFS from "react-native-fs";
import Tts from "react-native-tts";

export default class ImportDocument extends React.Component {
  state = {
    textString: "Import Text Image from phone's gallery!",
    modalVisible: false,
    nameOfFile: "",
  }

  Datastore = async () => {
    var path = RNFS.DocumentDirectoryPath + `/${this.state.nameOfFile}.txt`;

    // write the file
    RNFS.writeFile(path, JSON.stringify(this.state.arrayOfText), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.props.navigation.navigate('Main');
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
             await this.recognizeTextFromImage(res.fileCopyUri)
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
      await this.recognizeTextFromImage(res.fileCopyUri)
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
      this.setState({ textString: 'Error !!! Please try again' })
      console.error(err);
    }
  };
  render() {
    return (
      <View style={{ width: "100%", height: "100%", backgroundColor: "#E7E7E7" }}>
        <View style={{ flexDirection: "row", margin: 10, width: "95%", height: "10%", backgroundColor: "orange", borderRadius: 5 }}>
          <Text style={{ fontSize: 20, color: "black", margin: 15, fontFamily: "Arvo-Regular" }}>Import Document</Text>
          <TouchableOpacity onPress={() => {
            this.setState({ modalVisible: true })
          }}>
          <Icon
            name="save"
            size={40}
            style={{ color: "black", marginTop: "5%", marginLeft: "35%" }}
          />
          </TouchableOpacity>
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
                height: 430,
                borderWidth: 2,
                borderColor: "orange"
              }}
            >{this.state.textString}</TextInput>

              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.capture}>
                  <Text style={{ fontSize: 14, color: 'white', fontFamily: "Arvo-Regular", width: 115 }}> Read Doc </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.capture}>
                  <Text style={{ fontSize: 14, color: 'white' , fontFamily: "Arvo-Regular", width: 115}}> Stop Read </Text>
                </TouchableOpacity>
              </View>

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

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
        >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Name of File !!!</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ nameOfFile: text })}
              placeholder="Enter Name"
            />
            <TouchableOpacity onPress={() =>
              this.setState({ modalVisible: false, }, () => this.Datastore())}
                              style={{
                                flex: 0,
                                backgroundColor: 'orange',
                                borderRadius: 10,
                                padding: 15,
                                marginHorizontal: 20,
                                alignSelf: 'center',
                                width: '50%',
                                marginBottom: 10
                              }}>
              <Text style={{ fontSize: 14 , fontFamily: "Arvo-Regular", color: "white"}}> DONE </Text>
            </TouchableOpacity>

          </View>
        </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  capture: {
    flex: 0,
    backgroundColor: 'orange',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  modalText: {
    fontFamily: "Arvo-Regular",
    fontSize: 20
  }
})


