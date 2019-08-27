import * as React from 'react';

import {IConstructor, IAnyConstructor, injectableMap} from './Injectable';


type IProvidableAttribute = {
  provide: IAnyConstructor;
  useValue?: Object | null | undefined;
  useClass?: IAnyConstructor;
  useExisting?: IAnyConstructor;
  useFactory?: Function;
  withArgs?: Array<any>;
}

function createInstance(attribute: IProvidableAttribute) {
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

export interface ProvidersMap<T> extends Map<IConstructor<T>, T> {
  get<T>(type: IConstructor<T>): T;
}

export function Providable(newProviders?: Array<IAnyConstructor | IProvidableAttribute>, knownProviders?: Array<IAnyConstructor>) {
  const attributes: Array<IProvidableAttribute> = (newProviders || []).map(attribute => typeof attribute === 'function' ? {provide: attribute} : attribute);

  return function <T extends typeof React.Component>(Constructor: T): T {
    return class extends React.Component {
      private _cachedInstances: Map<IConstructor<T>, T> = new Map();

      render() {
        const providers = new Map();
        let element: React.ReactNode = React.createElement(Constructor, {...this.props, providers} as any, null);

        if (knownProviders) {
          for (const type of knownProviders) {
            const [context] = injectableMap.get(type);
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (value) {
                providers.set(type, value);
              }
              return currentElement;
            });
          }
        } else {
          for (const [type, [context]] of injectableMap.entries()) {
            const currentElement = element;
            element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
              if (value) {
                providers.set(type, value);
              }
              return currentElement;
            });
          }
        }

        for (const attribute of attributes) {
          const [context, deps] = injectableMap.get(attribute.provide);

          if (attribute.useExisting) {
            const [existingContext] = injectableMap.get(attribute.useExisting);
            const currentElement = element;
            element = React.createElement(existingContext.Consumer, {key: 'Consumer'} as any, (value: any) => {
              return React.createElement(context.Provider, {value, key: 'Provider'}, currentElement);
            });
          } if (deps.length > 0) {
            const depsProviders: Map<IAnyConstructor, any> = new Map();
            const currentElement = element;

            element = React.createElement((): any => {
              if (attribute.withArgs) {
                attribute.withArgs.push(depsProviders);
              } else {
                attribute.withArgs = [depsProviders];
              }
              const instance = this._cachedInstances.get(attribute.provide) || createInstance(attribute);
              this._cachedInstances.set(attribute.provide, instance);

              return React.createElement(context.Provider, {value: instance, key: 'Provider'}, currentElement);
            }, null);

            deps.forEach((dep) => {
              const currentElement = element;
              element = React.createElement(context.Consumer, {key: 'Consumer'} as any, (value: any) => {
                if (value) {
                  depsProviders.set(dep, value);
                }
                return currentElement;
              });
            });
          } else {
            const instance = this._cachedInstances.get(attribute.provide) || createInstance(attribute);
            this._cachedInstances.set(attribute.provide, instance);
            element = React.createElement(context.Provider, {value: instance, key: 'Provider'}, element);
          }
        }

        return element;
      }
    } as any;
  }
}
