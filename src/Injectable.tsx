import * as React from 'react';

export type IConstructor<T> = {new(...args: Array<any>): T}
export type IAnyConstructor = IConstructor<any>;

export type IInjectableMapEntry = [React.Context<Object>, Array<IAnyConstructor>];
export const injectableMap: Map<IAnyConstructor, IInjectableMapEntry> = new Map();


type InjectableOptions = {
  deps?: Array<IAnyConstructor>;
}

export function Injectable(options: InjectableOptions = {}) {
  return function <T extends IAnyConstructor>(Constructor: T): T {
    const entry: IInjectableMapEntry = [React.createContext(null), options.deps || []];
    injectableMap.set(Constructor, entry);
    return Constructor;
  }
}
