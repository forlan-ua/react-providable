import * as React from 'react';
import {Providable} from '../../src/Providable';
import {Subscribable} from '../../src/Subscribable';
import {subscribe, provider} from '../../src/decorators';
import {CounterService, CounterState, CounterDirection, CounterStatus} from './Counter.service';
import { Subject } from 'rxjs';

require('./CounterApp.css');


type Props = {
  myprop: string;
}

type State = {
  valueForSet: string,
  speedForSet: string,
};


@Providable([CounterService])
@Subscribable()
export class CounterApp extends React.Component<Props, State> {
  @provider(CounterService)
  private counterService: CounterService = null;

  @subscribe(CounterService, 'state$')
  private counterState: CounterState = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      valueForSet: '10',
      speedForSet: '200',
    };
  }

  onStartClick = () => {
    this.counterService.start();
  }

  onStopClick = () => {
    this.counterService.stop();
  }

  onValueChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({valueForSet: evt.target.value});
  }

  onValueChangeSetClick = () => {
    this.counterService.setValue(Number(this.state.valueForSet))
  }

  onSpeedChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({speedForSet: evt.target.value});
  }

  onSpeedChangeSetClick = () => {
    this.counterService.setSpeed(Number(this.state.speedForSet));
  }

  onDirectionForwardClick = () => {
    this.counterService.setDirection(CounterDirection.Forward);
  }

  onDirectionBackwardClick = () => {
    this.counterService.setDirection(CounterDirection.Backward);
  }

  render() {
    if (!this.counterState) {
      return;
    }

    return (
      <section>
        <h1>{this.counterState.value}</h1>
        <div>
          Current status: {CounterStatus[this.counterState.status]}<br/>
          <button type="button" onClick={this.onStartClick}>Start</button>
          <button type="button" onClick={this.onStopClick}>Stop</button>
        </div>
        <hr />
        <div>
          Set value: <input type="text" value={this.state.valueForSet} onChange={this.onValueChange} />
          <button type="button" onClick={this.onValueChangeSetClick}>Set</button>
        </div>
        <hr />
        <div>
          Current speed: {this.counterState.speed}ms <br />
          Set speed (ms): <input type="text" value={this.state.speedForSet || this.counterState.speed} onChange={this.onSpeedChange} />
          <button type="button" onClick={this.onSpeedChangeSetClick}>Set</button>
        </div>
        <hr />
        <div>
          Current direction: {CounterDirection[this.counterState.direction]} <br />
          <button type="button" onClick={this.onDirectionForwardClick}>Forward</button>
          <button type="button" onClick={this.onDirectionBackwardClick}>Backward</button>
        </div>
        
      </section>
    )
  }
}