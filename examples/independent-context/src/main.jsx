import React from 'react'
import ReactDOM from 'react-dom'
import { StateWrapper} from './../../../src/index';
import App from './App'
import './../../asserts/index.css';

ReactDOM.render(
  <React.StrictMode>
    <StateWrapper>
      <App />
    </StateWrapper>
  </React.StrictMode>,
  document.getElementById('root')
)
