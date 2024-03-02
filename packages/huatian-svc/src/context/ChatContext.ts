import { Message } from "@huatian/model";
import { ChatIdService } from "../service/ChatIdService";
import { UserRepository } from "../repo/UserRepository";

export class ChatContext {
  private static inst = new ChatContext();
  private repo = UserRepository.getInstance();

  public static getInstance() {
    return ChatContext.inst;
  }

  public async send(uid: number, msg: Message) {
    const sentMessage = { ...msg };
    const toReceiveMessage = { ...msg };

    sentMessage.id = await ChatIdService.getInstance().getId();
    toReceiveMessage.id = await ChatIdService.getInstance().getId();
    msg.from = uid;

    const from = this.repo.getUser(msg.from);
    const to = this.repo.getUser(msg.to);
    const session = from.chat().createChatSession(to);
    session.chat(sentMessage, toReceiveMessage);
    return sentMessage.id;
  }

  public read(uid: number, lastId: number) {
    const user = this.repo.getUser(uid);
    return user.chat().unreadMessage(lastId);
  }
}
