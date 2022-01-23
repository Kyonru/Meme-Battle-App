import {io} from 'socket.io-client';
import {API_URL} from './constants';

// export const socket = io(`ws://${API_URL}`, {});

export const ApiSocketClient = io(API_URL, {
  reconnectionDelayMax: 10000,
  transports: ['websocket'],
  reconnectionAttempts: 15,
  port: '8001',
});
