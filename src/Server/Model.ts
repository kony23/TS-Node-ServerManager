import { AccessRight } from "../Shared/Model";

export interface Account {
  username: string;
  password: string;
}

export interface SessionToken {
    tokenId: string,
    username: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRight[]
}

export enum TokenState{
  VALID,
  INVALID,
  EXPIRED
}

export interface TokenRights {
  accessRights: AccessRight[],
  state: TokenState
}

export interface TokenGenertor {
  generateToken(account: Account): Promise<SessionToken | undefined>;
}

export interface TokenValidator {
  validteToken(tokenId: string): Promise<TokenRights>
}

export interface Prucie {
  name: string;
  type: string;
  thcLevel: number;
}