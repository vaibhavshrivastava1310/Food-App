import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SubCard from '../../components/SubCard';
import RazorpayCheckout from 'react-native-razorpay';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';



let userEmail = '';
const {height, width} = Dimensions.get('window');
const Checkout = ({navigation}) => {
  const isFocused = useIsFocused();
  const [cartList, setCartList] = useState([]);
  const [selectedStreet, setSelectedStreet] = useState('No Selected Address');
  const [selectedCity, setSelectedCity] = useState('No Selected Address');
  const [selectedPincode, setSelectedPincode] = useState('No Selected Address');

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    getCartItem();
    getAddressList();
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
  const getTotal = () => {
    let total = 0;
    cartList.map(item => {
      total = total + item.data.quantity * item.data.discountprice;
    });
    return total;
  };

  const getCartItem = async () => {
    userEmail = await AsyncStorage.getItem('email');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('UUUUUUUUUUUUU',user._data.cart)
    setCartList(user._data.cart);
  };

  const payNow = async () => {
    const OTP = Math.floor(Math.random() * 9000) + 1000;
    const email = await AsyncStorage.getItem('email');
    const name = await AsyncStorage.getItem('name');
    const mobile = await AsyncStorage.getItem('mobile');
    var options = {
      description: 'Credits towards consultation',
      image: require('../../../assets/images/logo.png'),
      currency: 'INR',
      key: 'rzp_test_BY2kikH139oaCX',
      amount: getTotal() * 100,
      name: 'Food Service',
      order_id: '', //Replace this with an order_id created using Orders API.
      prefill: {
        email: email,
        contact: mobile,
        name: name,
      },
      theme: {color: '#53a20e'},
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success
        navigation.navigate('PaymentStatus', {
          status: 'success',
          paymentId: data.razorpay_payment_id,
          cartList: cartList,
          total: getTotal(),
          street: selectedStreet,
          city: selectedCity,
          pincode: selectedPincode,
          userEmail: userEmail,
          userName: name,
          userEmail: email,
          userMobile: mobile,
          OTP: OTP,
        });
      })
      .catch(error => {
        // handle failure
        console.log('EREEEE', error);
        Toast.show({
          type: 'error',
          text1: 'Payment Cancel',
          text1Style: {fontFamily: 'Poppins-Regular', fontSize: 20},
          visibilityTime: 2500,
          position: 'bottom',
        });
        // alert(`Error: ${error.code} | ${error.description}`);
        navigation.navigate('PaymentStatus', {status: 'fail'});
      });
  };

  const getAddressList = async () => {
    const userEmail = await AsyncStorage.getItem('email');
    const addressId = await AsyncStorage.getItem('Address');
    const user = await firestore().collection('userinfo').doc(userEmail).get();
    // console.log('ADDDDDDDDDD',user)
    let tempAddress = [];
    tempAddress = user._data.address;
    tempAddress.map(item => {
      if (item.addressId == addressId) {
        setSelectedStreet(item.street);
        setSelectedPincode(item.pincode);
        setSelectedCity(item.city);
      }
    });
  };
  if (isConnected == true) {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={cartList}
            bounces={false}
            horizontal
            scrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.containerGap}
            renderItem={({item, index}) => (
              <SubCard
                showMarginatedAtEnd={true}
                cardWidth={width}
                isFirst={index == 0 ? true : false}
                isLast={index == cartList.length - 1 ? true : false}
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
        </View>
        <View style={styles.totalPriceView}>
          <Text style={styles.totalText1}>Total</Text>
          <View style={styles.totalTextView}>
            <FontAwesome name="rupee" style={styles.rupeeIcon} />
            <Text style={styles.totalText2}>{getTotal()}</Text>
          </View>
        </View>
        <View style={styles.addressView}>
          <Text style={[styles.totalText1, {fontSize: 15, marginVertical: 10}]}>
            Selected Address
          </Text>
          <Text
            style={[
              styles.totalText2,
              {
                color: 'blue',
                textDecorationLine: 'underline',
                marginVertical: 10,
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
              },
            ]}
            onPress={() => {
              navigation.navigate('Address');
            }}>
            Change Address
          </Text>
        </View>
        {selectedStreet == 'No Selected Address' &&
        selectedPincode == 'No Selected Address' &&
        selectedCity == 'No Selected Address' ? (
          <Text style={styles.addressText}>{selectedStreet}</Text>
        ) : (
          <Text style={styles.addressText}>
            {selectedStreet +
              ', ' +
              selectedCity +
              ', ' +
              selectedPincode +
              ', '}
          </Text>
        )}
        <TouchableOpacity
          disabled={selectedStreet == 'No Selected Address' ? true : false}
          style={[
            styles.paymentBtn,
            {
              backgroundColor:
                selectedStreet == 'No Selected Address' ? '#838383' : '#ff5523',
            },
          ]}
          onPress={() => {
            if (selectedStreet != 'No Selected Address') {
              payNow();
            }
          }}>
          <Text style={[styles.payFont, {marginRight: 15}]}>Pay Now</Text>
          <FontAwesome name="rupee" style={styles.payFont} />
          <Text style={[styles.payFont, {marginLeft: 5, marginTop: 3}]}>
            {getTotal()}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  else{
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={cartList}
          bounces={false}
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.containerGap}
          renderItem={({item, index}) => (
            <SubCard
              showMarginatedAtEnd={true}
              cardWidth={width}
              isFirst={index == 0 ? true : false}
              isLast={index == cartList.length - 1 ? true : false}
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
      </View>
      <View style={styles.totalPriceView}>
        <Text style={styles.totalText1}>Total</Text>
        <View style={styles.totalTextView}>
          <FontAwesome name="rupee" style={styles.rupeeIcon} />
          <Text style={styles.totalText2}>{getTotal()}</Text>
        </View>
      </View>
      <View style={styles.addressView}>
        <Text style={[styles.totalText1, {fontSize: 15, marginVertical: 10}]}>
          Selected Address
        </Text>
        <Text
          style={[
            styles.totalText2,
            {
              color: 'blue',
              textDecorationLine: 'underline',
              marginVertical: 10,
              fontSize: 15,
              fontFamily: 'Poppins-Regular',
            },
          ]}>
          Change Address
        </Text>
      </View>
      {selectedStreet == 'No Selected Address' &&
      selectedPincode == 'No Selected Address' &&
      selectedCity == 'No Selected Address' ? (
        <Text style={styles.addressText}>{selectedStreet}</Text>
      ) : (
        <Text style={styles.addressText}>
          {selectedStreet + ', ' + selectedCity + ', ' + selectedPincode + ', '}
        </Text>
      )}
      <TouchableOpacity
        disabled={selectedStreet == 'No Selected Address' ? true : false}
        style={[
          styles.paymentBtn,
          {
            backgroundColor:isConnected==false || selectedStreet == 'No Selected Address' ? '#838383' : '#ff5523',
          },
        ]}>
        <Text style={[styles.payFont, {marginRight: 15}]}>Pay Now</Text>
        <FontAwesome name="rupee" style={styles.payFont} />
        <Text style={[styles.payFont, {marginLeft: 5, marginTop: 3}]}>
          {getTotal()}
        </Text>
      </TouchableOpacity>
      <View style={styles.isConnected}>
        <Text style={styles.noConnectionText}>No Connection</Text>
      </View>
    </View>
  );
  }
};

export default Checkout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  itemView: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    elevation: 4,
    borderRadius: 10,
  },
  foodItemImage: {
    width: 100,
    height: 130,
    margin: 5,
    borderRadius: 10,
  },
  nameView: {
    width: '42%',
    marginTop: 15,
    // backgroundColor:'green'
  },
  infoIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'red',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  quantityText: {
    alignSelf: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    fontSize: 15,
  },
  totalPriceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor:'red',
    marginTop: 20,
    marginHorizontal: 30,
    borderTopWidth: 0.3,
    padding: 10,
  },
  totalTextView: {
    flexDirection: 'row',
  },
  totalText1: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
  },
  rupeeIcon: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    marginRight: 4,
    marginTop: 6,
    marginLeft: 3,
  },
  totalText2: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  containerGap: {
    gap: 20,
  },
  addressView: {
    flexDirection: 'row',
    borderTopWidth: 0.3,
    marginHorizontal: 15,
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 15,
    margin: 15,
    color: '#000000',
    fontFamily: 'Poppins-SemiBold',
    width: '100%',
  },
  paymentBtn: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#ff5523',
    width: '90%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  payFont: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
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
