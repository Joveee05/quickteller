'use strict';
const crypto = require('crypto');
const dotenv = require('dotenv');

const clientId = process.env.CLIENT_ID;
const secretKey = process.env.SECRET_KEY;
const timeStamp = computeTimeStamp();
const nonce = computeNonce();

dotenv.config({ path: './config.env' });

function computeTimeStamp() {
  return (Date.now() / 1000) | 0;
}

function computeNonce(length = 32) {
  let nonce = '';
  let characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    nonce += characters[Math.floor(Math.random() * charactersLength) + 1];
  }
  return nonce;
}

module.exports = {
  // computeSignature,
  computeNonce,
  computeTimeStamp,
};
