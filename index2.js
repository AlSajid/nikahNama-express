import { Blockchain } from "./blockchain.js";
import express from "express";
import cors from "cors";
import Cryptr from "cryptr";
import fs from "fs";

const app = express();
const port = 5001;

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



const backup = () => {
  let encrypted = encryption.encrypt(JSON.stringify(nikahNama.chain));
  fs.writeFileSync("backup.nk", encrypted, "utf8", (error, data) => {
    if (error) console.log(error);
  });
};

app.get("/", (request, response) => {
  response.json("hello world");
});

app.get("/blockchain", (request, response) => {
  response.json(nikahNama);
});

app.get("/reset", (request, response) => {
  response.json("cleared");
});

const server = app.listen(port, () => {
  console.log(`Nikahnama Backup listening on port ${port}`);
});
