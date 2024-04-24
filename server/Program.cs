using System;
using System.Collections.Generic;
using System.Linq;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;

namespace server
{
    public class DataModel
    {
        // Define properties that match the structure of your JSON data
        public string type { get; set; }
        public string gameId { get; set; }
        public string index { get; set; }
        public int playerid { get; set; }
        public string color { get; set; }
    }

    public class Game
    {
        public string GameID { get; set; }
        public List<string> Players { get; set; } = new List<string>();
    }

    public class GameCreationResponse
    {
        public string type { get; set; }
        public string gameID { get; set; }
    }

    public class GameJoinResponse
    {
        public string type { get; set; }
        public string gameID { get; set; }
        public bool success { get; set; }
    }

    public class PlaceTadpoleResponse
    {
        public string type { get; set; }
        public string index { get; set; }
        public int playerid { get; set; }
        public string color { get; set; }
    }

    public class PlaceFrogResponse
    {
        public string type { get; set; }
        public string index { get; set; }
        public int playerid { get; set; }
        public string color { get; set; }
    }

    public class CreateOrJoinGame : WebSocketBehavior
    {
        private static readonly Random random = new Random();
        private static readonly Dictionary<string, Game> games = new Dictionary<string, Game>();

        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("Received: " + e.Data);   
            // Deserialize the JSON data into your data model
            var data = JsonConvert.DeserializeObject<DataModel>(e.Data);

            // Process the data
            if (data == null || string.IsNullOrEmpty(data.type)) return;

            string type = data.type;

            switch (type)
            {
                case "createGame":
                    CreateGame();
                    break;
                case "joinGame":
                    JoinGame(data);
                    break;
                case "placeTadpole":
                    PlaceTadpole(data);
                    break;
                case "placeFrog":
                    PlaceFrog(data);
                    break;
            }
        }

        private void CreateGame()
        {
            string gameID = GenerateRandomString(6);
            var game = new Game { GameID = gameID };
            games[gameID] = game;

            var response = new GameCreationResponse
            {
                type = "createdGame",
                gameID = gameID
            };
            Send(JsonConvert.SerializeObject(response));
        }

        private void JoinGame(DataModel data)
        {
            var response = new GameJoinResponse();

            string gameID = data.gameId;

            if (gameID == null) return;

            if (games.ContainsKey(gameID))
            {
                response.type = "joinedGame";
                response.gameID = gameID;
                response.success = true;

                // Send the response to all connected clients
                Sessions.Broadcast(JsonConvert.SerializeObject(response));
            }
            else
            {
                response.type = "gameNotFound";
                response.success = false;
                Send(JsonConvert.SerializeObject(response));
            }
        }

        private void PlaceTadpole(DataModel data)
        {

            var response = new PlaceTadpoleResponse
            {
                type = "placeTadpole",
                index = data.index,
                playerid = data.playerid,
                color = data.color
            };

            // Send the response to all connected clients
            Sessions.Broadcast(JsonConvert.SerializeObject(response));
        }
        
        private void PlaceFrog(DataModel data)
        {
            var response = new PlaceFrogResponse
            {
                type = "placeFrog",
                index = data.index,
                playerid = data.playerid,
                color = data.color
            };

            // Send the response to all connected clients
            Sessions.Broadcast(JsonConvert.SerializeObject(response));
        }

        private string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            WebSocketServer wssv = new WebSocketServer("ws://localhost:5560");

            wssv.AddWebSocketService<CreateOrJoinGame>("/");

            wssv.Start();
            Console.WriteLine("Server started on: ws://localhost:5560");

            Console.ReadKey();
            wssv.Stop();
        }
    }
}
