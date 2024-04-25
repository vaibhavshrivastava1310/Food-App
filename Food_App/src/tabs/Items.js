import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

const Items = ({navigation}) => {
  const [listOfFoodItems, setListofFoodItems] = useState([]);
  const isFocused = useIsFocused()
  useEffect(() => {
    getItems();
  }, [isFocused]);

  const getItems = () => {
    firestore()
      .collection('fooditem')
      .get()
      .then(querySnapshot => {
        let tempData = [];
        querySnapshot.forEach(documentSnapshot => {
          tempData.push({
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          });
        });
        setListofFoodItems(tempData);
      });
  };

  const handleDelete = docId => {
    firestore()
      .collection('fooditem')
      .doc(docId)
      .delete()
      .then(() => {
        getItems();
      });
  };
  const handleEdit =(item)=>{
    navigation.navigate('EditItem',{
      data:item.data,
      id:item.id
    })
  }
  // console.log('RRRRRRRRRRRRRRRRRR', listOfFoodItems.data[0].imageLink);

  if(listOfFoodItems == '' && listOfFoodItems == undefined){
    return(
      <View styles={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>List of Item</Text>
      </View>
      <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
        <ActivityIndicator color={'#000000'} size={'large'} />
      </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>List of Item</Text>
      </View>
      <FlatList
        data={listOfFoodItems}
        renderItem={({item, index}) => {
          return (
            <View style={styles.itemView}>
              <Image
                source={{uri: item.data.imageLink}}
                style={styles.foodItemImage}
              />
              <View style={styles.nameView}>
                <View style={styles.infoBox}>
                  <Image
                    source={require('../images/name.png')}
                    style={[styles.infoIcon, {height: 25, width: 25}]}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      {fontWeight: 'bold', fontSize: 17},
                    ]}>
                    {item.data.name}
                  </Text>
                </View>
                <View style={styles.infoBox}>
                  <Image
                    source={require('../images/description.png')}
                    style={styles.infoIcon}
                  />
                  <Text style={styles.itemText}>{item.data.description}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Image
                    source={require('../images/amount.png')}
                    style={styles.infoIcon}
                  />
                  <Text
                    style={[
                      styles.itemText,
                      {
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: 'red',
                        marginRight: 7,
                      },
                    ]}>
                    {item.data.discountprice}
                  </Text>
                  <Text
                    style={[
                      styles.itemText,
                      {
                        fontWeight: 'bold',
                        fontSize: 17,
                        color: '#000000',
                        textDecorationLine: 'line-through',
                      },
                    ]}>
                    {item.data.price}
                  </Text>
                </View>
              </View>
              <View style={styles.actionView}>
                <TouchableOpacity onPress={()=>handleEdit(item)}>
                  <Image
                    source={require('../images/edit.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Image
                    source={require('../images/delete.png')}
                    style={[styles.icon, {marginTop: 25}]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Items;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
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
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 120,
    marginBottom: 10,
  },
  foodItemImage: {
    width: 100,
    height: 110,
    margin: 5,
    borderRadius: 10,
  },
  nameView: {
    width: '55%',
    height: 100,
  },
  infoIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  infoBox: {
    flexDirection: 'row',
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
  },
  icon: {
    width: 27,
    height: 27,
  },
  actionView: {
    margin: 10,
  },
});
