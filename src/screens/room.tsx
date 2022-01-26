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
import {Alert, View, Dimensions} from 'react-native';
import {
  Button,
  Colors,
  LoaderScreen,
  Text,
  TouchableOpacity,
} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Slider from '../components/Slider';
import Slide from '../components/Slide';
import {ApiSocketClient} from '../services/api/websocket';
import {RootState} from '../stores';
import {ROOM_EVENT, WS_EVENT} from '../services/api/constants';
import {Member, Meme, MemeVariation, Room} from '../@types';
import Svg, {Circle, G, Text as SVGText} from 'react-native-svg';
import {getBubbleTitleSize, packBubbles} from '../utils/bubbles';
import Color from 'color';

const {width} = Dimensions.get('screen');

const LiquidSwipe = ({
  variation,
  onChangeVariation,
  memes,
  variations,
  onSubmitVariation,
}: any) => {
  const [index, setIndex] = useState(0);
  // const prev = memes[index - 1];
  const next = memes[index + 1];

  return (
    <Slider
      variation={variation}
      onChangeVariation={onChangeVariation}
      onSubmitVariation={onSubmitVariation}
      key={index}
      index={index}
      meme={memes[index]?.id}
      setIndex={setIndex}
      // prev={prev && <Slide slide={prev} />}
      next={
        next && <Slide variations={variations[memes[index]?.id]} slide={next} />
      }>
      <Slide
        variations={variations[memes[index]?.id]}
        key={index}
        slide={memes[index]}
      />
    </Slider>
  );
};

const App = () => {
  const [room, setRoom] = useState<Room>();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [memeVariations, setMemeVariations] = useState<{
    [key: string]: MemeVariation;
  }>({});
  const [variation, setVariation] = useState('');
  const userId = useSelector<RootState>(state => state.room.userId);
  const roomId = useSelector<RootState>(state => state.room.roomId);
  const userColor = useSelector<RootState>(state => state.room.color);
  const nickname = useSelector<RootState>(state => state.room.nickname);
  const password =
    useSelector<RootState>(state => state.room.password) || undefined;

  const onConnectSocket = useCallback(() => {
    if (ApiSocketClient && roomId) {
      setLoading(true);
      ApiSocketClient.emit(
        WS_EVENT.JOIN,
        {id: roomId, userId, name: nickname, password, color: userColor},
        (response: {joined: boolean; room: Room}) => {
          setRoom(response.room);
          if (
            response.room.members &&
            Object.keys(response.room.members).length
          ) {
            const mbs = Object.keys(response.room.members).map(
              key => response.room.members[key],
            );
            setMembers(mbs);
          }
        },
      );
    }
  }, [roomId, nickname, password, userId, userColor]);

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
                () => {
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
                () => {
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

  const onSubmitVariation = useCallback(
    (memeId?: string) => {
      if (ApiSocketClient && roomId && memeId && variation) {
        ApiSocketClient.emit(
          WS_EVENT.SUBMIT_VARIATION,
          {
            roomId,
            userId,
            memeId,
            variation,
            variationOriginalId: undefined,
          },
          () => {
            // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
            setLoading(false);
          },
        );
      }
    },
    [roomId, userId, variation],
  );

  const onChangeVariation = useCallback(
    (value: string) => setVariation(value),
    [],
  );

  const onRoomUpdate = useCallback(
    (response: any) => {
      if (`${response.event}` === `${ROOM_EVENT.newMeme}`) {
        setLoading(false);
        setMemes(memes.concat(response.meme));
      }
      if (`${response.event}` === `${ROOM_EVENT.joined}`) {
        setMembers(members.concat(response.user));
      }
      if (`${response.event}` === `${ROOM_EVENT.newVariation}`) {
        setMemeVariations({
          ...memeVariations,
          [response.meme]: {
            ...memeVariations[response.meme],
            [response.user]: {
              ...response.variation,
              color: response.color,
              name: response.name,
            },
          },
        });
      }
    },
    [memes, members, memeVariations],
  );

  useEffect(() => {
    onConnectSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ApiSocketClient.on(`room:${roomId}`, onRoomUpdate);

    return () => {
      ApiSocketClient.off(`room:${roomId}`, onRoomUpdate);
    };
  }, [memes, onRoomUpdate, roomId]);

  const root =
    members.length > 0 ? packBubbles(members, width, 400).leaves() : [];

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
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Svg width={width} height={400}>
              {root.map((leaf: any) => (
                <G transform={`translate(${leaf.x},${leaf.y})`}>
                  <Circle r={leaf.r} fill={leaf.data.color} />
                  <SVGText
                    fill={Colors.isDark(leaf.data.color) ? 'white' : 'black'}
                    fontSize={getBubbleTitleSize(members.length)}
                    x="0"
                    y="0.1"
                    textAnchor="middle">
                    {leaf.data.name}
                  </SVGText>
                </G>
              ))}
            </Svg>
          </View>
          <LoaderScreen
            color={Colors.white}
            messageStyle={{color: Colors.white}}
            message="Waiting for host..."
            overlay
            backgroundColor={Color('#000424').alpha(0.85).string()}
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
          variations={memeVariations || {}}
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
