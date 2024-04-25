import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Splash from './screens/Splash';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import EditItem from './screens/EditItem';
import OrderStatus from './OrderStatus';

const Stack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={Splash}
          name="Splash"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Login}
          name="Login"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={Dashboard}
          name="Dashboard"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={EditItem}
          name="EditItem"
          options={{headerShown: false}}
        />
        <Stack.Screen
          component={OrderStatus}
          name="OrderStatus"
          options={{
            headerShown: true,
            headerStyle: {elevation: 20},
            headerTintColor: '#ff5523',
            headerStatusBarHeight: 20,
            headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
