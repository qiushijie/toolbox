let ws: WebSocket | null = null;
const listeners: {[key: string]: (data: any) => void} = {};

export const serialEvent = 'serial';

export function connect() {
  ws = new WebSocket('ws://localhost:8080/ws');
  ws.onopen = () => {
    console.log('websocket onopen');
  }
  ws.onclose = () => {
    console.log('websocket onclose');
  }
  ws.onmessage = (message) => {
    const {event, data} = JSON.parse(message.data);
    const handle = listeners[event];
    handle && handle(data);
  }
}

export function addListener(event: string, handler: (data: any) => void) {
  listeners[event] = handler;
}

export function removeListener(event: string) {
  delete listeners[event];
}

export function send(event: string, data: any) {
  if (ws == null) {
    console.warn('ws is null');
    return;
  }
  console.log('send', event, data);
  ws.send(JSON.stringify({event, data}));
}

export function disconnect() {
  ws && ws.close();
}