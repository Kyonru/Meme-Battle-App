import Color from 'color';
import React from 'react';
import {Text, StyleSheet, Dimensions, Image} from 'react-native';
import Svg, {RadialGradient, Defs, Rect, Stop} from 'react-native-svg';
import {Avatar, Colors, View} from 'react-native-ui-lib';
import {Meme, MemeVariation} from '../@types';
import Animated, {SlideInRight} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(Avatar);

const {width, height} = Dimensions.get('screen');
const SIZE = width - 75;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 75,
    alignItems: 'center',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    marginTop: 16,
    // fontFamily: 'SFProDisplay-Bold',
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    // fontFamily: 'SFProDisplay-Regular',
  },
});

export interface SlideProps {
  slide: Meme;
  variations: {[key: string]: MemeVariation};
}

const Slide = ({slide, variations}: SlideProps) => {
  if (!slide) {
    return <View />;
  }
  const {url, color, name} = slide;
  const lighterColor = Color(color).lighten(0.8).toString();

  const isDarkColor = Colors.isDark(color);
  console.log(slide);
  return (
    <>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="gradient" cx="50%" cy="20%">
            <Stop offset="0%" stopColor={lighterColor} />
            <Stop offset="100%" stopColor={color} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#gradient)" />
      </Svg>
      <View style={styles.container}>
        <Image source={{uri: url}} style={styles.image} resizeMode="contain" />
        <View marginB-24>
          <Text
            style={[styles.title, {color: isDarkColor ? 'white' : 'black'}]}>
            {name}
          </Text>
        </View>
        <View marginT-48 row>
          {variations &&
            Object.keys(variations).map((key: string) => (
              <AnimatedView
                entering={SlideInRight}
                key={variations[key].id}
                label={
                  `${variations[key].name}`.charAt(0).toLocaleUpperCase() +
                  `${variations[key].name}`.charAt(1).toLocaleUpperCase()
                }
                containerStyle={{
                  marginHorizontal: 4,
                  borderWidth: 1,
                  borderColor: 'black',
                }}
                size={30}
                backgroundColor={variations[key].color}
                labelColor={
                  Colors.isDark(variations[key].color || 'white')
                    ? 'white'
                    : 'black'
                }
              />
            ))}
        </View>
      </View>
    </>
  );
};

export default Slide;
