import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NetInfo from '@react-native-community/netinfo';
import Loader from '../components/Loader';

const Login = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);

  const [adminData, setAdminData] = useState({});
  const [emailId, setEmailId] = useState('vaibhavshrivastava1310@gmail.com');
  const [password, setPassword] = useState('12345');
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visibleText, setVisibleText] = useState(true);
  useEffect(() => {
    fetchAdminData();
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

  const fetchAdminData = async () => {
    const users = await firestore().collection('admin').get();
    const data = users.docs[0]._data;
    setAdminData(data);
    // console.log('user', users.docs[0]._data);
  };
  const adminLogin = async () => {
    if (emailId == adminData.email && password == adminData.password) {
      setModalVisible(true)
      navigation.navigate('Dashboard');
    } else {
      alert('Wrong Email/Pass');
      setModalVisible(false)
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#000000'} />
      <Text style={styles.title}>Admin Login</Text>
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
      {isConnected ? (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            if (emailId != '' && password != '') {
              adminLogin();
            } else if (emailId == '') {
              alert('Please Enter Registered Email');
            } else {
              alert('Please Enter Registered Password');
            }
          }}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.loginButton, {backgroundColor: '#b2bec3'}]}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      {isConnected == false ? (<View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>) : (<View></View>)}
      <Loader modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    marginTop: 100,
    alignSelf: 'center',
  },
  inputStyle: {
    paddingLeft: 20,
    alignSelf: 'center',
    height: 50,
    marginTop: 30,
    borderWidth: 0.5,
    borderRadius: 10,
    width: '90%',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#ff5523',
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  textContainer: {
    marginBottom: 10,
    marginTop: 10,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
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
