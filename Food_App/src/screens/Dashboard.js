import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState,useEffect} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Items from '../tabs/Items';
import Add from '../tabs/Add';
import Orders from '../tabs/Orders';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NetInfo from '@react-native-community/netinfo';
import Loader from '../components/Loader';

const Tab = createBottomTabNavigator()
const Dashboard = ({navigation}) => {
  const [isConnected, setIsConnected] = useState(false);
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

return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true, // whenever we type tab bar will hide
        headerShown: false, // for hidden of header tab
        tabBarStyle: {
          backgroundColor: '#f2f2f2',
          borderTopWidth: 0,
          height: 60,
        },
        backgroundColor:'#ffffff'
      }}>
      <Tab.Screen
        name="Order"
        component={Orders}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={[
                styles.activeTabBackground,
                focused ? {height:40,width:40} : {},
              ]}>
                <Image source={require('../images/order.png')} style={styles.bottomTabImage} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Items"
        component={Items}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {height:40,width:40} : {},
                ]}>
                    <Image source={require('../images/items.png')} style={styles.bottomTabImage} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View style={[
                styles.activeTabBackground,
                focused ? {height:40,width:40} : {},
              ]}>
                <Image source={require('../images/add.png')} style={styles.bottomTabImage} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    position: 'absolute',
    bottom: 0,
  },
  bottomTab: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabImage: {
    width: 25,
    height: 25,
  },
});
