"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function Subscribable() {
    return function (Constructor) {
        return class extends React.Component {
            constructor(props) {
                super(props);
                this._subscriptions = [];
                this.subscribe = this.subscribe.bind(this);
            }
            subscribe(o, cb) {
                this._subscriptions.push(o.subscribe(cb));
            }
            componentWillUnmount() {
                for (const subscription of this._subscriptions) {
                    subscription.unsubscribe();
                }
            }
            render() {
                return React.createElement(Constructor, Object.assign({}, this.props, { subscribe: this.subscribe }), null);
            }
        };
    };
}
exports.Subscribable = Subscribable;
//# sourceMappingURL=Subscribable.js.map