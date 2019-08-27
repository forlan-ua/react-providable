"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.injectableMap = new Map();
function Injectable(options = {}) {
    return function (Constructor) {
        const entry = [React.createContext(null), options.deps || []];
        exports.injectableMap.set(Constructor, entry);
        return Constructor;
    };
}
exports.Injectable = Injectable;
//# sourceMappingURL=Injectable.js.map