import React from 'react';
import {render} from 'react-dom';
import Root from "./Root";

const ws = new WebSocket('ws://localhost:8080/ws');
ws.onopen = () => {
  console.log('onopen');
  ws.send('111');
}
ws.onclose = () => {
  console.log('onclose');
}
ws.onmessage = (message) => {
  console.log(message);
}

render(
  <Root />,
  document.getElementById('app')
);