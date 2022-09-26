import { Blockchain } from "./blockchain.js";
import express from "express";
import cors from "cors";
import Cryptr from "cryptr";
import fs from "fs";
import enableWs from "express-ws";
// var WebSocketClient = require("websocket").client;
import WebSocketClient from "websocket";

// const client = WebSocketClient.client;

const app = express();
const port = 5000;

enableWs(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const nikahNama = new Blockchain();
const encryption = new Cryptr("nikahNamaKey");

fs.readFile("backup.nk", "utf8", (error, data) => {
  if (!error) {
    let decrypted = JSON.parse(encryption.decrypt(data));
    if (decrypted.length > 0) nikahNama.chain = decrypted;
  }
});

// client.on("connectFailed", function (error) {
//   console.log("Connect Error: " + error.toString());
// });

const backup = () => {
  let encrypted = encryption.encrypt(JSON.stringify(nikahNama.chain));
  fs.writeFileSync("backup.nk", encrypted, "utf8", (error, data) => {
    if (error) console.log(error);
  });
};

app.ws("/echo", function (ws, req) {
  ws.on("message", function (msg) {
    ws.send(msg);
  });
});

app.get("/", (request, response) => {
  response.json("hello world");
});

app.get("/blockchain", (request, response) => {
  response.json(nikahNama);
});

app.post("/addBlock", (request, response) => {
  if (nikahNama.addBlock(request.body)) {
    backup();
    response.json("added");
  } else {
    response.json("rejected");
  }
});

app.post("/lookUp", (request, response) => {
  const { person } = request.body;
  response.json(nikahNama.search(person));
});

app.get("/reset", (request, response) => {
  response.json("cleared");
});

const server = app.listen(port, () => {
  console.log(`Nikahnama listening on port ${port}`);
});
