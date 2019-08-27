import * as React from 'react';

import {IConstructor, IAnyConstructor, injectableMap} from './Injectable';


export type IProvidableOptions = {
  provide: IAnyConstructor;
  useValue?: Object | null | undefined;
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

export interface ProvidersMap<T> extends Map<IConstructor<T>, T> {
  get<T>(type: IConstructor<T>): T;
}

export function Providable(newProviders?: Array<IAnyConstructor | IProvidableOptions>, knownProviders?: Array<IAnyConstructor>) {
  const newProvidersOptions: Array<IProvidableOptions> = (newProviders || []).map(options => typeof options === 'function' ? {provide: options} : options).reverse();

  return function <T extends typeof React.Component>(Constructor: T): T {
    return class extends React.Component {
      private _cachedInstances: Map<IConstructor<T>, T> = new Map();
      private _providers: Map<IConstructor<T>, T> = new Map();

      render() {
        const providers = this._providers;

        let element: React.ReactNode = React.createElement(Constructor, {...this.props, providers} as any, null);

        if (knownProviders) {
          for (const type of knownProviders) {
            const [context] = injectableMap.get(type);
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (!value) {
                console.error(`Looks like the \`${type.name}\` has not been provided.`);
              }
              providers.set(type, value);
              return currentElement;
            });
          }
        } else {
          for (const [type, [context]] of injectableMap.entries()) {
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (!value) {
                console.error(`Looks like the \`${type.name}\` has not been provided.`);
              }
              providers.set(type, value);
              return currentElement;
            });
          }
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
          } if (deps.length > 0) {
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
                  let instance = this._cachedInstances.get(options.provide);
                  if (!instance) {
                    const withArgs = (options.withArgs || []).slice();
                    withArgs.push(depsProviders);
                    instance = createInstance({...options, withArgs});
                    this._cachedInstances.set(options.provide, instance);
                  }
                  return React.createElement(context.Provider, {value: instance, key: 'Provider'}, currentElement);
                }
                return currentElement;
              });
            });
          } else {
            let instance = this._cachedInstances.get(options.provide);
            if (!instance) {
              instance = createInstance(options);
              this._cachedInstances.set(options.provide, instance);
            }
            element = React.createElement(context.Provider, {value: instance, key: 'Provider'}, element);
          }
        }

        return React.createElement(React.Fragment, null, element);
      }
    } as any;
  }
}
