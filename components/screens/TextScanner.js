import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, BackHandler, Alert, Modal, TextInput, ToastAndroid } from "react-native";
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNFS from 'react-native-fs';
import Tts from "react-native-tts";

export default class TextScanner extends React.Component {
  state = {
    textString: null,
    currentTextString: null,
    arrayOfText: "",
    isRead: false,
    nameOfFile: "",
    modalVisible: false
  }


  storeData = async (value) => {
    let usingSplit = this.state.arrayOfText.split(' ');
    let newArray = [];
    usingSplit.map((item, index) => newArray = [...newArray, { text: item, id: index, color: 'black' }])

    var path = RNFS.DocumentDirectoryPath + `/${value}.txt`;

    // write the file
    RNFS.writeFile(path, JSON.stringify(newArray), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!');
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.props.navigation.navigate('Main');
  }
  saveAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to SAVE?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => this.setState({ modalVisible: true }) }
    ])
  };

  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to go back?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => this.props.navigation.navigate('Main') }
    ]);
    return true;
  };
  componentDidMount() {

    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }
  takePicture = async () => {
    Tts.stop();
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      this.setState({ isRead: true })
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }

    this.setState({ isRead: false })
  };
  convert_f(message) {
    if (message !== null) {
      this.setState({
        textString: message.map(item => item.value),
        currentTextString: message.map((item, idx) => {
          const newItem = idx === message.length - 1 ? item.value : ''
          return (newItem)
        }),
        arrayOfText: this.state.arrayOfText + message.map(item => item.value),
      });
      if (this.state.textString) {
        Tts.speak(this.state.textString.toString())
      }
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
          //'textBlocks' is the variable that contains the value read through OCR
          onTextRecognized={({ textBlocks }) => {
            if (this.state.isRead) {
              this.convert_f(textBlocks)
            }
          }}>
        </RNCamera>
        {/* {this.state.textString ? <View style={styles.textScan}><Text style={{ fontSize: 16, marginHorizontal: 20, maxHeight: 200 }}>{this.state.textString}</Text></View> : null} */}
        {this.state.currentTextString ? <View style={styles.textScan}><Text style={{ fontSize: 20, color: 'blue', maxHeight: 200, marginHorizontal: 20, textDecorationLine: 'underline' }}>{this.state.currentTextString}</Text></View> : null}
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 , fontFamily: "Arvo-Regular"}}> Capture </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {

            this.setState({ isRead: true })
          }} style={styles.capture}>
            <Text style={{ fontSize: 14 , fontFamily: "Arvo-Regular"}}> Read </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.setState({ isRead: false });
            Tts.stop();
          }} style={styles.capture}>
            <Text style={{ fontSize: 14, fontFamily: "Arvo-Regular" }}> Stop </Text>
          </TouchableOpacity>

        </View>
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.setState({ isRead: false }, this.saveAction)} style={{
            flex: 0,
            backgroundColor: 'lightgreen',
            borderRadius: 10,
            padding: 15,
            marginHorizontal: 20,
            alignSelf: 'center',
            width: '50%',
            marginBottom: 10
          }}>
            <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: "Arvo-Regular" }}> Save </Text>
          </TouchableOpacity>
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
              <Text style={styles.modalText}>Enter Name of File !!!!</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => this.setState({ nameOfFile: text })}
                placeholder="Enter Name"
              />
              <TouchableOpacity onPress={() =>
                this.setState({ modalVisible: false, isRead: false }, () => this.storeData(this.state.nameOfFile))}
                style={{
                  flex: 0,
                  backgroundColor: 'lightgreen',
                  borderRadius: 10,
                  padding: 15,
                  marginHorizontal: 20,
                  alignSelf: 'center',
                  width: '50%',
                  marginBottom: 10
                }}>
                <Text style={{ fontSize: 14, fontFamily: "Arvo-Regular" }}> DONE </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View >
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,
  },
  textScan: {
    backgroundColor: '#E7E7E7',
  },
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
