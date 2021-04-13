import { IncomingMessage, ServerResponse } from 'http';
import { BaseRequestHandler } from './BaseRequestHandler';
import { Account, TokenGenertor, Prucie } from './Model';

export class PrucieHandler extends BaseRequestHandler {
  constructor(req: IncomingMessage, res: ServerResponse) {
    super(req, res);
  }

  public async handleRequest(): Promise<void> {
    try {
      const body = await this.getRequestBody();
      this.res.write(body.toString());
    } catch (error) {
      this.res.write('error' + error.message);
    }
  }

}
