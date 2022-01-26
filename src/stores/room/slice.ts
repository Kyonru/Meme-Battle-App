import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {RoomStoreState} from '../../@types/store';

import initialState from './initial-state';

const setRoomId = (state: RoomStoreState, {payload}: PayloadAction<string>) => {
  state.roomId = payload;
};
const setNickname = (
  state: RoomStoreState,
  {payload}: PayloadAction<string>,
) => {
  state.nickname = payload;
};
const setPassword = (
  state: RoomStoreState,
  {payload}: PayloadAction<string>,
) => {
  state.password = payload;
};

export default createSlice({
  name: 'room',
  initialState,
  reducers: {
    setRoomId,
    setNickname,
    setPassword,
  },
});
