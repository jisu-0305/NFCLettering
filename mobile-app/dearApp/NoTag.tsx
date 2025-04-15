import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from 'react-native';
import LottieView from 'lottie-react-native';

import NoTagImg from './assets/images/notag.png';
import PaperBackground from './assets/background2.png';
import NoTagAnimation from './assets/lottie/notag.json';

const {width} = Dimensions.get('window');

const Home = () => {
  const handlePress = () => {
    Linking.openURL('https://letterring.shop/');
  };

  return (
    <ImageBackground
      source={PaperBackground}
      style={styles.container}
      resizeMode="cover">
      <Text style={styles.title}>Lettering</Text>
      <Text style={styles.mainText}>
        편지를 보려면{'\n'} 기기의 홈 화면에서
        {'\n'}우체통 키링을 태그해주세요
      </Text>

      <View style={styles.imageWrapper}>
        <Image source={NoTagImg} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.animationWrapper}>
        <LottieView
          source={NoTagAnimation}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <Text style={styles.subText}>
        더 이상 유효하지 않은 링크로 접속했어요.{'\n'}
        키링을 다시 태그하고, 새로운 편지를 확인해보세요.
      </Text>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>나도 편지를 쓰고 싶다면?</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D72638', // 대체: theme.colors.MainRed
  },
  mainText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000', // 대체: theme.colors.Gray0
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666', // 대체: theme.colors.Gray1
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width * 0.5,
    height: width * 0.5,
    zIndex: 10,
  },
  animationWrapper: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  lottie: {
    width: 300,
    height: 300,
  },
  buttonWrapper: {
    width: 250,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#D72638',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
