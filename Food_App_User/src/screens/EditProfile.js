import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import Loader from '../components/Loader';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

let userId = '';
const EditProfile = ({navigation}) => {
  const route = useRoute();


  const [isConnected, setIsConnected] = useState(false);

  
  const [password, setPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [name, setName] = useState(route.params.name);
  const [emailID, setEmailId] = useState(route.params.email);
  const [mobileNo, setMobileNo] = useState(route.params.mobile);
  const [newName, setNewName] = useState(route.params.name);
  const [newEmailID, setNewEmailId] = useState(route.params.email);
  const [newMobileNo, setNewMobileNo] = useState(route.params.mobile);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleText, setVisibleText] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);


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


  const handleEditProfile = async () => {
    setModalVisible(true)
    userEmail = await AsyncStorage.getItem('email');
    // console.log(userEmail);
    if (password == route.params.password) {
      firestore()
        .collection('userinfo')
        .doc(userEmail)
        .update({
          name: name,
          mobile: mobileNo,
        })
        .then(() => {
          setModalVisible(false)
          navigation.goBack();
          Toast.show({
            type: 'success',
            text1: 'Profile Updated ',
            text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
            visibilityTime: 2500,
            position: 'bottom',
          });
        });
    } else {
      setModalVisible(false)
      Toast.show({
        type: 'error',
        text1: 'Wrong Password ',
        text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
        visibilityTime: 2500,
        position: 'bottom',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      <TouchableOpacity
        onPress={() => {
          if(isConnected){
          if (
            emailID !== '' &&
            password !== '' &&
            name !== '' &&
            mobileNo !== '' &&
            mobileNo.length > 9
          ) {
            handleEditProfile();
          } else {
            Toast.show({
              type: 'error',
              text1: 'Edit Cancel',
              text2: 'Any Field can not be Empty',
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
        }else{
          Toast.show({
            type: 'error',
            text1: 'Check Data Connection',
            text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
            visibilityTime: 2500,
            position: 'bottom',
          });
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
        <Text style={{fontSize: 20, color: '#ffffff'}}>Edit</Text>
      </TouchableOpacity>
      {isConnected == false ? (
        <View style={styles.isConnected}>
          <Text style={styles.noConnectionText}>No Connection</Text>
        </View>
      ) : (
        <View></View>
      )}
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ffffff',
    flex: 1,
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    padding: 5,
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
