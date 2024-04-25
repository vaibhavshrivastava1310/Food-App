import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
let userEmail = '';
const {height, width} = Dimensions.get('screen');
const Cart = ({navigation}) => {
  const isFocused = useIsFocused();

  const [cartList, setCartList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getCartItem();
  }, [isFocused]);

  const getCartItem = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('UUUUUUUUUUUUU',user._data.cart)
    setCartList(user._data.cart);
  };

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

  
  const addItemQuantity = async item => {
    setModalVisible(true);
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempCart = [];
    tempCart = user._data.cart;
    tempCart.map(itm => {
      if (itm.id == item.id) {
        itm.data.quantity = itm.data.quantity + 1;
      }
    });
    firestore().collection('userinfo').doc(userEmail).update({
      cart: tempCart,
    });
    setModalVisible(false);
    getCartItem();
  };

  const removeItemQuantity = async item => {
    setModalVisible(true);
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempCart = [];
    tempCart = user._data.cart;
    tempCart.map(itm => {
      if (itm.id == item.id) {
        itm.data.quantity = itm.data.quantity - 1;
      }
    });
    firestore().collection('userinfo').doc(userEmail).update({
      cart: tempCart,
    });
    setModalVisible(false);
    getCartItem();
  };

  const deleteFromCart = async index => {
    setModalVisible(true);
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempCart = [];
    tempCart = user._data.cart;
    tempCart.splice(index, 1);
    firestore().collection('userinfo').doc(userEmail).update({
      cart: tempCart,
    });
    setModalVisible(false);
    getCartItem();
  };
  const getTotal = () => {
    let total = 0;
    cartList.map(item => {
      total = total + item.data.quantity * item.data.discountprice;
    });
    return total;
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={cartList}
        renderItem={({item, index}) => {
          return (
            <View style={styles.itemView}>
              <Image
                source={{uri: item.data.imageLink}}
                style={styles.foodItemImage}
              />
              <View style={styles.nameView}>
                <View style={styles.infoBox}>
                  <Text
                    style={[
                      styles.itemText,
                      {fontWeight: 'bold', fontSize: 17},
                    ]}>
                    {item.data.name}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.itemText}>{item.data.description}</Text>
                </View>
                <View style={styles.infoBox}>
                  <FontAwesome
                    name="rupee"
                    style={{
                      fontSize: 20,
                      marginRight: 5,
                      color: 'green',
                      marginTop: 3,
                    }}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      {
                        fontWeight: 'bold',
                        fontSize: 23,
                        color: 'green',
                        marginRight: 7,
                      },
                    ]}>
                    {item.data.discountprice}
                  </Text>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: '#000000',
                        textDecorationLine: 'line-through',
                      },
                    ]}>
                    {item.data.price}
                  </Text>
                </View>
              </View>
              <View style={styles.addRemoveView}>
                {item.data.quantity > 1 ? (
                  <TouchableOpacity
                    style={[styles.actionBtn, {backgroundColor: '#ff7675'}]}
                    onPress={() => {if(isConnected){removeItemQuantity(item)}}}>
                    <Text style={styles.actionIcon}>-</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      {
                        backgroundColor: '#ff7675',
                        height: 50,
                        width: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                    onPress={()=>{if(isConnected){deleteFromCart()}}}>
                    <Icon
                      name="delete"
                      style={[
                        styles.actionIcon,
                        {fontFamily: 'Poppins-Regular'},
                      ]}
                    />
                  </TouchableOpacity>
                )}
                <Text style={styles.qtyText}>{item.data.quantity}</Text>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: '#55efc4'}]}
                  onPress={() => {if(isConnected){addItemQuantity(item)}}}>
                  <Text style={styles.actionIcon}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      {cartList.length > 0 && (
        <View style={styles.cheackoutView}>
          <View style={styles.totalView}>
            <Text style={styles.totalItemText}>
              {'Total Items : ' + cartList.length}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.totalText1}>Total Price : </Text>
              <FontAwesome name="rupee" style={styles.rupeeIcon} />
              <Text style={styles.totalText2}>{getTotal()}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.checkoutBtn,{backgroundColor:isConnected?'#ff5523':'#838383'}]}
            onPress={() =>{if(isConnected){navigation.navigate('Checkout')}}}>
            <Text style={styles.checkoutText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}
      {isConnected == false ? (<View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>) : (<View></View>)}
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    elevation: 4,
    marginTop: 15,
    borderRadius: 10,
    height:'auto',
    marginBottom: 10,
  },
  foodItemImage: {
    width: 100,
    height:'auto',
    margin: 5,
    borderRadius: 10,
  },
  nameView: {
    width: 130,
    marginTop: 15,
    // backgroundColor:'blue'
  },
  infoIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  infoBox: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  addRemoveView: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor:'red',
    width: '27%',
    justifyContent: 'center',
  },
  actionIcon: {
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  qtyText: {
    fontSize: 25,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
  },
  actionBtn: {
    padding: 3,
    borderRadius: 30,
    width: 25,
    height: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cheackoutView: {
    width: width,
    height: 100,
    // backgroundColor: 'red',
    elevation: 5,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // padding:10
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  totalView: {
    // backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginTop: 15,
    width: '50%',
    marginRight: 5,
  },
  checkoutBtn: {
    backgroundColor: '#ff5523',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    alignSelf: 'center',
    marginTop: 15,
    width: '50%',
    marginLeft: 5,
    borderRadius: 50,
    marginRight: 5,
  },
  totalItemText: {
    fontSize: 17,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor:'red',
    width: '100%',
  },
  totalText1: {
    fontSize: 20,
    fontFamily: 'Poppins_SemiBold',
    color: '#000000',
  },
  rupeeIcon: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'green',
    marginRight: 4,
    marginTop: 3,
    marginLeft: 3,
  },
  totalText2: {
    fontSize: 20,
    fontFamily: 'Poppins_SemiBold',
    color: 'green',
  },
  checkoutText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
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
