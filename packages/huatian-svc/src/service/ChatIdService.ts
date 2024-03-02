import { ChatIDSetDao } from "../dao/DAO";
import { DB } from "../dao/DB";

const STEP = 100000;

export class ChatIdService {
  private static inst = new ChatIdService();

  private id_base: number = -1;
  private id_start: number = 0;

  public static getInstance() {
    return ChatIdService.inst;
  }

  private async requestIdSet() {
    if (this.id_base >= this.id_start && this.id_base < this.id_start + STEP) {
      return;
    }

    const sequelize = DB.getSequelize();
    const transaction = await sequelize.transaction();

    try {
      const lastRecord = await ChatIDSetDao.findOne({
        order: [["id", "desc"]],
        lock: transaction.LOCK.UPDATE,
      });

      const startNumber = lastRecord
        ? lastRecord.getDataValue("start") + 100000
        : 0;

      await ChatIDSetDao.create({
        app: "test",
        start: startNumber,
      });

      this.id_start = startNumber;
      this.id_base = startNumber;
    } catch (error) {
      console.error(error);
      transaction.rollback();
    }
  }

  public async getId() {
    await this.requestIdSet();
    return this.id_base++;
  }
}
