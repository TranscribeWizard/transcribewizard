const WebSocket = require('ws');
const l = console.log;
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

    setInterval(()=>checkForDeadConnection(websocketConnection), 10000);
  });
};


const setWebsocketConnection = (ws) => {
  console.log(`WebSocket connection established: ${ws.id}`);
  websocketConnection = ws;
};

const checkForDeadConnection = (currentws) => {
  if(!currentws) return;
    l('ping failure : ' + currentws.pingFailures);
    const pingFailures = currentws.pingFailures || 0;
    l('pingfailures', pingFailures);
    if (pingFailures >= MAX_PING_FAILURES) {
      console.log(`WebSocket connection ${currentws.id} exceeded maximum ping failures`);
      try {
        currentws.terminate();
      } catch (error) {
        console.error(`Error terminating WebSocket connection: ${error}`);
      }
      currentws = null;
    } else if (currentws.isAlive === false) {
      console.log(`WebSocket connection ${currentws.id} is dead`);
      try {
        currentws.terminate();
      } catch (error) {
        console.error(`Error terminating WebSocket connection: ${error}`);
      }
      currentws = null;
    } else {
      currentws.isAlive = false;
      currentws.ping();
      currentws.pingFailures = pingFailures + 1;
    }
  };
  

const getWebsocket = () => {
  console.log("i am a from GetWebsocket()");
  return websocketConnection;
};

module.exports = {
  createWebSocketServer,
  getWebsocket
}