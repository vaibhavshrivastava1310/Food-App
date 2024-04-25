import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const SubCard = props => {
  return (
    <View
      style={[
        styles.container,
        props.shouldMarginatedAtEnd
          ? props.isFirst
            ? {marginLeft: 36}
            : props.isLast
            ? {marginRight: 36}
            : {}
          : {},
        props.shouldMarginatedAround ? {margin: 12} : {},
        {maxWidth: props.cardWidth},
      ]}>
      <Image source={{uri: props.image}} style={styles.foodItemImage} />
      <View style={styles.infoView}>
        <Text style={styles.infoText}>{props.foodName}</Text>
        <Text style={styles.infoText}>{props.description}</Text>
        <View style={{flexDirection:'row'}}>
          <View style={{flexDirection: 'row'}}>
            <FontAwesome name={props.fontName} style={[styles.infoText,{marginTop:7,marginRight:3,fontSize:20}]} />
            <Text style={[styles.infoText,{fontSize:20}]}>{props.discountPrice}</Text>
          </View>
          <Text style={[styles.infoText,{marginLeft:5,textDecorationLine:'line-through'}]}>{props.price}</Text>
        </View>
      </View>
        <Text style={styles.quantityText}>
          {'Quantity : ' + props.quantity}
        </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    width: '100%',
    // backgroundColor: '#ff55',
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderRightWidth: 0.5,
    padding: 10,
  },
  foodItemImage: {
    width: 100,
    height: 130,
    margin: 5,
    borderRadius: 10,
  },
  quantityText: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    // backgroundColor: 'red',
    alignSelf:'center',
    padding:10,
    borderLeftWidth:0.5
  },
  infoView: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    // backgroundColor:'red',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    marginVertical:2
  },
});
export default SubCard;
