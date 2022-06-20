import {CommonActions} from '@react-navigation/native';

import {SCREEN_NAME} from './constants';

export const reset = (navigation: any, screen: SCREEN_NAME): void => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: screen,
        },
      ],
    }),
  );
};
