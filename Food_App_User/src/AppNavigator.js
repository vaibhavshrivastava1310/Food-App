import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screens/Splash';
import UserLogin from './screens/UserLogin';
import SignUp from './screens/SignUp';
import UserDashboard from './screens/UserDashboard';
import Cart from './screens/Cart';
import Checkout from './screens/checkout/Checkout';
import AddNewAddress from './screens/checkout/AddNewAddress';
import Address from './screens/checkout/Address';
import PaymentStatus from './screens/checkout/PaymentStatus';
import OrderStatus from './screens/OrderStatus';
import EditProfile from './screens/EditProfile';
import {View} from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
        // console.log('XXXXXXXXXXXXXXX',typeof(isLoggedIn))

        if (isLoggedIn == null ) {
          setIsUserLoggedIn('false');
        }
         else {
          setIsUserLoggedIn(isLoggedIn);
        }
      } catch (error) {
        console.error('Error reading login status from AsyncStorage:', error);
        setIsUserLoggedIn(false); // Assume user is not logged in if error occurs
      }
    };

    checkLoginStatus();
  }, []);

  if (isUserLoggedIn === null) {
    // While checking login status, display the splash screen
    return <Splash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isUserLoggedIn == 'true' ? (
          <>
            <Stack.Screen
              component={UserDashboard}
              name="UserDashboard"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={Cart}
              name="Cart"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={Checkout}
              name="Checkout"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={Address}
              name="Address"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={AddNewAddress}
              name="AddNewAddress"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={PaymentStatus}
              name="PaymentStatus"
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
            <Stack.Screen
              component={UserLogin}
              name="UserLogin"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={SignUp}
              name="SignUp"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={EditProfile}
              name="EditProfile"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              component={UserLogin}
              name="UserLogin"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={SignUp}
              name="SignUp"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={UserDashboard}
              name="UserDashboard"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={Cart}
              name="Cart"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={Checkout}
              name="Checkout"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={Address}
              name="Address"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={AddNewAddress}
              name="AddNewAddress"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={PaymentStatus}
              name="PaymentStatus"
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={OrderStatus}
              name="OrderStatus"
              A
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
            <Stack.Screen
              component={EditProfile}
              name="EditProfile"
              options={{
                headerShown: true,
                headerStyle: {elevation: 20},
                headerTintColor: '#ff5523',
                headerStatusBarHeight: 20,
                headerTitleStyle: {fontSize: 28, fontFamily: 'Poppins_Regular'},
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
