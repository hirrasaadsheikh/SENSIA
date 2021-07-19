import React from 'react';
import {
  StyleSheet, View, Text, Image, Platform,
  TextInput, TouchableOpacity, Modal, FlatList,
  KeyboardAvoidingView
} from "react-native";
import Button from "../Button/button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from "react-native-tts";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as RNFS from 'react-native-fs';
import Voice from '@react-native-community/voice';
import { ColorPicker, toHsv } from 'react-native-color-picker'
import color from '../../assets/color.png'
var synonyms = require("synonyms");
var translatedText = []

export default class CreateDocument extends React.Component {

  state = {
    textArea: "",
    enteredText: '',
    nameOfFile: "",
    modalVisible: false,
    colorModalVisible: false,
    started: '',
    end: '',
    pitch: 0,
    results: [],
    partialResults: [],
    color: "black",
    arrayOfText: [],
    colorText: "black",
    selectedText: 0,
  };
  onColorChange = (color) => {
    this.setState({ color: color })
  }

  componentDidMount() {
    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));
    function onSpeechStart(e) {
      console.log('onSpeechStart: ', e);
    };
    function onSpeechResults(e) {
      console.log('onSpeechResults: ', e);
      this.sett(e.value)

    };
    function onSpeechPartialResults(e) {
      console.log('onSpeechPartialResults: ', e);
    };
    function onSpeechVolumeChanged(e) {
      console.log('onSpeechVolumeChanged: ', e);
    };
    Voice.onSpeechStart = onSpeechStart;
    // Voice.onSpeechEnd = onSpeechEnd;
    // Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = (e) => {
      // e.value.map((item) => this.setState({ enteredText: item }))
      this.setState({ enteredText: this.state.enteredText + " " + e.value[0] })
      // this.setState({ arrayOfText: this.split(this.state.enteredText, this.state.enteredText.length) })

    }
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

  }
  componentWillUnmount() {

  }

  split = (string, length = 1000) => {
    // Split text into individual words and count length
    const words = string.split(' ');
    const count = words.length;

    // Prepare elements and position tracker
    const elements = [];
    let position = 0;

    // Loop through words whilst position is less than count
    while (position < count) {
      // Prepare text for specified length and increment position
      const text = words.slice(position, length).join(' ');
      position += length;

      // Append text element
      elements.push((
        <Text>{text}</Text>
      ));
    }

    return elements;
  }

  startRecognizing = async () => {
    this.setState({
      pitch: '',
      started: '',
      results: [],
      partialResults: []
    })
    try {
      await Voice.start('en-US');
    } catch (e) {
      // console.error(e);
    }
  };
  stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      // console.error(e);
    }
  };
  cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      // console.error(e);
    } error(e);
  }
  destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
    } catch (e) {
      // console.error(e);
    }
  };


  storeData = async () => {
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
  getDocument = async () => {
    try {
      const value = await AsyncStorage.getItem('document');
      if (value !== null) {
        // We have data!!
        console.log(value);
      }
      else {
        console.log("Nothing OOPS")
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  getResult = (value) => {
    this.setState({ enteredText: value });
    // this.setState({ arrayOfText: { text: this.split(this.state.enteredText, this.state.enteredText.length) } })
  }

  speechToText = async () => {
    try {
      const value = await AsyncStorage.getItem('document');
      if (value !== null) {
        // We have data!!
        this.setState({ data: value })
        console.log(this.state.data)
        Tts.getInitStatus().then(() => {
          Tts.speak(this.state.data);
        });
      }
      else {
        console.log("Nothing OOPS")
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E7E7E7" }}>
        <View style={{ width: "100%", height: "50%" }}>
          <View style={{ flexDirection: "row", margin: 10, width: "95%", height: "20%", backgroundColor: "#C7A317", borderRadius: 5 }}>
            <Text style={{
              fontSize: 20, marginTop: "4%", marginLeft: "2%", fontFamily: "Arvo-Regular",
            }}>Create Document</Text>
            <TouchableOpacity onPress={() => {

              let usingSplit = this.state.enteredText.split(' ');
              let newArray = [];
              usingSplit.map((item, index) => newArray = [...newArray, { text: item, id: index, color: 'black' }])

              this.setState({
                arrayOfText: newArray,
              })
            }}>
              <Icon
                name="edit"
                size={40}
                style={{ color: "black", marginTop: "5%", marginLeft: "15%" }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              this.setState({ modalVisible: true })
            }}>
              <Icon
                name="save"
                size={40}
                style={{ color: "black", marginTop: "7%" }}
              />
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.colorModalVisible}
            onRequestClose={() => {
              this.setState({ colorModalVisible: false })
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ flexDirection: 'row' }} >
                  <TouchableOpacity onPress={() => {

                    let arrayTest = this.state.arrayOfText;
                    arrayTest[this.state.selectedText].color = "green"
                    this.setState({
                      arrayOfText: arrayTest,
                      colorModalVisible: false
                    })
                  }
                  } >
                    <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: 'green' }} >
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    let arrayTest = this.state.arrayOfText;
                    arrayTest[this.state.selectedText].color = "red"
                    this.setState({
                      arrayOfText: arrayTest,
                      colorModalVisible: false
                    })
                  }
                  } >
                    <View style={{ marginStart: 10, height: 30, width: 30, borderRadius: 15, backgroundColor: 'red' }} >
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    let arrayTest = this.state.arrayOfText;
                    arrayTest[this.state.selectedText].color = "blue"
                    this.setState({
                      arrayOfText: arrayTest,
                      colorModalVisible: false
                    })
                  }
                  } >
                    <View style={{ marginStart: 10, height: 30, width: 30, borderRadius: 15, backgroundColor: 'blue' }} >
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {
                    let arrayTest = this.state.arrayOfText;
                    arrayTest[this.state.selectedText].color = "orange"
                    this.setState({
                      arrayOfText: arrayTest,
                      colorModalVisible: false
                    })
                  }
                  } >
                    <View style={{ marginStart: 10, height: 30, width: 30, borderRadius: 15, backgroundColor: 'orange' }} >
                    </View>

                  </TouchableOpacity>
                </View>
                {
                  translatedText && translatedText !== undefined ? translatedText.map((item, index) => <Text>{item} </Text>) : null
                }
              </View>
            </View>
          </Modal>

          <View style={styles.textArea} >

            {
              this.state.arrayOfText.length > 0 ?

                <FlatList
                  data={this.state.arrayOfText}
                  horizontal={false}
                  numColumns={7}
                  renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => {
                      this.setState({
                        selectedText: item.id,
                        colorModalVisible: true,
                      })
                      if (synonyms(item.text) && synonyms(item.text) !== undefined) {
                        translatedText = synonyms(item.text).n
                      }

                    }} >
                      <Text style={{ marginLeft: 5, color: item.color }} >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  }
                  keyExtractor={item => item.id}
                />
                :
                <TextInput
                  style={[{
                    color: this.state.color,
                    fontFamily: "Arvo-Regular",
                    fontSize:15,
                  }]}
                  value={this.state.enteredText}
                  underlineColorAndroid="transparent"
                  placeholder="Type something....."
                  placeholderTextColor="grey"
                  numberOfLines={100}
                  multiline={true}
                  spellCheck={true}
                  onChangeText={text => {
                    this.setState({ enteredText: text });
                  }
                  }
                />
            }
          </View>
        </View>
        <View style={{ width: "100%", height: "90%", marginTop: "30%" }}>
          <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => Tts.speak(this.state.enteredText)} style={styles.capture}>
              <Text style={{ fontSize: 14, color: 'white', fontFamily: "Arvo-Regular", width: 115 }}> Read Doc </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Tts.stop()} style={styles.capture}>
              <Text style={{ fontSize: 14, color: 'white' , fontFamily: "Arvo-Regular", width: 115}}> Stop Read </Text>
            </TouchableOpacity>
          </View>
          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#C7A317"}
            innerColor={"white"}
            Text={"Write via Speech"}
            onPress={this.startRecognizing}
          />
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
                this.setState({ modalVisible: false, }, () => this.storeData())}
                                style={{
                                  flex: 0,
                                  backgroundColor: '#C7A317',
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
  textArea: {
    width: "95%",
    marginTop: "2%",
    height: "100%",
    borderWidth: 2.5,
    borderRadius: 10,
    borderColor: "#C7A317",
    alignSelf: "center",
    justifyContent: 'space-between'

  },
  capture: {
    flex: 0,
    backgroundColor: '#C7A317',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,

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
