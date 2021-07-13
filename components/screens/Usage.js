import React from 'react';
import { StyleSheet, View, Text, ScrollView } from "react-native";

export default class Usage extends React.Component{

  render(){
    return(
      <View style={{width:"100%", height:"100%", backgroundColor:"#E7E7E7",justifyContent:"center"}}>

        <View style={styles.card}>
          <ScrollView>
            <Text style={{fontSize:20,margin:10, fontFamily: "Arvo-Regular"}}>How to use?</Text>
            <Text style={{margin:20, fontSize:15, fontFamily: "Arvo-Regular" }}>
              TEXT SCANNER:
              -A camera will appear where the users can perform live OCR. The system can also read the document for the users. They can save the file with the name of their choice in Application’s Library. </Text>
            <Text style={{margin:20, fontSize:15, fontFamily: "Arvo-Regular" }}>
              CREATE DOCUMENT:
              -In Create Document, Users can create their own notes through speech-to-text feature. They can write their own notes, or they can copy-paste any paragraph from the internet. The system can read the notes for the user. They can stop a system to read as well.
              -They can tap any word to see its synonyms.
              -They can also highlight the words in different colors by tapping on them. The created document can then be saved in Application's library. </Text>
            <Text style={{margin:20, fontSize:15, fontFamily: "Arvo-Regular" }}>
              IMPORT DOCUMENT:
              -Users can Perform OCR on any text image from phone's gallery. </Text>
            <Text style={{margin:20, fontSize:15, fontFamily: "Arvo-Regular" }}>
              LIBRARY:
              All the created and Scanned files will be stored in library.</Text>
            <Text style={{margin:20, fontSize:15, fontFamily: "Arvo-Regular" }}>
              RATE US:
              The Users can rate our application via email.</Text>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card:{
    width:"90%",
    height:"85%",
    alignSelf:"center",
    backgroundColor:"white",
    borderRadius:15,
    shadowColor: 'black',
    shadowOffset: { width: 20, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  }
})
