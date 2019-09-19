import * as React from 'react';

import {IConstructor, IAnyConstructor, injectableMap} from './Injectable';


export type IProvidableOptions = {
  provide: IAnyConstructor;
  useValue?: Object | null;
  useClass?: IAnyConstructor;
  useExisting?: IAnyConstructor;
  useFactory?: Function;
  withArgs?: Array<any>;
}

function createInstance(options: IProvidableOptions) {
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


type IProvidable<P={}, S={}, SS=any> = new (...args: Array<any>) => React.Component<P, S, SS> & {
  onChangeProvider?: <T>(type: IAnyConstructor, newProvider: T | null, oldProvider: T | null) => void;
}

export function Providable(newProviders?: Array<IAnyConstructor | IProvidableOptions>, knownProviders?: Array<IAnyConstructor>) {
  const newProvidersOptions: Array<IProvidableOptions> = (newProviders || []).map(options => typeof options === 'function' ? {provide: options} : options).reverse();

  return function <T extends IProvidable>(Constructor: T): T {
    return class extends Constructor {
      private __cachedInstances: Map<IAnyConstructor, any> = new Map();
      private __providers: Map<IAnyConstructor, any> = new Map();

      private __setProvider<T>(type: IConstructor<T>, provider: T) {
        const cachedProvider = this.__providers.get(type);
        if (cachedProvider && cachedProvider !== provider) {
          this.__providers.set(type, provider);
          if (this.onChangeProvider) {
            this.onChangeProvider(type, provider, cachedProvider);
          }
        } else if (!cachedProvider) {
          this.__providers.set(type, provider);
          if (this.onChangeProvider) {
            this.onChangeProvider(type, provider, null);
          }
        }
      }

      render() {
        let element: React.ReactNode = null;
        const render = super.render;

        if (knownProviders) {
          for (const type of knownProviders) {
            const [context] = injectableMap.get(type);
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (!value) {
                console.error(`Looks like the \`${type.name}\` has not been provided.`);
              }
              this.__setProvider(type, value);
              if (currentElement) {
                return currentElement;
              } else {
                return render.call(this);
              }
            });
          }
        } else if (injectableMap.size > 0) {
          for (const [type, [context]] of injectableMap.entries()) {
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (!value) {
                console.error(`Looks like the \`${type.name}\` has not been provided.`);
              }
              this.__setProvider(type, value);
              if (currentElement) {
                return currentElement;
              } else {
                return render.call(this);
              }
            });
          }
        } else {
          return super.render();
        }

        for (const options of newProvidersOptions) {
          if (!injectableMap.has(options.provide)) {
            throw new Error(`Looks like the \`${options.provide.name}\` has not been injected.`);
          }
          const [context, deps] = injectableMap.get(options.provide);

          if (options.useExisting) {
            if (!injectableMap.has(options.useExisting)) {
              throw new Error(`Looks like the \`${options.useExisting.name}\` has not been injected.`);
            }
            const [existingContext] = injectableMap.get(options.useExisting);
            const currentElement = element;
            element = React.createElement(existingContext.Consumer, {key: 'Consumer'} as any, (value: any) => {
              return React.createElement(context.Provider, {value, key: 'Provider'}, currentElement);
            });
          } else if (deps.length > 0) {
            const depsProviders: Map<IAnyConstructor, any> = new Map();

            deps.forEach((dep, index) => {
              if (!injectableMap.has(dep)) {
                throw new Error(`Looks like the \`${dep.name}\` has not been injected.`);
              }
              const [depsContext] = injectableMap.get(dep);
              const currentElement = element;
              element = React.createElement(depsContext.Consumer, {key: 'Consumer'} as any, (value: any) => {
                if (!value) {
                  console.error(`Looks like the \`${dep.name}\` has not been provided.`);
                }
                depsProviders.set(dep, value);
                if (index === 0) {
                  let instance = this.__cachedInstances.get(options.provide);
                  if (!instance) {
                    const withArgs = (options.withArgs || []).slice();
                    withArgs.push(depsProviders);
                    instance = createInstance({...options, withArgs});
                    this.__cachedInstances.set(options.provide, instance);
                  }
                  return React.createElement(context.Provider, {value: instance, key: 'Provider'}, currentElement);
                }
                return currentElement;
              });
            });
          } else {
            let instance = this.__cachedInstances.get(options.provide);
            if (!instance) {
              instance = createInstance(options);
              this.__cachedInstances.set(options.provide, instance);
            }
            element = React.createElement(context.Provider, {value: instance, key: 'Provider'}, element);
          }
        }

        return element;
      }
    };
  }
}
