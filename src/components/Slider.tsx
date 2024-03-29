import React, {ReactElement, useCallback, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {snapPoint, useVector} from 'react-native-redash';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Wave, {HEIGHT, MARGIN_WIDTH, Side, WIDTH} from './Wave';
import Button from './Button';
import {SlideProps} from './Slide';
import {timeout} from '../utils/time';
import {useSelector} from 'react-redux';
import {RootState} from '../stores';
import {ApiSocketClient} from '../services/api/websocket';
import {Text, TextField, View} from 'react-native-ui-lib';
import {ROOM_EVENT} from '../services/api/constants';

const PREV = WIDTH;
const NEXT = 0;
const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
const RIGHT_SNAP_POINTS = [NEXT, WIDTH - MARGIN_WIDTH];

interface SliderProps {
  index: number;
  meme?: number;
  setIndex: (value: number) => void;
  children: ReactElement<SlideProps>;
  prev?: ReactElement<SlideProps>;
  next?: ReactElement<SlideProps>;
  variation: string;
  onChangeVariation: (value: string) => any;
  onSubmitVariation: (id?: number) => any;
}

const Slider = ({
  index,
  children: current,
  prev,
  next,
  meme,
  setIndex,
  variation,
  onChangeVariation,
  onSubmitVariation,
}: SliderProps) => {
  const hasPrev = !!prev;
  const hasNext = !!next;
  const zIndex = useSharedValue(0);
  const left = useVector(0, HEIGHT / 2);
  const right = useVector(0, HEIGHT / 2);
  const activeSide = useSharedValue(Side.NONE);
  const isTransitioningLeft = useSharedValue(false);
  const isTransitioningRight = useSharedValue(false);
  const roomId = useSelector<RootState>(state => state.room.roomId);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: ({x}) => {
      if (x <= MARGIN_WIDTH && hasPrev) {
        activeSide.value = Side.LEFT;
        zIndex.value = 100;
      } else if (x >= WIDTH - MARGIN_WIDTH && hasNext) {
        activeSide.value = Side.RIGHT;
      } else {
        activeSide.value = Side.NONE;
      }
    },
    onActive: ({x, y}) => {
      if (activeSide.value === Side.LEFT) {
        left.x.value = Math.max(x, MARGIN_WIDTH);
        left.y.value = y;
      } else if (activeSide.value === Side.RIGHT) {
        right.x.value = Math.max(WIDTH - x, MARGIN_WIDTH);
        right.y.value = y;
      }
    },
    onEnd: ({velocityX, velocityY, x}) => {
      if (activeSide.value === Side.LEFT) {
        const dest = snapPoint(x, velocityX, LEFT_SNAP_POINTS);
        isTransitioningLeft.value = dest === PREV;
        left.x.value = withSpring(
          dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningLeft.value ? true : false,
            restSpeedThreshold: isTransitioningLeft.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningLeft.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningLeft.value) {
              runOnJS(setIndex)(index - 1);
            } else {
              zIndex.value = 0;
              activeSide.value = Side.NONE;
            }
          },
        );
        left.y.value = withSpring(HEIGHT / 2, {velocity: velocityY});
      } else if (activeSide.value === Side.RIGHT) {
        const dest = snapPoint(x, velocityX, RIGHT_SNAP_POINTS);
        isTransitioningRight.value = dest === NEXT;
        right.x.value = withSpring(
          WIDTH - dest,
          {
            velocity: velocityX,
            overshootClamping: isTransitioningRight.value ? true : false,
            restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
            restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
          },
          () => {
            if (isTransitioningRight.value) {
              runOnJS(setIndex)(index + 1);
            } else {
              activeSide.value = Side.NONE;
            }
          },
        );
        right.y.value = withSpring(HEIGHT / 2, {velocity: velocityY});
      }
    },
  });

  const onNext = useCallback(() => {
    const dest = snapPoint(0, 0, RIGHT_SNAP_POINTS);
    isTransitioningRight.value = dest === NEXT;
    right.x.value = withSpring(
      WIDTH - dest,
      {
        velocity: 0,
        overshootClamping: isTransitioningRight.value ? true : false,
        restSpeedThreshold: isTransitioningRight.value ? 100 : 0.01,
        restDisplacementThreshold: isTransitioningRight.value ? 100 : 0.01,
      },
      () => {
        if (isTransitioningRight.value) {
          runOnJS(setIndex)(index + 1);
        } else {
          activeSide.value = Side.NONE;
        }
      },
    );
    right.y.value = withSpring(HEIGHT / 2, {velocity: 0});
  }, [activeSide, index, isTransitioningRight, right.x, right.y, setIndex]);

  const onSubmit = useCallback(() => {
    onSubmitVariation(meme);
  }, [meme, onSubmitVariation]);

  const onClickNext = useCallback(
    async (response: any) => {
      if (`${response.event}` === `${ROOM_EVENT.newMeme}`) {
        await timeout(500);
        onNext();
        await timeout(250);
        onChangeVariation('');
      }
    },
    [onNext, onChangeVariation],
  );

  useEffect(() => {
    left.x.value = withSpring(MARGIN_WIDTH);
    right.x.value = withSpring(MARGIN_WIDTH);
  }, [index, left, right]);

  useEffect(() => {
    ApiSocketClient.on(`room:${roomId}`, onClickNext);

    return () => {
      ApiSocketClient.off(`room:${roomId}`, onClickNext);
    };
  }, [onClickNext, roomId]);

  return (
    <>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={StyleSheet.absoluteFill}>
          {current}
          {/* {prev && (
            <Animated.View style={[StyleSheet.absoluteFill, leftStyle]}>
              <Wave
                position={left}
                side={Side.LEFT}
                isTransitioning={isTransitioningLeft}>
                {prev}
              </Wave>
              <Button
                position={left}
                side={Side.LEFT}
                activeSide={activeSide}
              />
            </Animated.View>
          )} */}
          {(prev || next) && (
            <Animated.View style={StyleSheet.absoluteFill}>
              <Wave
                position={right}
                side={Side.RIGHT}
                isTransitioning={isTransitioningRight}>
                {prev! || next!}
              </Wave>
              <Button
                position={right}
                side={Side.RIGHT}
                activeSide={activeSide}
              />
            </Animated.View>
          )}
        </Animated.View>
      </PanGestureHandler>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 24,
          paddingVertical: 24,
          paddingTop: 12,
          // borderRadius: 24,
          borderTopStartRadius: 24,
          borderTopEndRadius: 24,
          backgroundColor: 'white',
          borderWidth: 5,
          borderBottomWidth: 0,
          zIndex: 999,
          // backgroundColor: ,
        }}>
        <View>
          <View row spread centerV>
            <Text text70L>#{roomId}</Text>
            <TouchableOpacity activeOpacity={0.2} onPress={onSubmit}>
              <View>
                <Icon
                  name="check"
                  color="black"
                  size={30}
                  style={{alignItems: 'center', justifyContent: 'center'}}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TextField
            value={variation}
            onChangeText={onChangeVariation}
            migrate
            multiline
            placeholder="caption"
            style={{backgroundColor: 'white', height: 124, fontSize: 24}}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Slider;
