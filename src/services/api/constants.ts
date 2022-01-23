export const API_URL = 'https://kyonru-meme.ngrok.io';

export enum WS_EVENT {
  JOIN = 'join',
  START = 'start',
  NEXT_MEME = 'next_meme',
  SUBMIT_VARIATION = 'submit_variation',
  START_RECAP = 'start_recap',
  VOTE_VARIATION = 'vote_variation',
}

export enum ApiBaseUrl {
  ROOM = 'room',
}
