import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

export default class AboutUs extends React.Component{

  render(){
    return(
      <View style={{width:"100%", height:"100%", backgroundColor:"#E7E7E7",justifyContent:"center"}}>
        <View style={styles.card}>
          <Text style={{fontSize:25,margin:10, fontFamily: "Arvo-Regular"}}>About us:</Text>
          <Text style={{margin:10, fontSize:15, fontWeight: "bold"}}>Developed by: </Text>
          <Text style={{margin:10, fontSize:15, fontFamily: "Arvo-Regular"}}>Hirra Saad</Text>
          <Text style={{margin:10, fontSize:15, fontFamily: "Arvo-Regular"}}>Kaynaat Fatima</Text>
          <Text style={{margin:10, fontSize:15, fontFamily: "Arvo-Regular"}}>Students of COMSATS University, Islamabad Campus </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card:{
    width:"90%", height:"50%",alignSelf:"center",backgroundColor:"white",borderRadius:20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  }
})
