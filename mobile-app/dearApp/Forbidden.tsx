import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

import ForbiddenImg from './assets/images/image.png';
import PaperBackground from './assets/background2.png';

const {width} = Dimensions.get('window');

const Forbidden = () => {
  return (
    <ImageBackground
      source={PaperBackground}
      style={styles.container}
      resizeMode="cover">
      <Text style={styles.title}>Lettering</Text>
      <Text style={styles.mainText}>이 기기로는 접근할 수 없어요</Text>

      <View style={styles.imageWrapper}>
        <Image
          source={ForbiddenImg}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.subText}>
        접근이 제한된 키링이에요{'\n'}
        유효하지 않거나 권한이 없는 키링입니다.
      </Text>
    </ImageBackground>
  );
};

export default Forbidden;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
    backgroundColor: '#fff',
    gap: '2rem',
    paddingVertical: 100,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D72638', // 대체: theme.colors.MainRed
  },
  mainText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000', // 대체: theme.colors.Gray0
  },
  subText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666', // 대체: theme.colors.Gray1
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    zIndex: 10,
  },
});
