import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../../components/Loader';

let userEmail = '';
const Orders = ({navigation}) => {
  const [orderList, setOrderList] = useState([]);
  const [orderInfo, setOrderInfo] = useState([]);
  const isFocused = useIsFocused();

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getOrders();
  }, [isFocused]);

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

  const getOrders = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('uuuuu', JSON.stringify(user._data));
    setOrderList(user._data.orders);
    setOrderInfo(user._data);
  };

  const handleOrderDetails = index => {
    const address = orderInfo.address[index];
    // console.log('IIIIIIIIIII',index)
    // console.log('TTTTTTT',orderInfo.address[0])
    const info = orderList[index];
    // console.log(info.item)
    // console.log('AAAAAAAAA',address)
    navigation.navigate('OrderStatus', {
      // address: address.street,
      // mobileNo: address.mobileNo,
      // pincode: address.pincode,
      // city: address.city,
      OTP: info.OTP,
      item: info.item,
      orderId: info.orderId,
      orderBy: info.orderBy,
      orderTotal: info.orderTotal,
      userEmail: info.userEmail,
    });
  };

  // console.log('DADSDADSD',orderInfo)
  return (
    <View style={styles.container}>
      <Header title={'My Orders'} />
      <FlatList
        data={orderList}
        keyExtractor={({item, index}) => index + 'item'}
        renderItem={({item, index}) => {
          return (
            <View style={styles.orderItem}>
              {/* {console.log(item.orderId)} */}
              <FlatList
                keyExtractor={({item, index}) => item + 'abc'}
                data={item.item}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.itemView}>
                      {/* {console.log('sssssss',item.data)} */}
                      <Image
                        source={{uri: item.data.imageLink}}
                        style={styles.itemImage}
                      />
                      <View style={{alignSelf: 'center', marginLeft: 10}}>
                        <Text style={styles.nameText}>{item.data.name}</Text>
                        <Text style={styles.nameText}>
                          {'Price : ' +
                            item.data.discountprice +
                            ', Quantity : ' +
                            item.data.quantity}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
              <TouchableOpacity
                style={{
                  width: '20%',
                  marginTop: 10,
                  backgroundColor: isConnected ? '#ff5523' : '#838383',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (isConnected == true) {
                    handleOrderDetails(index);
                  }
                }}>
                <Text style={{color: '#ffffff', fontFamily: 'Poppins-Regular'}}>
                  Order Details
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      {isConnected == false ? (<View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>) : (<View></View>)}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  orderItem: {
    width: '90%',
    borderRadius: 10,
    elevation: 5,
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  itemView: {
    margin: 10,
    width: '100%',
    flexDirection: 'row',
  },
  nameText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#000000',
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
