"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Injectable_1 = require("./Injectable");
function createInstance(attribute) {
    if ('useValue' in attribute) {
        return attribute.useValue;
    }
    if (attribute.useFactory) {
        return attribute.useFactory(...(attribute.withArgs || []));
    }
    if (attribute.useClass) {
        return new attribute.useClass(...(attribute.withArgs || []));
    }
    return new attribute.provide(...(attribute.withArgs || []));
}
function Providable(newProviders, knownProviders) {
    const attributes = (newProviders || []).map(attribute => typeof attribute === 'function' ? { provide: attribute } : attribute);
    return function (Constructor) {
        return class extends React.Component {
            constructor() {
                super(...arguments);
                this._cachedInstances = new Map();
            }
            render() {
                const providers = new Map();
                let element = React.createElement(Constructor, Object.assign({}, this.props, { providers }), null);
                if (knownProviders) {
                    for (const type of knownProviders) {
                        const [context] = Injectable_1.injectableMap.get(type);
                        const currentElement = element;
                        element = React.createElement(context.Consumer, { key: 'Consumer' }, (value) => {
                            if (value) {
                                providers.set(type, value);
                            }
                            return currentElement;
                        });
                    }
                }
                else {
                    for (const [type, [context]] of Injectable_1.injectableMap.entries()) {
                        const currentElement = element;
                        element = React.createElement(context.Consumer, { key: 'Consumer' }, (value) => {
                            if (value) {
                                providers.set(type, value);
                            }
                            return currentElement;
                        });
                    }
                }
                for (const attribute of attributes) {
                    const [context, deps] = Injectable_1.injectableMap.get(attribute.provide);
                    if (attribute.useExisting) {
                        const [existingContext] = Injectable_1.injectableMap.get(attribute.useExisting);
                        const currentElement = element;
                        element = React.createElement(existingContext.Consumer, { key: 'Consumer' }, (value) => {
                            return React.createElement(context.Provider, { value, key: 'Provider' }, currentElement);
                        });
                    }
                    if (deps.length > 0) {
                        const depsProviders = new Map();
                        const currentElement = element;
                        element = React.createElement(() => {
                            if (attribute.withArgs) {
                                attribute.withArgs.push(depsProviders);
                            }
                            else {
                                attribute.withArgs = [depsProviders];
                            }
                            const instance = this._cachedInstances.get(attribute.provide) || createInstance(attribute);
                            this._cachedInstances.set(attribute.provide, instance);
                            return React.createElement(context.Provider, { value: instance, key: 'Provider' }, currentElement);
                        }, null);
                        deps.forEach((dep) => {
                            const currentElement = element;
                            element = React.createElement(context.Consumer, { key: 'Consumer' }, (value) => {
                                if (value) {
                                    depsProviders.set(dep, value);
                                }
                                return currentElement;
                            });
                        });
                    }
                    else {
                        const instance = this._cachedInstances.get(attribute.provide) || createInstance(attribute);
                        this._cachedInstances.set(attribute.provide, instance);
                        element = React.createElement(context.Provider, { value: instance, key: 'Provider' }, element);
                    }
                }
                return element;
            }
        };
    };
}
exports.Providable = Providable;
//# sourceMappingURL=Providable.js.map