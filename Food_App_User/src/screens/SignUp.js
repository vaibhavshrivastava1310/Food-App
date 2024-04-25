import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import React, {useState,useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import Loader from '../components/Loader';
import auth from '@react-native-firebase/auth';
import NetInfo from '@react-native-community/netinfo';

const SignUp = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [visibleText, setVisibleText] = useState(true);
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
    setEmailId('');
    setName('');
    setMobileNo('');
    setPassword('');
  };

  const handleSubmit = async () => {
    setModalVisible(true);
    let tempAddress = [];
    const addressId = uuid.v4();
    tempAddress.push({street, city, pincode, mobileNo, addressId});
    auth()
      .createUserWithEmailAndPassword(emailId, password)
      .then(() => {
        firestore()
          .collection('userinfo')
          .doc(emailId)
          .set({
            name: name,
            emailid: emailId,
            mobile: mobileNo,
            password: password,
            cart: [],
            address: tempAddress,
          })
          .then(() => {
            // console.log('User added!');
            handleReset();
            navigation.navigate('UserLogin');
            setModalVisible(false);
            Toast.show({
              type: 'success',
              text1: 'Registered Successfully',
              text2: 'Now You can Login',
              text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
              text2Style: {
                color: '#000000',
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
              },
              visibilityTime: 2500,
              position: 'bottom',
            });
          });
      })
      .catch(error => {
        setModalVisible(false);
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'error',
            text1: 'Already Registered',
            text2: 'This Enmail Already Registered',
            text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
            text2Style: {
              color: '#000000',
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            },
            visibilityTime: 2500,
            position: 'bottom',
          });
        }

        if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'Invalid Email',
            text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
            visibilityTime: 2500,
            position: 'bottom',
          });
        }
        Toast.show({
          type: 'error',
          text1: 'Password Must be of 6 digits',
          text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
          visibilityTime: 2500,
          position: 'bottom',
        });
        console.log(error)
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.signupText}>Register Here</Text>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setName(text)}
          value={name}
          style={styles.inputText}
          placeholder="Enter Name"
        />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setEmailId(text)}
          value={emailId}
          style={styles.inputText}
          placeholder="Enter Email"
        />
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setMobileNo(text)}
          value={mobileNo}
          style={styles.inputText}
          keyboardType="number-pad"
          placeholder="Enter Mobile Number"
        />
      </View>
      <View
        style={[
          styles.textContainer,
          {flexDirection: 'row', paddingHorizontal: 15},
        ]}>
        <TextInput
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={visibleText}
          style={styles.inputText}
          placeholder="Enter Password"
        />
        <TouchableOpacity
          onPress={() => {
            setVisibleText(!visibleText);
            setShowPassword(!showPassword);
          }}>
          <FontAwesome
            style={{color: '#000000', fontSize: 20}}
            name={showPassword == false ? 'eye' : 'eye-slash'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setStreet(text)}
          value={street}
          style={styles.inputText}
          placeholder="Enter Street Name"
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
      <TouchableOpacity
        onPress={() => {
          if(isConnected){
          if (
            emailId !== '' &&
            password !== '' &&
            name !== '' &&
            mobileNo !== '' &&
            mobileNo.length > 9 &&
            street !== '' &&
            pincode !== '' &&
            city !== ''
          ) {
            handleSubmit();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Register Cancel',
              text2: 'Enter Correct Data',
              text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
              text2Style: {
                color: '#000000',
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
              },
              visibilityTime: 2500,
              position: 'bottom',
            });
          }
        }}}
        style={[
          styles.textContainer,
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ff5523',
            width: 120,
            height: 50,
          },
        ]}>
        <Text style={{fontSize: 20, color: '#ffffff'}}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.textContainer,
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#95a5a6',
            width: '90%',
            height: 50,
          },
        ]}
        onPress={() => {if(isConnected){navigation.navigate('UserLogin')}}}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontFamily: 'Poppins-Regular',
          }}>
          Already have Account ?
        </Text>
      </TouchableOpacity>
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
      {isConnected == false ? (
        <View style={styles.isConnected}>
          <Text style={styles.noConnectionText}>No Connection</Text>
        </View>
      ) : (
        <View></View>
      )}
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    padding: 10,
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
  signupText: {
    color: '#ff5523',
    fontSize: 25,
    fontFamily: 'Poppins-Bold',
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
  isConnected: {
    backgroundColor: '#000000',
    width: 1000,
    height: 20,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center'
  },
  noConnectionText: {
    color: '#ffffff',
    fontSize: 10,
  },
});
