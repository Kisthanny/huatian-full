import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { AccountContext } from "./context/AccountContext";
import { Token } from "./dao/Token";
import { ChatContext } from "./context/ChatContext";
import { Message } from "@huatian/model";
const app = express();
app.use(cookieParser());

type LoggedInRequest = Request & { uid: number };

async function sendStdResponse<T>(res: Response, f: T);
async function sendStdResponse(res: Response, f: Promise<any>);
async function sendStdResponse(res: Response, f: () => Promise<any>);
async function sendStdResponse(res: Response, f: any) {
  try {
    let data = typeof f === "function" ? f() : f;
    if (data instanceof Promise) {
      data = await data;
    }
    res.send({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: error.toString(),
    });
  }
}

async function token(
  req: Request & { uid: number },
  res: Response,
  next: NextFunction
) {
  const tokenHash = req.cookies["x-token"] as string;
  console.log({ tokenHash });
  const token = Token.getInstance();

  const tokenObj = token.getToken(tokenHash);
  if (tokenObj === null) {
    res.status(401).send({
      success: false,
    });
    return;
  }

  req.uid = tokenObj.uid;
  next();
}

app.get("/foo", token, (req: LoggedInRequest, res) => {
  res.send(req.uid + "-ok");
});

app.post("/token", express.json(), async (req, res) => {
  const { uname, pwd } = req.body;
  const account = AccountContext.getInstance();
  const user = await account.verify(uname, pwd);
  console.log({ uname, pwd, id: user.getId() });
  const token = Token.getInstance();
  const tokenObj = token.refreshToken(user.getId());

  res.cookie("x-token", tokenObj.token);

  sendStdResponse(res, "ok");
});

app.post(
  "/message",
  token,
  express.json(),
  async (req: LoggedInRequest, res) => {
    const uid = req.uid;

    const chatContext = ChatContext.getInstance();
    sendStdResponse(res, async () => {
      return await chatContext.send(uid, req.body as Message);
    });
  }
);

app.get("/message", token, async (req: LoggedInRequest, res) => {
  const uid = req.uid;

  const lastId = parseInt(req.query.last_id as string) || 0

  console.log({uid, lastId})

  const chatContext = ChatContext.getInstance();
  sendStdResponse(res, ()=>{
    return chatContext.read(uid, lastId)
  })
});

app.listen(6001, () => {
  console.log("listen at 6001");
});
