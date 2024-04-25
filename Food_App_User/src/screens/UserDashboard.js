import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Main from './dashboard_tabs/Main';
import Orders from './dashboard_tabs/Orders';
import Profile from './dashboard_tabs/Profile';
import Icon from 'react-native-vector-icons/Octicons';
import Icons  from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator();
const Dashboard = ({navigation}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true, // whenever we type tab bar will hide
        headerShown: false, // for hidden of header tab
        tabBarStyle: {
          backgroundColor: '#f2f2f2',
          borderTopWidth: 0,
          height: 80,
        },
        backgroundColor: '#ffffff',
      }}>
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#ff5523'} : {},
                ]}>
                <Icon color={'#000000'} size={25} name="home" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#ff5523'} : {},
                ]}><Icons color={'#000000'} size={28} name="bag-check-outline" /></View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Prfile"
        component={Profile}
        options={{
          tabBarShowLabel: false, // to block tab bar label
          tabBarIcon: ({focused, color, size}) => {
            return (
              <View
                style={[
                  styles.activeTabBackground,
                  focused ? {backgroundColor: '#ff5523'} : {},
                ]}><Icon color={'#000000'} size={25} name='person'/></View>
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
  activeTabBackground: {
    padding: 15,
    borderRadius: 150,
  },
});
