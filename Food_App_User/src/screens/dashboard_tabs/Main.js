import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { bool } from 'yup';
let userEmail = '';
const Main = ({navigation}) => {
  const [foodData, setFoodData] = useState([]);
  const isFocused = useIsFocused();
  const [cartCount, setCartCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const [isConnected, setIsConnected] = useState(false);

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

  useEffect(() => {
    getItems();
  }, [isFocused]);

  useEffect(() => {
    getCartItem();
  }, [isFocused]);

  const getCartItem = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('UUUUUUUUUUUUU',user)
    setCartCount(user._data.cart.length);
  };

  // console.log('AAAAAAAAAAA',cartCount)

  const getItems = () => {
    firestore()
      .collection('fooditem')
      .get()
      .then(querySnapshot => {
        let tempData = [];
        querySnapshot.forEach(documentSnapshot => {
          // console.log('IDDDDDDD',documentSnapshot.id)
          // console.log('Dataaaa',documentSnapshot.data())
          tempData.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setFoodData(tempData);
      });
  };

  const AddtoCart = async (item, index) => {
    setModalVisible(true);
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempCart = [];
    tempCart = user._data.cart;
    if (tempCart.length > 0) {
      let existing = false;
      tempCart.map(itm => {
        if (itm.id == item.id) {
          existing = true;
          itm.data.quantity = itm.data.quantity + 1;
        }
      });
      if (existing == false) {
        tempCart.push(item);
      }
      firestore().collection('userinfo').doc(userEmail).update({
        cart: tempCart,
      });
      setModalVisible(false);
      getCartItem();
    } else {
      tempCart.push(item);
    }
    // console.log('TTTTTTTT',tempCart)
    firestore().collection('userinfo').doc(userEmail).update({
      cart: tempCart,
    });
    setModalVisible(false);
    getCartItem();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header
          title={'FoodApp'}
          iconName={'cart-outline'}
          count={cartCount}
          onClickIcon={() => {
            if (isConnected){
              navigation.navigate('Cart');
            }
          }}
        />
      </View>
      <FlatList
        data={foodData}
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
                <View style={[styles.infoBox,{position:'absolute',bottom:60}]}>
                  <Text style={styles.itemText}>{item.data.description}</Text>
                </View>
                <View style={[styles.infoBox,{position:'absolute',bottom:0}]}>
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
              <View
                style={{
                  height: '100%',
                  width: 120,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}>
                {isConnected == true ? (
                  <TouchableOpacity
                    style={styles.cartButton}
                    onPress={() => {
                      AddtoCart(item, index);
                    }}>
                    <Text style={styles.cartText}>Add To Cart</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.cartButton, {backgroundColor: '#838383'}]}>
                    <Text
                      style={[
                        styles.cartText,
                        {color: isConnected ? '#000000' : '#ffffff'},
                      ]}>
                      Add To Cart
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />
      {isConnected == false ? (
        <View style={styles.isConnected}>
          <Text style={styles.noConnectionText}>No Connection</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    elevation: 4,
    marginTop: 15,
    borderRadius: 10,
    height: 180,
    marginBottom: 10,
  },
  foodItemImage: {
    width: 100,
    height: 'auto',
    margin: 5,
    borderRadius: 10,
  },
  nameView: {
    width: '40%',
    marginTop: 15,
    height:'auto'
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
  cartButton: {
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginRight: 1,
    height: 70,
  },
  cartText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  isConnected: {
    backgroundColor: '#000000',
    width: '100%',
    height: 20,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noConnectionText: {
    color: '#ffffff',
    fontSize: 10,
  },
});
