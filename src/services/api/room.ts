import api from '.';
import {ApiBaseUrl} from './constants';

export const createRoom = async (
  hostId: string,
  name: string,
  rounds: number = 5,
): Promise<string> => {
  return await api.post(`${ApiBaseUrl.ROOM}`, {hostId, name, rounds});
};
