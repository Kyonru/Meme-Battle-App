import {v4 as uuidv4} from 'uuid';
import {RoomStoreState} from '../../@types/store';
import {getRandomColor} from '../../utils/colors';

export default {
  userId: uuidv4(),
  color: getRandomColor(),
  roomId: undefined,
  password: undefined,
  nickname: undefined,
} as RoomStoreState;
