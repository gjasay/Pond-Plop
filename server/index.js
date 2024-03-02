const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const clients = {};
const games = {};

wss.on('connection', ws => {
  console.log('New client connected!');

  ws.on('close', () => {
    console.log('Client has disconnected!');
  });

  // Generate unique client id
  const clientId = Math.random().toString(36).substr(2, 9);
  clients[clientId] = {
    "clientId": clientId,
    "ws": ws
  };

  const payLoad = {
    "action": "connect",
    "clientId": clientId
  };
  // Send client id to client 
  ws.send(JSON.stringify(payLoad));

  ws.on('message', message => {
    const data = JSON.parse(message);
    console.log(data);

    // Handle createGame and joinGame messages
    if (data.type === 'createGame') {
      const gameId = Math.random().toString(36).substr(2, 9);
      games[gameId] = {
        id: gameId,
        players: [clientId],
        // TODO: Initialize game state
      };
      clients[clientId].gameId = gameId;
      ws.send(JSON.stringify({ type: 'gameCreated', gameId: gameId }));
    } else if (data.type === 'joinGame') {
      const gameId = data.gameId;
      if (games[gameId] && games[gameId].players.length < 2) {
        games[gameId].players.push(clientId);
        clients[clientId].gameId = gameId;
        ws.send(JSON.stringify({ type: 'gameJoined', gameId: gameId }));
        // TODO: Send game state to both players
      } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Unable to join game' }));
      }
    }

    // Handle placeTadpole and placeFrog messages
    else if (data.type === 'placeTadpole' || data.type === 'placeFrog') {
      const gameId = clients[clientId].gameId;
      if (!gameId) {
        ws.send(JSON.stringify({ type: 'error', message: 'Not in a game' }));
        return;
      }
      // TODO: Update game state

      // Broadcast game state update to all players in the game
      const update = {
        type: 'updateGameState',
        // TODO: Include updated game state
      };
      for (const playerId of games[gameId].players) {
        clients[playerId].ws.send(JSON.stringify(update));
      }
    }
  });
});