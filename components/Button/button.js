import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export default class Button extends React.Component{
  render(){
    return(
      <TouchableOpacity style={{height:this.props.outerHeight, width:"95%", backgroundColor:this.props.outerColor, alignSelf:"center",borderRadius:15, flexDirection:"row", marginTop:"3%", shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 3}} onPress={this.props.onPress}>
        <View style={{height:this.props.innerHeight, width:"84%", backgroundColor:this.props.innerColor,borderRadius:15, justifyContent:"center"}}>
          <Text style={{textAlign:"center", fontSize: 15, fontFamily: "Arvo-Regular"}}>{this.props.Text}</Text>
        </View>
        <Icon name="arrow-right" size={15} style={{color:"white",margin:"5%"}} />
      </TouchableOpacity>
    )
  }
}


