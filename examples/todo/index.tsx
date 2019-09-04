import * as React from 'react';
import * as ReactDom from 'react-dom';

import {TodoApp} from './TodoApp';


const root = document.createElement('div');
document.body.appendChild(root);

ReactDom.render(
  <TodoApp />,
  root,
);