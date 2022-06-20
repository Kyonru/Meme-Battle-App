import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import {
  View,
  TextField,
  Text,
  Button,
  TabController,
  Colors,
  TabControllerItemProps,
  Assets,
  Avatar,
} from 'react-native-ui-lib';
import {useDispatch, useSelector} from 'react-redux';
import roomReducer from '../stores/room/slice';
import {SCREEN_NAME} from '../navigation/constants';
import {createRoom} from '../services/api/room';
import {RootState} from '../stores';

const TABS = ['Create Room', 'Join Room'];

const mappedTabs = TABS.map<TabControllerItemProps>((tab, index) => ({
  label: tab,
  key: tab,
  icon: index === 2 ? Assets.icons.demo.dashboard : undefined,
  badge: index === 5 ? {label: '2'} : undefined,
  leadingAccessory:
    index === 3 ? (
      <Text marginR-4>{Assets.emojis.movie_camera}</Text>
    ) : undefined,
  trailingAccessory:
    index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined,
}));

export const LogIn = ({navigation}: any) => {
  const [index, setIndex] = useState(0);
  const [nickname, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const userId = useSelector<RootState>(state => state.room.userId) as string;
  const userColor = useSelector<RootState>(state => state.room.color) as string;

  const onChangeTab = useCallback(tab => {
    setIndex(tab);
  }, []);

  const onChangeRoomId = useCallback(
    room => {
      dispatch(roomReducer.actions.setRoomId(room));
    },
    [dispatch],
  );

  const onChangeNickname = useCallback(
    nick => {
      setNickName(nick);
      dispatch(roomReducer.actions.setNickname(nick));
    },
    [dispatch],
  );
  const onChangePassword = useCallback(
    pass => {
      setPassword(pass);
      dispatch(roomReducer.actions.setPassword(pass));
    },
    [dispatch],
  );

  const onContinue = useCallback(async () => {
    if (index === 0) {
      try {
        const room = await createRoom(userId, nickname);
        console.log({room});
        dispatch(roomReducer.actions.setRoomId(room));
        navigation.navigate(SCREEN_NAME.ROOM);
      } catch (e: any) {
        Alert.alert('', e.message);
      }
    }

    if (index === 1) {
      navigation.navigate(SCREEN_NAME.ROOM);
    }
  }, [index, nickname, navigation, dispatch, userId]);

  const renderTabs = () => {
    return (
      <View flex>
        <TabController.TabPage index={0}>
          <View paddingH-24 paddingT-16>
            <TextField
              value={password}
              onChangeText={onChangePassword}
              migrate
              floatingPlaceholder
              text50L
              placeholder="password (optional)"
              secureTextEntry
              grey10
            />
          </View>
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <View paddingH-24 paddingT-16>
            <TextField
              onChangeText={onChangeRoomId}
              migrate
              floatingPlaceholder
              text50L
              placeholder="code"
              grey10
            />
            <TextField
              marginT-20
              value={password}
              onChangeText={onChangePassword}
              migrate
              floatingPlaceholder
              text50L
              placeholder="password (optional)"
              secureTextEntry
              grey10
            />
          </View>
        </TabController.TabPage>
      </View>
    );
  };

  return (
    <View flex paddingT-60>
      <View paddingH-24>
        <View center marginB-16>
          <Text black text20 marginB-20>
            Meme battle!
          </Text>
          <Avatar
            containerStyle={{marginVertical: 5}}
            label={
              `${nickname}`.charAt(0).toLocaleUpperCase() +
              `${nickname}`.charAt(1).toLocaleUpperCase()
            }
            labelColor={Colors.isDark(userColor) ? 'white' : 'black'}
            size={75}
            backgroundColor={userColor}
            onPress={() => {}}
          />
        </View>
        <TextField
          migrate
          value={nickname}
          onChangeText={onChangeNickname}
          floatingPlaceholder
          text40L
          placeholder="nickname"
          grey10
          marginT-40
          marginB-20
        />
      </View>

      <TabController
        initialIndex={0}
        onChangeIndex={onChangeTab}
        items={mappedTabs}>
        <TabController.TabBar
          backgroundColor={'transparent'}
          labelColor={Colors.grey30}
          selectedLabelColor={Colors.black}
          indicatorStyle={{backgroundColor: userColor}}
          centerSelected={true}
        />
        {renderTabs()}
      </TabController>
      <View flex bottom marginB-40 paddingH-24>
        <Button
          text70BL
          white
          background-black
          label={index === 0 ? 'Create' : 'Join'}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

export default LogIn;
