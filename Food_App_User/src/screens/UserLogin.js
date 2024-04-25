import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import {translation} from '../Utils';

const UserLogin = ({navigation}) => {
  // const isFocused = useIsFocused
  const [userData, setUserData] = useState({});
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleText, setVisibleText] = useState(true);

  const [isConnected, setIsConnected] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    handleReset();
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

  const handleReset = () => {
    setEmailId('');
    setPassword('');
  };

  const handleUserLogin = async () => {
    setModalVisible(true);
    firestore()
      .collection('userinfo')
      .where('emailid', '==', emailId)
      .get()
      .then(querySnapshot => {
        setModalVisible(false);
        /* ... */
        // console.log('srsrrsr', querySnapshot.docs[0].id);
        if (querySnapshot.docs[0]._data !== null) {
          if (
            querySnapshot.docs[0]._data.emailid === emailId &&
            querySnapshot.docs[0]._data.password === password
          ) {
            goToDashboard(
              querySnapshot.docs[0]._data.mobile,
              querySnapshot.docs[0]._data.name,
              querySnapshot.docs[0]._data.emailid,
            );
          } else {
            Toast.show({
              type: 'error',
              text1: 'Login Cancel',
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
        }
      })
      .catch(error => {
        setModalVisible(false);
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Login Cancel',
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
      });
  };

  const goToDashboard = async (mobileNo, name, email) => {
    // console.log('EMAILLL', email);
    // console.log('Euserrrr', userId);
    // console.log('mooooo', mobileNo);
    // console.log('NAMMMMMM', name);
    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('mobile', mobileNo);
      await AsyncStorage.setItem('name', name);
      navigation.navigate('UserDashboard');
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.log('ERRRRRRRRR', error);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headingView}>
        <Text style={styles.loginText}>Login</Text>
      </View>
      <View style={styles.textContainer}>
        <TextInput
          onChangeText={text => setEmailId(text)}
          value={emailId}
          style={styles.inputText2}
          placeholder="Enter Registered Email"
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
          style={styles.inputText2}
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
      <TouchableOpacity
        onPress={() => {
          if(isConnected == true){
          if (emailId !== '' && password !== '') {
            handleUserLogin();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Login Failed',
              text2: 'Fill all details',
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
          }
          else{
            Toast.show({
              type: 'error',
              text1: 'Check Data Connection',
              text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
              visibilityTime: 2500,
              position: 'bottom',
            });
          }
        }}
        style={styles.loginBtnView}>
        <Text style={styles.loginText2}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.loginBtnView, {backgroundColor: '#95a5a6'}]}
        onPress={() => handleSignUp()}>
        <Text style={[styles.loginText2, {color: '#ffffff'}]}>Sign Up</Text>
      </TouchableOpacity>
      {isConnected == false ? (<View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>) : (<View></View>)}
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default UserLogin;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginTop: '50%',
  },
  inputView: {
    flex: 1,
  },
  text: {
    borderWidth: 0.5,
    height: 50,
    width: '90%',
    marginBottom: 5,
    marginTop: 5,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Regular',
    padding: 10,
  },
  headingView: {
    marginBottom: 20,
  },
  loginText: {
    fontSize: 30,
    color: '#ff5523',
    // fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  signUpTextView: {
    flexDirection: 'row',
  },
  text2: {
    color: '#000000',
    marginRight: 2,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  loginBtnView: {
    backgroundColor: '#ff5523',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginTop: 20,
  },
  loginText2: {
    color: '#ffffffff',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
  },
  textContainer: {
    marginBottom: 10,
    marginTop: 10,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  inputText2: {
    // borderWidth: 0.5,
    width: '90%',
    height: 50,
    borderColor: '#000000',
    color: '#000000',
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
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
