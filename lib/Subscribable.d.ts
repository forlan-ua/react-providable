import * as React from 'react';
import { Observable } from 'rxjs';
export declare type SubscribeFunction = <P>(o: Observable<P>, cb: (value: P) => void) => void;
export declare function Subscribable(): <T extends typeof React.Component>(Constructor: T) => T;
