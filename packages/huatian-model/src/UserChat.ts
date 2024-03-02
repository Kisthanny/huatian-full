import ChatSession from "./ChatSession";
import { Message, MessageStatus, MessageType } from "./Message";
import { User } from "./User";

export default class UserChat {
  private user: User;
  private msgs: Array<Message> = [];
  private sessions: Record<number, ChatSession> = {};

  constructor(user: User) {
    this.user = user;
  }

  public createChatSession(to: User) {
    if (!this.sessions[to.getId()]) {
      this.sessions[to.getId()] = new ChatSession(this.user, to);
    }
    return this.sessions[to.getId()];
  }

  public send(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStatus.SENDING;
    msg.type = MessageType.SEND;
  }

  public receive(msg: Message) {
    this.msgs.push(msg);
    msg.status = MessageStatus.RECEIVED;
    msg.type = MessageType.RECEIVED;
  }

  public readTo(lastId: number) {
    const unreads = this.msgs.filter(
      (x) => x.id <= lastId && x.status === MessageStatus.RECEIVED
    );
    unreads.forEach((msg) => {
      msg.status = MessageStatus.READED;
    });
  }

  public unreadMsg(lastId: number) {
    // client id (最后一条消息)
    return this.msgs.filter((x) => x.id > lastId);
  }
}
