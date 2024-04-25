import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const {height, width} = Dimensions.get('screen');
const Header = ({title, count, onClickIcon, iconName}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {iconName && (
        <View
          style={{
            height: 60,
            width: 60,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}>
          <TouchableOpacity
            style={styles.btnTouch}
            onPress={() => onClickIcon()}>
            <Icon name={iconName} style={styles.cartIcon} />
          </TouchableOpacity>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{count ? count : 0}</Text>
            </View>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: width,
    elevation: 5,
    backgroundColor: '#ffffff',
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#ff5523',
  },
  cartIcon: {
    fontSize: 35,
    color: '#000000',
  },
  btnTouch: {},
  countText: {
    fontSize: 22,
    top: 0,
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  countContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 30,
    width: 30,
    backgroundColor: '#ff5523',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
