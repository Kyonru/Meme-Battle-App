export const API_URL = 'https://kyonru-meme.ngrok.io';

export enum WS_EVENT {
  JOIN = 'join',
  START = 'start',
  NEXT_MEME = 'next_meme',
  SUBMIT_VARIATION = 'submit_variation',
  START_RECAP = 'start_recap',
  VOTE_VARIATION = 'vote_variation',
}

export enum ROOM_EVENT {
  joined = 'JOINED',
  banned = 'BANNED',
  started = 'STARTED',
  newMeme = 'NEW_MEME',
  newVariation = 'NEW_MEME_VARIATION',
  completed = 'COMPLETED',
  ended = 'ENDED',
  recap = 'RECAP',
  reviewMeme = 'REVIEW_MEME',
  voteVariation = 'VOTE_VARIATION',
  exit = 'EXIT',
}

export enum ApiBaseUrl {
  ROOM = 'room',
}

export const USER_ID = 'ASDSWE';
