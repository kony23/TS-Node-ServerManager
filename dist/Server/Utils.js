"use strict";
exports.__esModule = true;
exports.Utils = void 0;
var url_1 = require("url");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getUrlBasePath = function (url) {
        if (url) {
            var parsedUrl = url_1.parse(url);
            return parsedUrl.pathname.split('/')[1];
        }
        return 'a';
    };
    return Utils;
}());
exports.Utils = Utils;
