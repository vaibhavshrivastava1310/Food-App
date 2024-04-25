import {StyleSheet, Text, View, StatusBar, FlatList, Image, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import Loader from '../components/Loader';
const Orders = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const isFocued=useIsFocused()
  const [modalVisible,setModalVisible]=useState(false)

  useEffect(() => {
    getOrderList();
  }, [isFocued]);

  const getOrderList = async () => {
    firestore()
      .collection('order')
      .get()
      .then(querySnapshot => {
        // console.log('Total orders: ', querySnapshot);
        let tempData = [];
        querySnapshot.forEach(documentSnapshot => {
          // console.log('User ID: ', documentSnapshot.data());
          tempData.push({
            orderId: documentSnapshot.id,
            data: documentSnapshot.data().data,
          });
        });
        // console.log(tempData);
        setOrders(tempData);
      });
  };
  const handleOrderDetail =(index)=>{
    // console.log(orders[index].data)
    const info = orders[index].data
    navigation.navigate('OrderStatus',{
      city:info.city,
      street:info.street,
      pincode:info.pincode,
      mobileNo:info.userMobile,
      OTP:info.OTP,
      item:info.item,
      orderId:info.orderId,
      orderBy:info.orderBy,
      orderTotal:info.orderTotal,
      userEmail:info.userEmail,
      userId : info.userId,
      deliveryStatus:info.deliveryStatus,
      payment:info.paymentId
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={({item, index}) => console.log("XXXXXX",index)}
        renderItem={({item, index}) => {
          // console.log('item' + item);
          return (
            <View style={styles.orderItem}>
              <FlatList
                data={item.data.item}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.itemView}>
                      <Image
                        source={{uri: item.data.imageLink}}
                        style={styles.itemImage}
                      />
                      <View style={styles.infoView}>
                        <Text style={styles.nameText}>{item.data.name}</Text>
                        <Text style={styles.nameText}>
                          {'Price: ' +
                            item.data.discountprice +
                            ', Qty: ' +
                            item.data.quantity}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
              <TouchableOpacity style={{justifyContent:'center',alignSelf:'center',height:50,padding:10,alignItems:'center',backgroundColor:'#ff5523'}} onPress={()=>handleOrderDetail(index)}>
                <Text style={{fontFamily:'Poppins-Regular',color:'#ffffff'}}>Check Order Info</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <Loader setModalVisible={setModalVisible} modalVisible={modalVisible} />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  orderItem: {
    width: '90%',
    borderRadius: 10,
    flexDirection:'row',
    elevation: 5,
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  itemView: {
    margin: 10,
    width: '100%',
    flexDirection: 'row',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 20,
    marginTop: 5,
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#ffff',
    elevation: 5,
    padding: 20,
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  headerText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 20,
  },
  infoView:{
    // backgroundColor:'red'
  }
});
