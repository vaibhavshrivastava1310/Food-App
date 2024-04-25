import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const PaymentStatus = ({navigation}) => {
  useEffect(() => {
    if (route.params.status == 'success') {
      placeOrder();
    }
  }, []);

  const placeOrder = async () => {
    let tempOrders = [];
    const orderId = uuid.v4();
    let user = await firestore()
      .collection('userinfo')
      .doc(route.params.userEmail)
      .get();
    // console.log('OOOOO',user._data.orders)
    // tempOrders = user._data.orders;
    if (user._data.orders != null) {
      tempOrders = user._data.orders;
      tempOrders.push({
        item: route.params.cartList,
        street: route.params.street,
        city: route.params.city,
        pincode: route.params.pincode,
        orderBy: route.params.userName,
        userEmail: route.params.userEmail,
        userMobile: route.params.userMobile,
        orderTotal: route.params.total,
        orderId: orderId,
        paymentId: route.params.paymentId,
        OTP: route.params.OTP,
      });
      firestore()
        .collection('userinfo')
        .doc(route.params?.userEmail)
        .update({
          cart: [],
          orders: tempOrders,
        })
        .catch(error => {
          console.log('errrrrr', error);
        });
      firestore()
        .collection('order')
        .doc(orderId)
        .set({
          data: {
            item: route.params.cartList,
            street: route.params.street,
            city: route.params.city,
            pincode: route.params.pincode,
            orderBy: route.params.userName,
            userEmail: route.params.userEmail,
            userMobile: route.params.userMobile,
            orderTotal: route.params.total,
            orderId: orderId,
            paymentId: route.params.paymentId,
            OTP: route.params.OTP,
            deliveryStatus:'Not Delivered'
          },
          orderBy: route.params.userEmail,
        })
        .catch(error => {
          console.log('errrrrr', error);
        });
    } else {
      tempOrders.push({
        item: route.params.cartList,
        street: route.params.street,
        city: route.params.city,
        pincode: route.params.pincode,
        orderBy: route.params.userName,
        userEmail: route.params.userEmail,
        userMobile: route.params.userMobile,
        orderTotal: route.params.total,
        orderId: orderId,
        paymentId: route.params.paymentId,
        OTP: route.params.OTP,
      });
      firestore()
        .collection('userinfo')
        .doc(route.params?.userEmail)
        .update({
          cart: [],
          orders: tempOrders,
        })
        .catch(error => {
          console.log('errrrrr', error);
        });
      firestore()
        .collection('order')
        .doc(orderId)
        .set({
          data: {
            item: route.params.cartList,
            street: route.params.street,
            city: route.params.city,
            pincode: route.params.pincode,
            orderBy: route.params.userName,
            userEmail: route.params.userEmail,
            userMobile: route.params.userMobile,
            orderTotal: route.params.total,
            orderId: orderId,
            paymentId: route.params.paymentId,
            OTP: route.params.OTP,
            deliveryStatus:'Not Delivered'
          },
          orderBy: route.params.userEmail,
        })
        .catch(error => {
          console.log('errrrrr', error);
        });
    }
  };
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Image
        source={
          route.params.status == 'success'
            ? require('../../../assets/images/checked.png')
            : require('../../../assets/images/cancel.png')
        }
        style={styles.icon}
      />
      <Text style={styles.message}>
        {route.params.status == 'success'
          ? 'Order Placed Successfully !!'
          : 'Order Failed !!'}
      </Text>
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => {
          navigation.navigate('Main');
        }}>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Poppins-Regular',
            color: '#000000',
          }}>
          Go To Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentStatus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  message: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 50,
    fontSize: 20,
  },
  homeBtn: {
    width: '50%',
    height: 50,
    // backgroundColor:'#ff5523',
    borderWidth: 0.5,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
