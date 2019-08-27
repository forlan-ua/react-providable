import * as React from 'react';
import { IConstructor, IAnyConstructor } from './Injectable';
export declare type IProvidableAttribute = {
    provide: IAnyConstructor;
    useValue?: Object | null | undefined;
    useClass?: IAnyConstructor;
    useExisting?: IAnyConstructor;
    useFactory?: Function;
    withArgs?: Array<any>;
};
export interface ProvidersMap<T> extends Map<IConstructor<T>, T> {
    get<T>(type: IConstructor<T>): T;
}
export declare function Providable(newProviders?: Array<IAnyConstructor | IProvidableAttribute>, knownProviders?: Array<IAnyConstructor>): <T extends typeof React.Component>(Constructor: T) => T;
