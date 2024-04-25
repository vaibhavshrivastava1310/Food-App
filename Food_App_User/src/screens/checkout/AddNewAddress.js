import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState,useEffect} from 'react';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../components/Loader';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';

const AddNewAddress = ({navigation}) => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [mobileNo, setMobileNo] = useState('');
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

  const handleReset = () => {
    setPincode('');
    setStreet('');
    setMobileNo('');
    setCity('');
  };

  const saveAddress = async () => {
    setModalVisible(true)
    const userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempAddress = [];
    tempAddress = user._data.address;
    const addressId = uuid.v4();
    tempAddress.push({street, city, pincode, mobileNo, addressId});
    firestore()
      .collection('userinfo')
      .doc(userEmail)
      .update({
        address: tempAddress,
      })
      .then(() => {
        console.log('User added!');
        handleReset();
        navigation.navigate('Address');
        setModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Address Added Successfully',
          text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
          visibilityTime: 2500,
          position: 'bottom',
        });
      })
      .catch(error => {
        console.log('Erorrrr', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setStreet(text)}
          value={street}
          style={styles.inputText}
          placeholder="Enter Street"
        />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setCity(text)}
          value={city}
          style={styles.inputText}
          placeholder="Enter City"
        />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setPincode(text)}
          value={pincode}
          style={styles.inputText}
          keyboardType="number-pad"
          placeholder="Enter Pincode"
        />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setMobileNo(text)}
          value={mobileNo}
          style={styles.inputText}
          maxLength={10}
          keyboardType="number-pad"
          placeholder="Enter Mobile Number"
        />
      </View>
      <TouchableOpacity
        style={[styles.addNewBtn,{backgroundColor:isConnected?'#ff5523':'#838383'}]}
        onPress={() => {
          if(isConnected){
          if (
            pincode !== '' &&
            city !== '' &&
            street !== '' &&
            mobileNo !== '' &&
            mobileNo.length > 9
          ) {
            saveAddress();
          } else {
            Toast.show({
              type:'error',
              text1:"Cann't submit Address",
              text2: 'some field is missing',
              text1Style:{fontFamily:'Poppins-Regular',fontSize:20},
              text2Style:{color:'#000000',fontSize:15,fontFamily:'Poppins-Regular'},
              visibilityTime:2500,
              position:'bottom'
            })
          }
        }}}>
        <Text style={styles.btnText}>Save Address</Text>
      </TouchableOpacity>
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

export default AddNewAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginTop: 5,
  },
  textContainer: {
    marginBottom: 10,
    marginTop: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: 5,
    alignSelf:'center'
  },
  inputText: {
    // borderWidth: 0.5,
    width: '90%',
    height: 50,
    borderColor: '#000000',
    color: '#000000',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
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
