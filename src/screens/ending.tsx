import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Dimensions, StyleSheet} from 'react-native';
import {
  Button,
  Colors,
  Image,
  View,
  GridView,
  Card,
  Avatar,
  Text,
  LoaderScreen,
} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import Svg, {Defs, RadialGradient, Rect, Stop} from 'react-native-svg';
import Color from 'color';
import Animated, {
  BounceIn,
  BounceOut,
  PinwheelIn,
  PinwheelOut,
  LightSpeedInLeft,
  LightSpeedInRight,
  ZoomOut,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

import {ApiSocketClient} from '../services/api/websocket';
import {RootState} from '../stores';
import {ROOM_EVENT, WS_EVENT} from '../services/api/constants';
import {Member, Meme} from '../@types';
import {reset} from '../navigation/actions';
import {SCREEN_NAME} from '../navigation/constants';

const AnimatedAvatar = Animated.createAnimatedComponent(Avatar);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedCard = Animated.createAnimatedComponent(Card);

const {width, height} = Dimensions.get('screen');

const SIZE = width - 100;
const styles = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
  },
});

const Ending = ({route, navigation}: any) => {
  const [meme, setMeme] = useState<Meme>();
  const [waitingForNextMeme, setWaitingForNextMeme] = useState(false);
  const [currentWinners, setCurrentWinners] = useState<any[] | undefined>();
  const [started, setStarted] = useState(false);
  const [canExit, setCanExit] = useState(false);
  const [voters, setVoters] = useState<{
    [key: string]: {[key: string]: Member};
  }>({});
  const userId = useSelector<RootState>(state => state.room.userId);
  const roomId = useSelector<RootState>(state => state.room.roomId);
  const nickname = useSelector<RootState>(state => state.room.nickname);
  const password =
    useSelector<RootState>(state => state.room.password) || undefined;
  const {isHost} = route.params || {};
  const confettiCannon = useRef<ConfettiCannon>(null);

  const onContinue = useCallback(() => {
    const startRecap = () =>
      ApiSocketClient.emit(
        WS_EVENT.START_RECAP,
        {id: roomId, userId, name: nickname, password},
        () => {
          // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
        },
      );

    const nextReview = () => {
      setWaitingForNextMeme(true);
      ApiSocketClient.emit(
        WS_EVENT.NEXT_REVIEW,
        {
          id: roomId,
          userId,
          name: nickname,
          password,
          previousMemeId: meme?.id,
        },
        () => {
          // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
        },
      );
    };

    if (!started) {
      startRecap();
      return;
    }

    if (ApiSocketClient && roomId) {
      Alert.alert(
        'Next meme!',
        'Current meme winner will be selected and then next meme will be displayed!',
        [
          {
            text: 'Sure!',
            style: 'destructive',
            onPress: nextReview,
          },
          {text: 'Wait!', style: 'cancel'},
        ],
      );
    }
  }, [roomId, nickname, password, userId, started, meme]);

  const onRoomUpdate = useCallback(
    (response: any) => {
      if (`${response.event}` === `${ROOM_EVENT.reviewMeme}`) {
        setStarted(true);
        setCurrentWinners(undefined);
        setWaitingForNextMeme(false);
        setMeme(response.meme);
      }
      if (`${response.event}` === `${ROOM_EVENT.voteVariation}`) {
        const votes = {
          ...voters,
        };
        Object.keys(voters).map(v => {
          delete votes[v][response.user.id];
        });

        setVoters({
          ...votes,
          [response.variation]: {
            ...voters[response.variation],
            [response.user.id]: response.user,
          },
        });
      }
      if (`${response.event}` === `${ROOM_EVENT.memeWinner}`) {
        if (confettiCannon.current) {
          confettiCannon.current.start();
        }

        setCurrentWinners(response.variations);
      }
      if (`${response.event}` === `${ROOM_EVENT.ended}`) {
        setCanExit(true);
      }
    },
    [voters],
  );

  const voteForVariation = useCallback(
    (variationId: number | string) => {
      ApiSocketClient.emit(
        WS_EVENT.VOTE_VARIATION,
        {
          id: roomId,
          userId,
          memeId: meme?.id,
          variationId,
        },
        () => {
          // dispatch(roomReducer.actions.updateDriverOnlineStatus(status));
        },
      );
    },
    [roomId, userId, meme],
  );

  useEffect(() => {
    ApiSocketClient.on(`room:${roomId}`, onRoomUpdate);

    return () => {
      ApiSocketClient.off(`room:${roomId}`, onRoomUpdate);
    };
  }, [meme, onRoomUpdate, roomId]);

  const onExit = useCallback(() => {
    reset(navigation, SCREEN_NAME.LOG_IN);
  }, [navigation]);

  const variations = meme?.variations || {};
  const variationsItems = Object.keys(variations).map(
    (key: string, index: number) => {
      const currentVariation = variations[key];
      const shouldRender = !currentWinners
        ? true
        : !!currentWinners.filter(c => c.id === currentVariation.id).length;
      return {
        // title: currentVariation.description,
        // subtitle: currentVariation.name,
        // subtitleColor: currentVariation.color,
        onPress: () => voteForVariation(currentVariation.id),
        renderCustomItem: () =>
          !shouldRender ? (
            <View />
          ) : (
            <AnimatedCard
              key={currentVariation.id}
              entering={index % 2 === 0 ? LightSpeedInLeft : LightSpeedInRight}
              exiting={ZoomOut}
              row
              style={{marginBottom: 15}}
              borderRadius={20}
              useNative
              backgroundColor={Colors.white}
              activeOpacity={1}>
              <Card.Section
                content={[
                  {
                    text: currentVariation.description,
                    text70: true,
                    grey10: true,
                  },
                  {
                    text: currentVariation.name,
                    text90: true,
                    grey40: true,
                    style: {
                      paddingTop: 8,
                    },
                  },
                ]}
                style={{padding: 20, flex: 1}}
              />
              <View absB row style={{bottom: -15, height: 30}}>
                {(Object.keys(voters[currentVariation.id] || {}) || []).map(
                  variationKey => (
                    <AnimatedAvatar
                      entering={BounceIn}
                      exiting={BounceOut}
                      key={variationKey}
                      label={
                        `${voters[currentVariation.id][variationKey].name}`
                          .charAt(0)
                          .toLocaleUpperCase() +
                        `${voters[currentVariation.id][variationKey].name}`
                          .charAt(1)
                          .toLocaleUpperCase()
                      }
                      containerStyle={{
                        marginHorizontal: 4,
                        borderWidth: 1,
                        borderColor: 'black',
                      }}
                      size={30}
                      backgroundColor={
                        voters[currentVariation.id][variationKey].color
                      }
                      labelColor={
                        Colors.isDark(
                          voters[currentVariation.id][variationKey].color ||
                            'white',
                        )
                          ? 'white'
                          : 'black'
                      }
                    />
                  ),
                )}
              </View>
            </AnimatedCard>
          ),
      };
    },
  );

  const color = meme?.color || 'black';
  const lighterColor = Color(color).lighten(0.8).toString();

  return (
    <>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="gradient" cx="50%" cy="30%">
            <Stop offset="0%" stopColor={lighterColor} />
            <Stop offset="100%" stopColor={color} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#gradient)" />
      </Svg>
      <View flex paddingT-40>
        {started ? (
          <AnimatedImage
            key={meme?.url}
            entering={PinwheelIn}
            exiting={PinwheelOut}
            source={{uri: meme?.url}}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <>
            <Text white text20 marginB-20 center style={{zIndex: 999}}>
              Outro
            </Text>
            <LoaderScreen
              color={Colors.white}
              messageStyle={{color: Colors.white}}
              message="Waiting for host..."
              overlay
              backgroundColor={Color('#000424').alpha(0.55).string()}
            />
          </>
        )}
        <View flex centerH paddingT-20 style={{zIndex: 999}}>
          <GridView
            items={variationsItems}
            numColumns={2}
            lastItemOverlayColor={Colors.primary}
            lastItemLabel={42}
            // keepItemSize
          />
          {isHost && !canExit && (
            <Button
              style={{
                position: 'absolute',
                bottom: 36,
                left: 24,
                right: 24,
                padding: 24,
                zIndex: 999,
              }}
              text70BL
              black
              background-white
              disabled={waitingForNextMeme}
              label={started ? 'Next' : 'Start'}
              onPress={onContinue}
            />
          )}
          {canExit && (
            <Button
              style={{
                position: 'absolute',
                bottom: 36,
                left: 24,
                right: 24,
                padding: 24,
                zIndex: 999,
              }}
              text70BL
              white
              background-black
              label={'Exit'}
              onPress={onExit}
            />
          )}
        </View>
        <ConfettiCannon
          autoStart={false}
          ref={confettiCannon}
          count={200}
          origin={{x: -10, y: 0}}
        />
      </View>
    </>
  );
};

export default Ending;
