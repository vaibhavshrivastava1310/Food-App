import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppNavigator from './src/AppNavigator';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

export default App;
