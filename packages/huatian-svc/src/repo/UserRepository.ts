import { User } from "@huatian/model";

export class UserRepository {
  private users: Record<number, User> = {};

  private static inst = new UserRepository();
  public static getInstance() {
    return UserRepository.inst;
  }
  public getUser(uid: number): User;
  public getUser(user: string, passwd: string): User;
  public getUser(identity: number | string, passwd?: string): User {
    if (typeof identity === "number") {
      const uid = identity;

      if (!this.users[uid]) {
        this.users[uid] = new User(uid);
      }
      return this.users[uid];
    } else {
      const user = identity;
      const idmap = {
        zhangsan: 1,
        lisi: 2,
        wangwu: 3,
      };

      return this.getUser(idmap[user] || 1, passwd);
    }
  }
}
