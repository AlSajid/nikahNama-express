import sha256 from "crypto-js/sha256.js";
import pkg from "elliptic";
const { ec } = pkg;

const myKey = ec("secp256k1").keyFromPrivate(
  "292ab625ec8c092b82ccf81a88728e4e78f6132dceb80fac72cee2e2d69006e4"
);

export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  calculateHash(block) {
    return sha256(
      JSON.stringify(block.data) + block.nonce + block.timestamp
    ).toString();
  }

  createGenesisBlock() {
    const genesisBlock = {
      data: {
        groom: { name_of_national: "হযরত আদম (আ.)" },
        bride: { name_of_national: "হযরত হাওয়া (আ.)" },
        witness: { name_of_national: "আল্লাহ" },
      },
    };
    const hash = this.calculateHash(genesisBlock);
    return { ...genesisBlock, hash };
  }

  checkSignature(block) {
    const myKey =
      "043c80518c700de299c4f528d67230aeb8eb28a82c13fd7d27bfc45aca23da32e152251e5ef6801fccc1580783ac287640d9aff65508635156223befafc62736ad";
    const publicKey = ec("secp256k1").keyFromPublic(myKey, "hex");
    return publicKey.verify(block.hash, block.signature);
  }

  addBlock(newBlock) {
    // add block only if it has valid hash and signature
    if (
      this.calculateHash(newBlock) === newBlock.hash &&
      this.checkSignature(newBlock)
    ) {
      newBlock.previousHash = this.getLatestBlock().hash;
      this.checkSignature(newBlock);

      this.chain.push(newBlock);
      return true;
    }

    return false;
  }

  search(nid) {
    return this.chain.filter((block) => {
      return (
        block.data.groom.nid_number == nid || block.data.bride.nid_number == nid
      );
    });
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
    }
    return true;
  }
}
