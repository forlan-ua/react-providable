import * as React from 'react';
import {Observable, Subscription} from 'rxjs';


export type SubscribeFunction = <P>(o: Observable<P>, cb: (value: P) => void) => void;


export function Subscribable() {
  return function <T extends typeof React.Component>(Constructor: T): T {
    return class extends React.Component {
      private _subscriptions: Array<Subscription> = [];

      constructor(props: any) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
      }

      subscribe<P>(o: Observable<P>, cb: (value: P) => void) {
        this._subscriptions.push(o.subscribe(cb));
      }

      componentWillUnmount() {
        for (const subscription of this._subscriptions) {
          subscription.unsubscribe();
        }
      }

      render() {
        return React.createElement(Constructor, {...this.props, subscribe: this.subscribe} as any, null);
      }
    } as any;
  }
}