import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import email from 'react-native-email'
import Button from "../Button/button";

export default class RateUs extends React.Component{

  handleEmail = () => {
    const to = ['hirrasaad@live.com','kaynaat.fatimah@gmail.com'] // string or array of email addresses
    email(to, {
      // Optional additional arguments
      cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
      bcc: 'mee@mee.com', // string or array of email addresses
      subject: 'Sensia',
      body: 'rate our app here'
    }).catch(console.error)
  }

  render(){
    return(
      <View style={{width:"100%",height:"90%"}}>
        <View style={{flexDirection: "row",  margin: 10, width: "95%",  height: "10%",  backgroundColor: "#8B385E", borderRadius: 5}}>
          <Text style={{fontSize:20, color: "white" ,margin:15, fontFamily: "Arvo-Regular"}}>Rate Us</Text>
        </View>
        <Button
          outerHeight={"10%"}
          innerHeight={"100%"}
          outerWidth={"95%"}
          innerWidth={"85%"}
          outerColor={"#8B385E"}
          innerColor={"white"}
          Text={"Rate us via Email"}
          onPress={this.handleEmail}
        />
      </View>
    )
  }
}

