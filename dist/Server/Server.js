"use strict";
exports.__esModule = true;
exports.Server = void 0;
var http_1 = require("http");
var Utils_1 = require("./Utils");
var LoginHandler_1 = require("./LoginHandler");
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.prototype.createServer = function () {
        http_1.createServer(function (req, res) {
            console.log('got request from ' + req.url);
            var basePath = Utils_1.Utils.getUrlBasePath(req.url);
            switch (basePath) {
                case 'login':
                    new LoginHandler_1.LoginHandler(req, res).handleRequest();
                    break;
                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('server started');
    };
    return Server;
}());
exports.Server = Server;
