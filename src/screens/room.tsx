/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {
  Button,
  Colors,
  LoaderScreen,
  Text,
  Toast,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Slider from '../components/Slider';
import Slide from '../components/Slide';
import {ApiSocketClient} from '../services/api/websocket';
import {RootState} from '../stores';
import {ROOM_EVENT, WS_EVENT} from '../services/api/constants';
import {Meme, Room} from '../@types';
import Svg, {Circle, G} from 'react-native-svg';

const slides = [
  {
    color: '#F2A1AD',
    title: 'Dessert Recipes',
    description:
      'Hot or cold, our dessert recipes can turn an average meal into a memorable event',
    picture: require('../assets/1.png'),
  },
  {
    color: '#0090D6',
    title: 'Healthy Foods',
    description:
      'Discover healthy recipes that are easy to do with detailed cooking instructions from top chefs',
    picture: require('../assets/5.png'),
  },
  {
    color: '#69C743',
    title: 'Easy Meal Ideas',
    description:
      'explore recipes by food type, preparation method, cuisine, country and more',
    picture: require('../assets/4.png'),
  },
  {
    color: '#FB3A4D',
    title: '10000+ Recipes',
    description:
      'Browse thousands of curated recipes from top chefs, each with detailled cooking instructions',
    picture: require('../assets/2.png'),
  },
  {
    color: '#F2AD62',
    title: 'Video Tutorials',
    description:
      'Browse our best themed recipes, cooking tips, and how-to food video & photos',
    picture: require('../assets/3.png'),
  },
];

export const assets = slides.map(({picture}) => picture);

const LiquidSwipe = ({
  variation,
  onChangeVariation,
  memes,
  onSubmitVariation,
}: any) => {
  const [index, setIndex] = useState(0);
  const prev = memes[index - 1];
  const next = memes[index + 1];

  return (
    <Slider
      variation={variation}
      onChangeVariation={onChangeVariation}
      onSubmitVariation={onSubmitVariation}
      key={index}
      index={index}
      setIndex={setIndex}
      // prev={prev && <Slide slide={prev} />}
      next={next && <Slide slide={next} />}>
      <Slide slide={memes[index]} />
    </Slider>
  );
};

const App = () => {
  const [room, setRoom] = useState<Room>();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [currentMeme, setCurrentMeme] = useState<Meme>();
  const [nextMeme, setNextMeme] = useState<Meme>();
  const [loading, setLoading] = useState(true);
  const [variation, setVariation] = useState('');
  const dispatch = useDispatch();
  const userId = useSelector<RootState>(state => state.room.userId);
  const roomId = useSelector<RootState>(state => state.room.roomId);
  const nickname = useSelector<RootState>(state => state.room.nickname);
  const password =
    useSelector<RootState>(state => state.room.password) || undefined;

  const onConnectSocket = useCallback(() => {
    if (ApiSocketClient && roomId) {
      setLoading(true);
      ApiSocketClient.emit(
        WS_EVENT.JOIN,
        {id: roomId, userId, name: nickname, password},
        (response: {joined: boolean; room: Room}) => {
          // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
          setRoom(response.room);
        },
      );
    }
  }, [roomId, nickname, password, userId]);

  const onStart = useCallback(() => {
    if (ApiSocketClient && roomId) {
      Alert.alert(
        'Start new battle!',
        'Are all members in? Joining in middle of a battle can cause some bugs!',
        [
          {
            text: 'Sure!',
            style: 'destructive',
            onPress: () => {
              ApiSocketClient.emit(
                WS_EVENT.START,
                {id: roomId, userId, name: nickname, password},
                (started: boolean) => {
                  // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
                  setLoading(false);
                },
              );
            },
          },
          {text: 'Wait!', style: 'cancel'},
        ],
      );
    }
  }, [roomId, nickname, password, userId]);

  const onNextMeme = useCallback(() => {
    if (ApiSocketClient && roomId) {
      Alert.alert(
        'Are you sure?',
        'Some members might not have submitted their variation.',
        [
          {
            text: 'Sure!',
            style: 'destructive',
            onPress: () => {
              ApiSocketClient.emit(
                WS_EVENT.NEXT_MEME,
                {id: roomId, userId, name: nickname, password},
                (started: boolean) => {
                  // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
                  setLoading(false);
                },
              );
            },
          },
          {text: 'Wait!', style: 'cancel'},
        ],
      );
    }
  }, [roomId, nickname, password, userId]);

  const onSubmitVariation = useCallback(() => {
    if (ApiSocketClient && roomId) {
      ApiSocketClient.emit(
        WS_EVENT.SUBMIT_VARIATION,
        {
          id: roomId,
          userId,
          name: nickname,
          password,
          variation,
          variationOriginalId: undefined,
        },
        (started: boolean) => {
          // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
          setLoading(false);
        },
      );
    }
  }, [roomId, nickname, password, userId, variation]);

  const onChangeVariation = useCallback(
    (value: string) => setVariation(value),
    [],
  );

  const onUpdateMeme = useCallback(
    (response: any) => {
      if (`${response.event}` === `${ROOM_EVENT.newMeme}`) {
        setLoading(false);
        setMemes(memes.concat(response.meme));
        if (!currentMeme) {
          setCurrentMeme(response.meme);
          return;
        }
        setNextMeme(response.meme);
      }
    },
    [currentMeme, memes],
  );

  useEffect(() => {
    onConnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ApiSocketClient.on(`room:${roomId}`, onUpdateMeme);

    return () => {
      ApiSocketClient.off(`room:${roomId}`, onUpdateMeme);
    };
  }, [currentMeme, memes, onUpdateMeme, roomId]);

  return (
    <View style={{flex: 1}}>
      {loading && (
        <>
          <Text
            text40M
            style={{
              position: 'absolute',
              top: 60,
              right: 0,
              left: 0,
              textAlign: 'center',
            }}>
            Room {`\n#${roomId}`}
          </Text>
          <View style={{flex: 1, backgroundColor: 'red'}}>
            <Svg width={400} height={300}>
              <G transform={`translate(${50 + 1},${50 + 1})`}>
                <Circle r={10} fill={'black'} />
              </G>
              <G transform={`translate(${50 + 15},${50 + 15})`}>
                <Circle r={10} fill={'blue'} />
              </G>
              <G transform={`translate(${50 + 20},${45})`}>
                <Circle r={10} fill={'blue'} />
              </G>
            </Svg>
          </View>
          <LoaderScreen
            color={Colors.blue50}
            message="Waiting for host..."
            overlay
          />
          {room?.host === userId && (
            <Button
              style={{
                position: 'absolute',
                bottom: 36,
                left: 24,
                right: 24,
                padding: 24,
                zIndex: 999,
              }}
              text70
              white
              background-orange30
              label={'Start'}
              onPress={onStart}
            />
          )}
        </>
      )}
      {!loading && (
        <LiquidSwipe
          currentMeme={currentMeme}
          nextMeme={nextMeme}
          memes={memes}
          onChangeVariation={onChangeVariation}
          variation={variation}
          onSubmitVariation={onSubmitVariation}
        />
      )}
      {room?.host === userId && !loading && (
        <TouchableOpacity
          style={{
            height: 100,
            width: 50,
            backgroundColor: '#9AD0EC',
            borderTopLeftRadius: 27.5,
            borderBottomLeftRadius: 27.5,
            position: 'absolute',
            top: '50%',
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 8,
          }}
          onPress={onNextMeme}>
          <Icon
            name="skip-next"
            color="white"
            size={30}
            style={{alignItems: 'center', justifyContent: 'center'}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default App;
