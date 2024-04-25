import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useRoute} from '@react-navigation/native';
import SubCard from './components/SubCard';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import Loader from './components/Loader';
import Toast from 'react-native-toast-message';
const {height, width} = Dimensions.get('window');
const OrderStatus = ({navigation}) => {
  const isFocued = useIsFocused();
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const [otpText, setOTPText] = useState('');
  const generatedOTP = route.params.OTP;
  const userId = route.params.userId;
  const paymentId = route.params.payment;
  const defaultStatus = route.params.deliveryStatus;
  // console.log('RRRRRR',paymentId)
  // console.log(route.params.address)
  const handleDeliveryStatus = async () => {
    if (otpText == generatedOTP) {
      setModalVisible(true);
      const order = firestore().collection('order').doc(route.params.orderId);
      const orderGet = await order.get();
      // console.log('YYYYYY', orderGet);
      const currentData = orderGet._data.data;
      // console.log('FFFFFFFFFFF',currentData)
      currentData.deliveryStatus = 'Delivered';
      await order.update({data: currentData}).then(() => {
        setModalVisible(false);
        navigation.goBack();
        console.log('status updates');
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Wrong OTP',
        text1Style: {fontSize: 20},
        visibilityTime: 2500,
        position: 'bottom',
      });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{marginTop: 20}}>
        <Text style={styles.orderIdText}>
          {'Order Id :  ' + route.params.orderId}
        </Text>
        <FlatList
          data={route.params.item}
          bounces={false}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({item, index}) => (
            <SubCard
              showMarginatedAtEnd={true}
              cardWidth={width}
              isFirst={index == 0 ? true : false}
              isLast={index == route.params.item.length - 1 ? true : false}
              foodName={item.data.name}
              image={item.data.imageLink}
              description={item.data.description}
              discountPrice={item.data.discountprice}
              price={item.data.price}
              quantity={item.data.quantity}
              fontName="rupee"
            />
          )}
        />
        <View style={styles.infoBox}>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Order By : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold'}]}>
              {route.params?.orderBy}
            </Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Mobile Number : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold'}]}>
              {route.params.mobileNo}
            </Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Total Amount : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold'}]}>
              {route.params.orderTotal}
            </Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Delivery Status : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold'}]}>
              {defaultStatus}
            </Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Payment Id : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold'}]}>
              {route.params.payment}
            </Text>
          </View>
          <View style={styles.dataView}>
            <Text style={styles.infoText}>Address : </Text>
            <Text style={[styles.infoText, {fontWeight:'bold',width:250}]}>
            {'Address: ' +
              route.params.street +
              ', ' +
              route.params.city +
              ', ' +
              route.params.pincode}
            </Text>
          </View>
        </View>
        {defaultStatus != 'Delivered' ? (
          <View
            style={{
              margin: 10,
              padding: 10,
              borderWidth: 0.5,
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={[styles.infoText, {marginLeft: 20, color: 'red'}]}>
                OTP :{' '}
              </Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={text => setOTPText(text)}
                value={otpText}
                placeholder="Enter OTP"
                style={[styles.infoText, {borderWidth: 0.5, width: '60%'}]}
              />
            </View>
            <TouchableOpacity
              style={{
                marginTop: 5,
                marginBottom: 10,
                backgroundColor: '#ff5523',
                borderWidth: 0.5,
                borderRadius: 10,
                height: 50,
                width: '90%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                handleDeliveryStatus();
              }}>
              <Text style={[styles.infoText, {color: '#ffffff'}]}>
                Check OTP
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        <Loader setModalVisible={setModalVisible} modalVisible={modalVisible} />
      </View>
    </ScrollView>
  );
};

export default OrderStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  orderIdText: {
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    padding: 10,
  },
  infoBox: {
    borderRadius: 10,
    margin: 15,
    borderWidth: 0.5,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#000000',
    marginVertical: 6,
    fontFamily: 'Poppins-Regular',
  },
  dataView:{
    flexDirection:'row'
  },
});
