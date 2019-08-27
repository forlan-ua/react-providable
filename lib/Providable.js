"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Injectable_1 = require("./Injectable");
function createInstance(options) {
    if ('useValue' in options) {
        return options.useValue;
    }
    if (options.useFactory) {
        return options.useFactory(...(options.withArgs || []));
    }
    if (options.useClass) {
        return new options.useClass(...(options.withArgs || []));
    }
    return new options.provide(...(options.withArgs || []));
}
function Providable(newProviders, knownProviders) {
    const newProvidersOptions = (newProviders || []).map(options => typeof options === 'function' ? { provide: options } : options).reverse();
    return function (Constructor) {
        return class extends React.Component {
            constructor() {
                super(...arguments);
                this._cachedInstances = new Map();
                this._providers = new Map();
            }
            render() {
                const providers = this._providers;
                let element = React.createElement(Constructor, Object.assign({}, this.props, { providers }), null);
                if (knownProviders) {
                    for (const type of knownProviders) {
                        const [context] = Injectable_1.injectableMap.get(type);
                        const currentElement = element;
                        element = React.createElement(context.Consumer, { key: 'Consumer' }, (value) => {
                            if (!value) {
                                console.error(`Looks like the \`${type.name}\` has not been provided.`);
                            }
                            providers.set(type, value);
                            return currentElement;
                        });
                    }
                }
                else {
                    for (const [type, [context]] of Injectable_1.injectableMap.entries()) {
                        const currentElement = element;
                        element = React.createElement(context.Consumer, { key: 'Consumer' }, (value) => {
                            if (!value) {
                                console.error(`Looks like the \`${type.name}\` has not been provided.`);
                            }
                            providers.set(type, value);
                            return currentElement;
                        });
                    }
                }
                for (const options of newProvidersOptions) {
                    if (!Injectable_1.injectableMap.has(options.provide)) {
                        throw new Error(`Looks like the \`${options.provide.name}\` has not been injected.`);
                    }
                    const [context, deps] = Injectable_1.injectableMap.get(options.provide);
                    if (options.useExisting) {
                        if (!Injectable_1.injectableMap.has(options.useExisting)) {
                            throw new Error(`Looks like the \`${options.useExisting.name}\` has not been injected.`);
                        }
                        const [existingContext] = Injectable_1.injectableMap.get(options.useExisting);
                        const currentElement = element;
                        element = React.createElement(existingContext.Consumer, { key: 'Consumer' }, (value) => {
                            return React.createElement(context.Provider, { value, key: 'Provider' }, currentElement);
                        });
                    }
                    if (deps.length > 0) {
                        const depsProviders = new Map();
                        deps.forEach((dep, index) => {
                            if (!Injectable_1.injectableMap.has(dep)) {
                                throw new Error(`Looks like the \`${dep.name}\` has not been injected.`);
                            }
                            const [depsContext] = Injectable_1.injectableMap.get(dep);
                            const currentElement = element;
                            element = React.createElement(depsContext.Consumer, { key: 'Consumer' }, (value) => {
                                if (!value) {
                                    console.error(`Looks like the \`${dep.name}\` has not been provided.`);
                                }
                                depsProviders.set(dep, value);
                                if (index === 0) {
                                    let instance = this._cachedInstances.get(options.provide);
                                    if (!instance) {
                                        const withArgs = options.withArgs || [];
                                        withArgs.push(depsProviders);
                                        instance = createInstance(Object.assign({}, options, { withArgs }));
                                        this._cachedInstances.set(options.provide, instance);
                                    }
                                    return React.createElement(context.Provider, { value: instance, key: 'Provider' }, currentElement);
                                }
                                return currentElement;
                            });
                        });
                    }
                    else {
                        let instance = this._cachedInstances.get(options.provide);
                        if (!instance) {
                            instance = createInstance(options);
                            this._cachedInstances.set(options.provide, instance);
                        }
                        element = React.createElement(context.Provider, { value: instance, key: 'Provider' }, element);
                    }
                }
                return React.createElement(React.Fragment, null, element);
            }
        };
    };
}
exports.Providable = Providable;
//# sourceMappingURL=Providable.js.map