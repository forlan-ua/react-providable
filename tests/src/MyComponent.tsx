import * as React from 'react';
import {MyService} from './MyService.service';
import {HttpClient} from './HttpClient.service';
import {HttpClient2} from './HttpClient2.service';
import {Providable} from '../../src';
import {ProvidersMap} from '../../src/Providable';
import {MyComponent2} from './MyComponent2';


type Props = {
  providers?: ProvidersMap<MyService>,
  test: string,
}


@Providable([HttpClient, HttpClient2, MyService], [MyService])
export class MyComponent extends React.Component<Props> {
  render() {
    console.log('MyComponent', this.props.providers);

    return (
      <div>
        MyComponent: {this.props.test}
        <MyComponent2 test={this.props.test} />
      </div>
    );
  }
}