import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

let userEmail = ' ';
const Address = ({navigation}) => {
  const isFocused = useIsFocused();
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

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
    getAddressList();
  }, [isFocused]);

  const getAddressList = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const addressId = await AsyncStorage.getItem('Address');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempAddress = [];
    tempAddress = user._data.address;
    tempAddress.map(item => {
      if (item.addressId == addressId) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    setAddressList(tempAddress);
  };

  const saveDefaultAddress = async item => {
    await AsyncStorage.setItem('Address', item.addressId);
    let tempAddress = [];
    tempAddress = addressList;
    if (addressList != null && addressList != undefined) {
      if (addressList != '')
        tempAddress.map(itm => {
          if (itm.addressId == item.addressId) {
            itm.selected = true;
          } else {
            itm.selected = false;
          }
        });
    }

    let temp = [];
    tempAddress.map(item => {
      temp.push(item);
    });
    setAddressList(temp);
  };

  // console.log('AAAAAAAAAAAAA',addressList)
  return (
    <View style={styles.container}>
      <FlatList
        data={addressList}
        renderItem={({item, index}) => {
          return (
            <View
              style={[
                styles.addressView,
                {marginBottom: index == addressList.length - 1 ? 100 : 10},
              ]}>
              <View style={{width: '70%', marginRight: 8}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000000',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {'Street : ' + item.street}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000000',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {'City : ' + item.city}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000000',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {'Pincode : ' + item.pincode}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000000',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {'Mobile Number : ' + item.mobileNo}
                </Text>
              </View>
              {item.selected == true ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: '#000000',
                    fontFamily: 'Poppins-Regular',
                    alignSelf: 'center',
                  }}>
                  Default
                </Text>
              ) : (
                <TouchableOpacity
                  style={styles.defaultBtn}
                  onPress={() => {
                    if (isConnected == true) {
                      saveDefaultAddress(item);
                    } else {
                      Toast.show({
                        type: 'error',
                        text1: 'Check Data Connection',
                        text1Style: {
                          fontFamily: 'Poppins-Regular',
                          fontSize: 20,
                        },
                        visibilityTime: 2500,
                        position: 'bottom',
                      });
                    }
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#000000',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Set Default
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />
      <TouchableOpacity
        style={[styles.addNewBtn,{backgroundColor:isConnected?'#ff5523':'#838383'}]}
        onPress={() => {
          if (isConnected) {
            navigation.navigate('AddNewAddress');
          }
        }}>
        <Text style={[styles.btnText]}>Add New Address</Text>
      </TouchableOpacity>
      {isConnected == false ? (
        <View style={styles.isConnected}>
          <Text style={styles.noConnectionText}>No Connection</Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  addNewBtn: {
    width: '90%',
    height: 50,
    backgroundColor: '#ff5523',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  btnText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#ffffff',
    fontSize: 18,
  },
  addressView: {
    width: '90%',
    backgroundColor: '#f2f2f2',
    elevation: 4,
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  defaultBtn: {
    backgroundColor: '#74b9ff',
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
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
