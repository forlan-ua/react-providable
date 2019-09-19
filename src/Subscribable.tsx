import * as React from 'react';
import {Observable, Subscription} from 'rxjs';


export type SubscribeFunction = <P>(o: Observable<P>, cb: (value: P) => void, onerror?: (error: any) => void) => void;
export type UnsubscribeFunction = <P>(o: Observable<P>) => void;


type ISubscribable<P={}, S={}, SS=any> = new (...args: Array<any>) => React.Component<P, S, SS> & {
  subscribe?: SubscribeFunction;
  unsubscribe?: UnsubscribeFunction;
};

export function Subscribable() {
  return function <T extends ISubscribable>(Constructor: T): T {
    return class extends Constructor {
      private __subscriptions: Array<[any, Subscription]> = [];

      subscribe: SubscribeFunction = (o, cb, onerror) => {
        this.__subscriptions.push([o, o.subscribe(cb, onerror, () => this.unsubscribe(o))]);
      }

      unsubscribe: UnsubscribeFunction = (o) => {
        const index = this.__subscriptions.findIndex(([type, _]) => type === o);
        if (index === -1) {
          return;
        }
        this.__subscriptions.splice(index, 1)[0][1].unsubscribe();
      }

      componentWillUnmount() {
        for (const [_, subscription] of this.__subscriptions) {
          subscription.unsubscribe();
        }
        if (super.componentWillUnmount) {
          super.componentWillUnmount();
        }
      }
    };
  }
}
