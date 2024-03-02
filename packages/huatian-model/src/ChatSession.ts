import { Message } from "./Message";
import { User } from "./User";

export default class ChatSession {
  private from: User;
  private to: User;
  public constructor(from: User, to: User) {
    this.from = from;
    this.to = to;
  }

  public chat(msg: Message) {
    this.from.chat().send(msg);
    this.to.chat().receive(msg);
  }
}
