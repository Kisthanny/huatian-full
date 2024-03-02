import { Message } from "./Message";
import { User } from "./User";

export default class ChatSession {
  private from: User;
  private to: User;
  public constructor(from: User, to: User) {
    this.from = from;
    this.to = to;
  }

  public chat(sentMessage: Message, toReceiveMessage: Message) {
    this.from.chat().send(sentMessage);
    this.to.chat().receive(toReceiveMessage);
  }
}
