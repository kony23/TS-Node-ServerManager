import { S_IFREG } from 'constants';
import {
  TokenGenertor,
  Account,
  SessionToken,
  TokenState,
  TokenValidator,
  TokenRights,
} from '../Server/Model';
import { SessionTokenDBAccess } from './SessionTokenDBAccess';
import { UserCredentialsDBAccess } from './UserCreedentialsDBAccess';

export class Authorizer implements TokenGenertor, TokenValidator {
  private userCredentialDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
  private sessionTokenDBAcces: SessionTokenDBAccess = new SessionTokenDBAccess();

  async generateToken(account: Account): Promise<SessionToken | undefined> {
    const resultAccount = await this.userCredentialDBAccess.getUserCredential(
      account.username,
      account.password
    );
    if (resultAccount) {
      const token: SessionToken = {
        accessRights: resultAccount.accessRights,
        expirationTime: this.generateExpirationTime(),
        username: resultAccount.username,
        valid: true,
        tokenId: this.generateRandomTokenId(),
      };

      await this.sessionTokenDBAcces.storeSessionToken(token);
      return token;
    } else {
      return undefined;
    }
  }

  public async validteToken(tokenId: string): Promise<TokenRights> {
    const token = await this.sessionTokenDBAcces.getSessionToken(tokenId);
    if (!token || !token.valid) {
      return {
        accessRights: [],
        state: TokenState.INVALID,
      };
    } else if (token.expirationTime < new Date()) {
      return {
        accessRights: [],
        state: TokenState.EXPIRED,
      };
    } return {
        accessRights: token.accessRights,
        state: TokenState.VALID
    }
  }

  private generateExpirationTime() {
    return new Date(Date.now() + 60 * 60 * 1000);
  }

  private generateRandomTokenId() {
    return Math.random().toString(36).slice(2);
  }
}
