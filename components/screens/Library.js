import React from 'react';
import {
  StyleSheet, View, Text, FlatList, BackHandler,
  TouchableOpacity, Modal, ScrollView, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from "../Button/button";
import Tts from 'react-native-tts';
import * as RNFS from 'react-native-fs';
import Slider from '@react-native-community/slider';

var newArray = []
export default class Library extends React.Component {
  state = {
    dataFile: [],
    openedFileName: "",
    AllFiles: [],
    filterFiles: [],
    modalVisible: false,
    searchText: "",
    voiceSpeed: 0.01,
    textForRead: ''
  }

  filterFileFn = (text) => {
    this.setState({
      filterFiles: this.state.AllFiles.filter(item => {
        return item.name.toUpperCase().includes(text.toUpperCase())
      })
    })

  };
  readFile = async ({ path, name }) => {
    try {
      let contents = await RNFS.readFile(path, "utf8");

      contents = JSON.parse(contents);
      contents.map((item, index) => newArray = [...newArray, { text: item.text, id: item.id, color: item.color }])
      this.setState({ openedFileName: name, modalVisible: true, textForRead: this.state.textForRead + newArray.map(item => item.text) })
      this.setState({ textForRead: this.state.textForRead.split(",").join(" ") })
      // console.log("Text for Read ", this.state.textForRead);
    } catch (e) {
      alert("" + e);
      console.log("Error : ", e);
    }
  };

  renderItem = ({ item }) => (
    !item.name.endsWith(".js") ?
      <View >
        <TouchableOpacity style={styles.item} onPress={() => this.readFile({ path: item.path, name: item.name })}>
          <Text style={styles.title}>{item.name}</Text>
        </TouchableOpacity>
      </View>
      :
      <View></View>
  );
  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath).then(files => {
      this.setState({ AllFiles: files })
    })
      .catch(err => {
        console.log(err.message, err.code);
      });

    Tts.setDefaultLanguage('en-IE');
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

  }
  componentWillUnmount() {
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#E7E7E7" }}>

        <Text style={{ fontSize: 20, margin: 25, fontFamily: "Arvo-Regular" }}>Library</Text>
        <TouchableOpacity style={[styles.item, {}]} onPress={() => console.log("Pressed")}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => this.filterFileFn(text)}
            placeholder="Search File by Name"
            placeholderTextColor="white"
          />
        </TouchableOpacity>
        <FlatList
          data={this.state.filterFiles.length > 0 ? this.state.filterFiles : this.state.AllFiles}
          renderItem={this.renderItem}
          keyExtractor={item => item.path}
        />
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
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => Tts.speak(this.state.textForRead)}
                  style={styles.capture}>
                  <Text style={{ fontSize: 14, color: 'white',  fontFamily: "Arvo-Regular" }}> Read Doc</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Tts.stop()} style={styles.capture}>
                  <Text style={{ fontSize: 14, color: 'white',  fontFamily: "Arvo-Regular" }}> Stop Read </Text>
                </TouchableOpacity>
              </View>
              <Slider
                style={{ width: 200, height: 50,  }}
                minimumValue={0.01}
                maximumValue={0.99}
                minimumTrackTintColor="black"
                maximumTrackTintColor="blue"
                onValueChange={(value) => {
                  this.setState({ voiceSpeed: value })
                  Tts.setDefaultRate(value)
                }
                }
              />
              <Text style={[styles.modalTex, { fontSize: 25, fontWeight: 'bold' }]}>{this.state.openedFileName}</Text>

              <FlatList
                data={newArray}
                horizontal={false}
                numColumns={3}
                renderItem={({ item, index }) =>
                  <View >
                    <Text style={[{ marginLeft: 5, color: item.color, }, styles.modalTex]} >
                      {item.text}
                    </Text>
                  </View>
                }
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  item: {
    backgroundColor: "#C7A317",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10
  },
  title: {
    fontSize: 22,
    color: 'white'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
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
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 15,
    color: "white",
    paddingStart: 10,
    fontSize: 15,
    fontFamily: "Arvo-Regular"
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
});
