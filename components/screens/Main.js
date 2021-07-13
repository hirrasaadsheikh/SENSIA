import React from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import Button from "../Button/button";
import Icon from "react-native-vector-icons/dist/Foundation";

export default class Main extends React.Component{
    render(){
    return(
      <View style={{width:"100%", height:"100%", backgroundColor:"#E7E7E7"}}>
        <StatusBar backgroundColor="#E7E7E7" />
        <View style={{width:"100%",height:"90%"}}>
          <Text style={{fontSize: 75, textAlign:"center", margin: 20, fontFamily: 'Arizonia-Regular' }}> <Icon name="clipboard-pencil"  size={50} style={{color:"black",margin:"5%"}} />Sensia</Text>

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#7fdeea"}
            innerColor={"white"}
            Text={"Text Scanner"}
            onPress={()=>this.props.navigation.navigate('textScanner')}
          />
          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#00c3ff"}
            innerColor={"white"}
            Text={"Create Document"}
            onPress={()=>this.props.navigation.navigate('createDocument')}
          />

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#5a8fba"}
            innerColor={"white"}
            Text={"Import Document"}
            onPress={()=>this.props.navigation.navigate('ImportDocument')}
          />

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#AA66E7"}
            innerColor={"white"}
            Text={"Library"}
            onPress={()=>this.props.navigation.navigate('Library')}
          />

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#5a1eae"}
            innerColor={"white"}
            Text={"How to use?"}
            onPress={()=>this.props.navigation.navigate('Usage')}
          />

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#6a1c9a"}
            innerColor={"white"}
            Text={"About us"}

            onPress={()=>this.props.navigation.navigate('AboutUs')}
          />

          <Button
            outerHeight={"10%"}
            innerHeight={"100%"}
            outerWidth={"95%"}
            innerWidth={"85%"}
            outerColor={"#880d4f"}
            innerColor={"white"}
            Text={"Rate us"}
            onPress={()=>this.props.navigation.navigate('RateUs')}
          />

        </View>
      </View>
    )
  }
}
