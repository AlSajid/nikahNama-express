import pkg from "elliptic";
const { ec } = pkg;

const key = ec("secp256k1").genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

console.log(publicKey);
console.log(privateKey);

// 048562148fff57af40ec8a5f552822355a724dfacc634258692d5e22ec1570c320a9602f869b4dd3440033de78b30734a9fab11e7468e36432de08add0ddbf6dbb
// 4f21f9a2bd922d52e6a38cd19c5bbc59532ba2f181822c77bd7e8a21f5437fe8