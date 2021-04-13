import { IncomingMessage, ServerResponse } from 'http';
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from '../Shared/Model';
import { UsersDBAccess } from '../User/UsersDBAccess';
import { BaseRequestHandler } from './BaseRequestHandler';
import { TokenValidator } from './Model';
import { Utils } from './Utils';

export class UserHandler extends BaseRequestHandler {
    private usersDBAccess: UsersDBAccess = new UsersDBAccess();
    private tokenValidator: TokenValidator;

    public constructor(
        req: IncomingMessage,
        res: ServerResponse,
        tokenValidator: TokenValidator
    ) {
        super(req, res);
        this.tokenValidator = tokenValidator;
    }

    async handleRequest(): Promise<void> {
        switch (this.req.method) {
            case HTTP_METHODS.OPTIONS:
                this.res.writeHead(HTTP_CODES.OK);
                break;
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            case HTTP_METHODS.PUT:
                await this.handlePut();
                break;
            case HTTP_METHODS.DELETE:
                await this.handleDelete();
                break;
            default:
                this.handleNotFound();
                break;
        }
    }

    private async handleGet() {
        const operationAuthorized = await this.operationAuthorized(
            AccessRight.READ
        );
        if (operationAuthorized) {
            const parsedUrl = Utils.getUrlParmeters(this.req.url);
            if (parsedUrl) {
                if (parsedUrl.query.id) {
                    const user = await this.usersDBAccess.getUserById(
                        parsedUrl.query.id as string
                    );
                    if (user) {
                        this.respondJsonObject(HTTP_CODES.OK, user);
                    } else {
                        this.handleNotFound();
                    }
                } else if (parsedUrl.query.name) {
                    const users = await this.usersDBAccess.getUsersByName(
                        parsedUrl.query.name as string
                    );
                    this.respondJsonObject(HTTP_CODES.OK, users);
                } else {
                    this.respoondBadRequest(
                        'user id or name not present in request'
                    );
                }
            }
        } else {
            this.respoondUnauthorized('missing or invalid authentication');
        }
    }

    private async handlePut() {
        const operationAuthorized = await this.operationAuthorized(
            AccessRight.CREATE
        );
        if (operationAuthorized) {
            try {
                const user: User = await this.getRequestBody();
                await this.usersDBAccess.putUser(user);
                this.respondText(
                    HTTP_CODES.CREATED,
                    `user ${user.name} created`
                );
            } catch (error) {
                this.respoondBadRequest(error.message);
            }
        } else {
            this.respoondUnauthorized('missing or invalid authentication');
        }
    }

    private async handleDelete() {
        const operationAuthorized = await this.operationAuthorized(
            AccessRight.DELETE
        );
        if (operationAuthorized) {
            const parsedUrl = Utils.getUrlParmeters(this.req.url);
            if (parsedUrl) {
                if (parsedUrl.query.id) {
                    const deleteResult = await this.usersDBAccess.deleteUser(
                        parsedUrl.query.id as string
                    );
                    if (deleteResult) {
                        this.respondText(
                            HTTP_CODES.OK,
                            `user ${parsedUrl.query.id} deleted`
                        );
                    } else {
                        this.respondText(
                            HTTP_CODES.NOT_FOUND,
                            `user ${parsedUrl.query.id} was not found`
                        );
                    }
                } else {
                    this.respoondBadRequest('missing id in the request');
                }
            }
        } else {
            this.respoondUnauthorized('missing or invalid authentication');
        }
    }
    public async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.req.headers.authorization;
        if (tokenId) {
            const tokenRights = await this.tokenValidator.validteToken(tokenId);
            if (tokenRights.accessRights.includes(operation)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
