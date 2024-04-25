import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import SubCard from '../components/SubCard';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';


const {height, width} = Dimensions.get('window');
const OrderStatus = () => {
  const route = useRoute();
  const [status, setStatus] = useState('');

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getOrderData();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getOrderData = async () => {
    const data = await firestore()
      .collection('order')
      .doc(route.params.orderId)
      .get();
    setStatus(data._data.data.deliveryStatus);
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{marginTop: 20}}>
        <Text style={styles.orderIdText}>
          {'Order Id :  ' + route.params.orderId}
        </Text>
        <FlatList
          data={route.params.item}
          bounces={false}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.containerGap}
          renderItem={({item, index}) => (
            <SubCard
              showMarginatedAtEnd={true}
              cardWidth={width}
              isFirst={index == 0 ? true : false}
              isLast={index == route.params.item.length - 1 ? true : false}
              foodName={item.data.name}
              image={item.data.imageLink}
              description={item.data.description}
              discountPrice={item.data.discountprice}
              price={item.data.price}
              quantity={item.data.quantity}
              fontName="rupee"
            />
          )}
        />
        <View style={styles.infoBox}>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Order By : </Text>
            <Text  style={[styles.infoText,{fontFamily:'Poppins-SemiBold'}]}>{route.params?.orderBy}</Text>
          </View>
          {/* <View style={styles.dataView}>
            <Text style={styles.infoText}>Contact Number : </Text>
            <Text  style={[styles.infoText,{fontFamily:'Poppins-SemiBold'}]}>{route.params?.mobileNo}</Text>
          </View> */}
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Total Amount : </Text>
            <Text  style={[styles.infoText,{fontFamily:'Poppins-SemiBold'}]}>{route.params?.orderTotal}</Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Order Status : </Text>
            <Text  style={[styles.infoText,{fontFamily:'Poppins-SemiBold'}]}>{isConnected?status:'check data connection'}</Text>
          </View>
        </View>
        {status != 'Delivered' && isConnected == true ? (
          <View
            style={{
              margin: 10,
              padding: 10,
              borderWidth: 0.5,
              borderRadius: 10,
            }}>
            <Text style={[styles.infoText, {marginLeft: 20, color: 'red'}]}>
              {'OTP : ' + route.params.OTP}
            </Text>
            <Text style={[styles.infoText, {fontSize: 10, marginLeft: 5}]}>
              {
                '(Do not this OTP disclose with other except our Delivery Person)'
              }
            </Text>
            <Text
              style={[
                styles.infoText,
                {fontSize: 15, marginLeft: 5, marginTop: 20},
              ]}>
              {
                'For More information Regarding Delivery Contanct - +91 9826277420'
              }
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
      {isConnected == false ? (<View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>) : (<View></View>)}
    </ScrollView>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  orderIdText: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    padding: 10,
  },
  infoBox: {
    borderRadius: 10,
    margin: 15,
    borderWidth: 0.5,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#000000',
    marginVertical: 6,
    fontFamily: 'Poppins-Regular',
  },
  dataView:{
    flexDirection:'row'
  },
  isConnected:{
    backgroundColor:'#000000',
    width:'100%',
    height:20,
    position:'absolute',
    bottom:0,
    justifyContent:'center',
    alignItems:'center'
  },
  noConnectionText:{
    color:'#ffffff',
    fontSize:10
  }
});
