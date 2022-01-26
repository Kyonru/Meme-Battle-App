import {v4 as uuidv4} from 'uuid';
import {RoomStoreState} from '../../@types/store';

export default {
  userId: uuidv4(),
  roomId: undefined,
  password: undefined,
  nickname: undefined,
} as RoomStoreState;
