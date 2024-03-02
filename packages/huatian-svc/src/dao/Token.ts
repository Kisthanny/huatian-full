import crypto from "crypto";
type TokenObject = {
  uid: number;
  token: string;
  expires: number;
};

export class Token {
  private static inst: Token = new Token();

  public static getInstance() {
    return Token.inst;
  }

  private cache: Record<string, TokenObject> = {};

  private create(uid: number): TokenObject {
    const token = `${Math.random()}-${new Date().getTime()}`;

    const expires = new Date().getTime() + 3600 * 24;

    const sha = crypto.createHash("sha1");
    sha.update(token);
    const hash = sha.digest("hex");

    const tokenObject = {
      uid,
      token: hash,
      expires,
    };
    this.cacheSet(hash, tokenObject);
    return tokenObject;
  }

  private cacheSet(hash: string, token: TokenObject) {
    this.cache[hash] = token;
  }

  private cacheGet(hash: string) {
    return this.cache[hash] || null;
  }

  public getToken(hash: string) {
    const token = this.cacheGet(hash);
    if (!token) {
      return null;
    }

    if (token.expires > new Date().getTime()) {
      return token;
    }
    return null;
  }

  public refreshToken(uid: number) {
    return this.create(uid);
  }
}
