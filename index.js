import { Blockchain } from "./blockchain.js";
import express from "express";
import cors from "cors";
import Cryptr from "cryptr";
import fs from "fs";
import fetch from "node-fetch";
import { parse } from 'node-html-parser';

const app = express();
const port = 5000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const nikahNama = new Blockchain();
const encryption = new Cryptr("nikahNamaKey");

fs.readFile("backup.txt", "utf8", (error, data) => {
  if (!error) {
    let decrypted = JSON.parse(encryption.decrypt(data));
    if (decrypted.length > 0) nikahNama.chain = decrypted;
  }
});

const backup = () => {
  let encrypted = encryption.encrypt(JSON.stringify(nikahNama.chain));
  fs.writeFileSync("backup.txt", encrypted, "utf8", (error, data) => {
    if (error) console.log(error);
  });
};

app.get("/", (request, response) => {
  response.json("hello world");
});



app.post("/nid", (request, response) => {
  const url = "https://ldtax.gov.bd/citizen/nidCheck/";
  
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ nid: request.body.nid, dob: request.body.dob }),
  };

  fetch(url, options)
    .then(response => response.json())
    .then(result => {

      if (result.success === "true") {
        const root = parse(result.data);
        const data = {
          name_of_national: root.querySelectorAll('td')[1].innerText,
          name_of_father: root.querySelectorAll('td')[3].innerText,
          name_of_mother: root.querySelectorAll('td')[5].innerText,
          image: root.querySelectorAll('img')[0].getAttribute('src'),
        }
        response.json(data);
      } else {
        response.json(result.success);
      }

    })
    .catch((error) => console.error("error:" + error));

});



app.get("/blockchain", (request, response) => {
  response.json(nikahNama.chain);
});

app.get("/blockchain", (request, response) => {
  response.json(nikahNama.chain);
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
  // console.log(request.body);
  const { person } = request.body;
  response.json(nikahNama.search(person));
});

app.get("/reset", (request, response) => {
  response.json("cleared");
});

const server = app.listen(port, () => {
  console.log(`Nikahnama listening on port ${port}`);
});
