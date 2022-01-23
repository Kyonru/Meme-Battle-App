/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Slider from './components/Slider';
import Slide from './components/Slide';

const slides = [
  {
    color: '#F2A1AD',
    title: 'Dessert Recipes',
    description:
      'Hot or cold, our dessert recipes can turn an average meal into a memorable event',
    picture: require('./assets/1.png'),
  },
  {
    color: '#0090D6',
    title: 'Healthy Foods',
    description:
      'Discover healthy recipes that are easy to do with detailed cooking instructions from top chefs',
    picture: require('./assets/5.png'),
  },
  {
    color: '#69C743',
    title: 'Easy Meal Ideas',
    description:
      'explore recipes by food type, preparation method, cuisine, country and more',
    picture: require('./assets/4.png'),
  },
  {
    color: '#FB3A4D',
    title: '10000+ Recipes',
    description:
      'Browse thousands of curated recipes from top chefs, each with detailled cooking instructions',
    picture: require('./assets/2.png'),
  },
  {
    color: '#F2AD62',
    title: 'Video Tutorials',
    description:
      'Browse our best themed recipes, cooking tips, and how-to food video & photos',
    picture: require('./assets/3.png'),
  },
];

export const assets = slides.map(({picture}) => picture);

const LiquidSwipe = () => {
  const [index, setIndex] = useState(0);
  const prev = slides[index - 1];
  const next = slides[index + 1];
  return (
    <Slider
      key={index}
      index={index}
      setIndex={setIndex}
      prev={prev && <Slide slide={prev} />}
      next={next && <Slide slide={next} />}>
      <Slide slide={slides[index]!} />
    </Slider>
  );
};

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={{flex: 1}}>
      <LiquidSwipe />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
