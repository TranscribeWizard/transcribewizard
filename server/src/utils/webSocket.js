const WebSocket = require('ws');

const MAX_PING_FAILURES = 3;
let websocketConnection;



const createWebSocketServer = (server) => {
  const wss = new WebSocket.Server({
    server,
  });
  wss.on('connection', (ws, req) => {
    ws.id = Math.random().toString(36).substring(2);
    ws.isAlive = true;
    ws.pingFailures = 0;
    setWebsocketConnection(ws);

    ws.on('pong', () => {
      ws.isAlive = true;
      ws.pingFailures = 0;
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed: ${ws.id}`);
      if (websocketConnection === ws) {
        websocketConnection = null;
      }
    });

    ws.on('error', (err) => {
      console.error(`WebSocket error: ${err}`);
      if (websocketConnection === ws) {
        websocketConnection = null;
      }
    });

    setInterval(checkForDeadConnection, 5000);
  });
};


const setWebsocketConnection = (ws) => {
  console.log(`WebSocket connection established: ${ws.id}`);
  websocketConnection = ws;
};

const checkForDeadConnection = () => {
    const pingFailures = websocketConnection.pingFailures || 0;
    if (pingFailures >= MAX_PING_FAILURES) {
      console.log(`WebSocket connection ${websocketConnection.id} exceeded maximum ping failures`);
      try {
        websocketConnection.terminate();
      } catch (error) {
        console.error(`Error terminating WebSocket connection: ${error}`);
      }
      websocketConnection = null;
    } else if (websocketConnection.isAlive === false) {
      console.log(`WebSocket connection ${websocketConnection.id} is dead`);
      try {
        websocketConnection.terminate();
      } catch (error) {
        console.error(`Error terminating WebSocket connection: ${error}`);
      }
      websocketConnection = null;
    } else {
      websocketConnection.isAlive = false;
      websocketConnection.ping();
      websocketConnection.pingFailures = pingFailures + 1;
    }
  };
  

const getWebsocket = () => {
  return websocketConnection;
};

module.exports = {
  createWebSocketServer,
  getWebsocket
}