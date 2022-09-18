import sha256 from "crypto-js/sha256.js";
import pkg from "elliptic";
const { ec } = pkg;

const myKey = ec("secp256k1").keyFromPrivate(
  "292ab625ec8c092b82ccf81a88728e4e78f6132dceb80fac72cee2e2d69006e4"
);

const myPublicKey = myKey.getPublic("hex");

export class Block {
  constructor(data) {
    this.previousHash;
    this.timestamp = new Date();
    this.data = data;
    this.hash = this.hash;
    this.signature = this.sign;
  }

  calculateHash() {
    return sha256(
      this.nonce +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }

  signBlock(key) {
    const sign = key.sign(this.hash, "base64");
    this.signature = sign.toDER("hex");
  }

  mineBlocks(difficulty) {
    const started = new Date().getTime();

    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("1")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
      console.log(this.hash);
    }

    console.log(
      "Mining Completed in " +
        (new Date().getTime() - started) +
        " milliseconds"
    );
  }
}

export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    const genesisBlock = new Block({
      groom: "হযরত আদম (আ.)",
      bride: "হযরত হাওয়া (আ.)",
      witness: "আল্লাহ",
    });
    genesisBlock.hash = genesisBlock.calculateHash();
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.signBlock(myKey);
    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      if (!currentBlock.signature || currentBlock.signature.length === 0) {
        return false;
      }

      console.log(currentBlock.signature);
      // const publicKey = ec("secp256k1").keyFromPublic(currentBlock.signature, 'hex');
      // if (!publicKey.verify(currentBlock.hash, this.signature)) {
      //   return false;
      // }
    }
    return true;
  }
}
