export enum MessageStatus {
  SENDING = 0,
  SENT,
  RECEIVING,
  RECEIVED,
  READED,
  ERROR,
}

export enum MessageType {
  SEND = "send",
  RECEIVED = "received",
  SYSTEM = "system",
  NOTIFY = "notify",
}

export type Message = TextMessage | ImageMessage;

interface MessageData {
  id: number;
  status: MessageStatus;
  type: MessageType;
  from: number;
  to: number;
}

export interface TextMessage extends MessageData {
  text: string;
}

export interface ImageMessage extends MessageData {
  url: string;
}
