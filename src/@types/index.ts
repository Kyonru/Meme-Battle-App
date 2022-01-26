export enum MemberRole {
  host = 'HOST',
  user = 'USER',
  banned = 'BANNED',
}

export interface User {
  id: string;
  name: string;
}

export interface Member extends User {
  role: MemberRole;
  color: string;
  order: number;
}

export enum RoomStatus {
  waiting = 'WAITING',
  inGame = 'IN_GAME',
  recap = 'RECAP',
  completed = 'COMPLETED',
}

export interface MemeVariation {
  id: string;
  basedOn?: string;
  description: string;
  color?: string;
  name?: string;
  voters: {[key: string]: Partial<Member>};
}

export interface Meme {
  id: string;
  url: string;
  name: string;
  variations?: {[key: string]: MemeVariation};
  width?: number;
  height?: number;
  box_count?: number;
  color: string;
}

export interface RoomRules {
  rounds?: number;
  nsfw?: boolean;
  password?: string;
}

export interface Room {
  id: string;
  status: RoomStatus;
  host: string;
  members: {[key: string]: Member};
  memes: {[key: string]: Meme};
  rules?: RoomRules;
}
