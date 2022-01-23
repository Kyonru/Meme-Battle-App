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
import {SCREEN_NAME} from '../navigation/constants';
import {createRoom} from '../services/api/room';

const TABS = ['Create Room', 'Join Room'];

const HOST_ID = 'ASDSWE';

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

  const onChangeTab = useCallback(tab => {
    setIndex(tab);
  }, []);

  const onContinue = useCallback(async () => {
    if (index === 0) {
      try {
        const room = await createRoom(HOST_ID, nickname);
        console.log({room});

        navigation.navigate(SCREEN_NAME.ROOM);
      } catch (e: any) {
        Alert.alert('', e.message);
      }
    }
  }, [index, nickname, navigation]);

  const renderTabs = () => {
    return (
      <View flex>
        <TabController.TabPage index={0}>
          <View paddingH-24 paddingT-16>
            <TextField
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
              migrate
              floatingPlaceholder
              text50L
              placeholder="code"
              grey10
            />
            <TextField
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
    <View flex paddingT-120>
      <View paddingH-24 marginB-40>
        <View center>
          <Text blue50 text20>
            Meme battle!
          </Text>
          <Avatar
            containerStyle={{marginVertical: 5}}
            label={
              `${nickname}`.charAt(0).toLocaleUpperCase() +
              `${nickname}`.charAt(1).toLocaleUpperCase()
            }
            size={75}
            backgroundColor={Colors.violet60}
            onPress={() => {}}
          />
        </View>
        <TextField
          migrate
          value={nickname}
          onChangeText={(nick: string) => setNickName(nick)}
          floatingPlaceholder
          text40L
          placeholder="nickname"
          grey10
          marginB-40
        />
      </View>

      <TabController
        initialIndex={0}
        onChangeIndex={onChangeTab}
        items={mappedTabs}>
        <TabController.TabBar
          backgroundColor={'transparent'}
          activeBackgroundColor={Colors.blue80}
          selectedLabelColor={Colors.blue50}
          indicatorStyle={{backgroundColor: Colors.blue50}}
          centerSelected={true}
        />
        {renderTabs()}
      </TabController>
      <View flex bottom marginB-40 paddingH-24>
        <Button
          text70
          white
          background-orange30
          label={index === 0 ? 'Create' : 'Join'}
          onPress={onContinue}
        />
      </View>
    </View>
  );
};

export default LogIn;
