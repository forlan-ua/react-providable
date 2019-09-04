import * as React from 'react';
import * as ReactDom from 'react-dom';

import {CounterApp} from './CounterApp';


const root = document.createElement('div');
document.body.appendChild(root);

ReactDom.render(
  <CounterApp />,
  root,
);