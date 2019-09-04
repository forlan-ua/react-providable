import * as React from 'react';
import {Providable, ProvidersMap} from '../../../src/Providable';
import {SubscribeFunction, Subscribable} from '../../../src/Subscribable';
import {CounterService, CounterState, CounterDirection, CounterStatus} from './Counter.service';

require('./App.css');


type Props = {
  providers?: ProvidersMap<CounterService>;
  subscribe?: SubscribeFunction;
}

type State = {
  valueForSet: string,
  speedForSet: string,
} & CounterState;


@Providable([CounterService])
@Subscribable()
export class App extends React.Component<Props, State> {
  private counterService: CounterService;

  constructor(props: Props) {
    super(props);

    this.counterService = props.providers.get(CounterService);
    const state = this.counterService.state$.getValue();
    this.state = {
      ...state,
      valueForSet: state.value.toString(),
      speedForSet: state.speed.toString(),
    };
  }

  componentDidMount() {
    this.props.subscribe(this.counterService.state$, (counter) => {
      this.setState(counter);
    });
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
    return (
      <section>
        <h1>{this.state.value}</h1>
        <div>
          Current status: {CounterStatus[this.state.status]}<br/>
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
          Current speed: {this.state.speed}ms <br />
          Set speed (ms): <input type="text" value={this.state.speedForSet} onChange={this.onSpeedChange} />
          <button type="button" onClick={this.onSpeedChangeSetClick}>Set</button>
        </div>
        <hr />
        <div>
          Current direction: {CounterDirection[this.state.direction]} <br />
          <button type="button" onClick={this.onDirectionForwardClick}>Forward</button>
          <button type="button" onClick={this.onDirectionBackwardClick}>Backward</button>
        </div>
        
      </section>
    )
  }
}