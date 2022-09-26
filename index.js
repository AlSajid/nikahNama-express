import { Blockchain } from "./blockchain.js";
import express from "express";
import cors from "cors";
import Gun from "gun";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(Gun.serve);

const nikahNama = new Blockchain();
const backup = Gun({
  peers: [
    "https://nikahnama.onrender.com/gun",
    "https://odd-stockings-newt.cyclic.app/gun",
  ],
}).get("blockchain");

backup.once(function (data) {
  if (data.nikahNama) {
    nikahNama.chain = JSON.parse(data.nikahNama);
  } else {
    backup.put({ nikahNama: JSON.stringify(nikahNama.chain) });
  }
});
// updateBackup();
function updateBackup() {
  backup.put({ nikahNama: JSON.stringify(nikahNama.chain) });
  console.log("backup updated");
}

app.get("/", (request, response) => {
  response.json("hello world");
});

app.get("/blockchain", (request, response) => {
  response.json(nikahNama);
});

app.get("/backup", (request, response) => {
  backup.once(function (data) {
    response.json(data);
  });
});

app.post("/addBlock", (request, response) => {
  if (nikahNama.addBlock(request.body)) {
    updateBackup();
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
  backup.put({});
  response.json("cleared");
});

const server = app.listen(port, () => {
  console.log(`Nikahnama listening on port ${port}`);
});

Gun({ web: server });
