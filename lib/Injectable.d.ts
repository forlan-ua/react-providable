import * as React from 'react';
export declare type IConstructor<T> = {
    new (...args: Array<any>): T;
};
export declare type IAnyConstructor = IConstructor<any>;
export declare type IInjectableMapEntry = [React.Context<Object>, Array<IAnyConstructor>];
export declare const injectableMap: Map<IAnyConstructor, IInjectableMapEntry>;
declare type InjectableOptions = {
    deps?: Array<IAnyConstructor>;
};
export declare function Injectable(options?: InjectableOptions): <T extends IConstructor<any>>(Constructor: T) => T;
export {};
