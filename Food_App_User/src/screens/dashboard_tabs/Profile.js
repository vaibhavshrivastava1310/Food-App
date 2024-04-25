import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwsome from 'react-native-vector-icons/FontAwesome6';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

let userEmail = '';
const Profile = ({navigation}) => {
  const isFocused = useIsFocused();
  const [userInfo, setUserInfo] = useState([]);

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
    userData();
  }, [isFocused]);

  const userData = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ussss', user._data);
    setUserInfo(user._data);
  };

  const handleLogout = async () => {
    if (isConnected == true) {
      await AsyncStorage.setItem('isLoggedIn', 'false');
      navigation.navigate('UserLogin');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Check Data Connection',
        text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
        visibilityTime: 2500,
        position: 'bottom',
      });
    }
  };

  const handleProfileEdit = () => {
    navigation.navigate('EditProfile', {
      name: userInfo.name,
      email: userInfo.emailid,
      mobile: userInfo.mobile,
      password: userInfo.password,
    });
  };
  // console.log('ussssss',userInfo.emailid)

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello ,</Text>
      <View style={styles.infoView}>
        <Text style={[styles.infoText]}>{userInfo.name}</Text>
        <Text style={styles.infoText}>{userInfo.emailid}</Text>
        <Text style={styles.infoText}>{userInfo.mobile}</Text>
      </View>
      <View style={styles.actionView}>
        <TouchableOpacity
          style={styles.buttonTouch}
          onPress={() => {
            if (isConnected) {
              handleProfileEdit();
            }
          }}>
          <FontAwsome style={styles.iconStyle} name="user-pen" />
          <Text style={styles.textStyle}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonTouch}
          onPress={() => {
            if (isConnected) {
              navigation.navigate('Orders');
            }
          }}>
          <FontAwsome style={styles.iconStyle} name="bag-shopping" />
          <Text style={styles.textStyle}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonTouch}
          onPress={() => {
            if (isConnected) {
              navigation.navigate('Cart');
            }
          }}>
          <FontAwsome style={styles.iconStyle} name="cart-shopping" />
          <Text style={styles.textStyle}>Cart</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => {
          handleLogout();
        }}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Icon style={styles.logoutText} name="logout" />
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

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  logoutBtn: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    width: '90%',
    height: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 5,
    color: '#000000',
  },
  helloText: {
    color: '#ff5523',
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 10,
    marginLeft: 7,
  },
  infoView: {
    padding: 10,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#000000',
  },
  buttonTouch: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    marginVertical: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  textStyle: {
    fontSize: 17,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    marginLeft: 10,
  },
  iconStyle: {
    fontSize: 17,
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
