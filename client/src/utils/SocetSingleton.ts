import WebSocket from 'ws';

class SocketSingleton {
    private static instance: WebSocket | null = null;
  
    public static getInstance(): WebSocket {
      if (!SocketSingleton.instance || SocketSingleton.instance.readyState === WebSocket.CLOSED) {
        SocketSingleton.instance = new WebSocket('ws://localhost:5001/socket');
        
        SocketSingleton.instance.onopen = () => {
          console.log('WebSocket connection opened');
        }

        // Add event listener to handle WebSocket closing events
        SocketSingleton.instance.addEventListener('close', () => {
          console.log('WebSocket connection closed');
          SocketSingleton.instance = null;
        });
      }
  
      return SocketSingleton.instance;
    }
  
    public static cleanup(): void {
      if (SocketSingleton.instance) {
        SocketSingleton.instance.removeEventListener('close', () => {
          console.log('WebSocket connection closed');
        });
        SocketSingleton.instance.close();
        SocketSingleton.instance = null;
      }
    }
  }
  

  export default SocketSingleton