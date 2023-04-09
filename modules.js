'use strict';

const https = require('https');
const crypto = require('crypto');
const dotenv = require('dotenv');
let { computeTimeStamp, computeNonce } = require('./utils/helpers');

dotenv.config({ path: './config.env' });

const clientId = process.env.CLIENT_ID;
const secretKey = process.env.SECRET_KEY;
const authKey = process.env.AUTH_KEY;
const signatureMethod = process.env.SIGNATURE_METHOD;
const terminalId = process.env.TERMINAL_ID;

let authorizationString;
let nonce;
let timeStamp;
let hostname = process.env.HOST_NAME;

timeStamp = computeTimeStamp();

function curl(path, res, method = 'GET', params = '{}', headers = {}) {
  nonce = computeNonce();
  let data = '';
  let fullPath = 'https://' + hostname + path;

  const options = {
    hostname,
    path,
    method,
    headers: {
      Authorization: 'InterswitchAuth ' + authKey,
      'Content-Type': 'application/json',
      Signature: computeSignature(fullPath, method),
      Timestamp: timeStamp,
      Nonce: nonce,
      TerminalID: terminalId,
      SignatureMethod: signatureMethod,
    },
  };

  function computeSignature(endpoint, method) {
    method = method.toUpperCase();
    let signature =
      method +
      '&' +
      encodeURIComponent(endpoint) +
      '&' +
      timeStamp +
      '&' +
      nonce +
      '&' +
      clientId +
      '&' +
      secretKey;
    let hashedSignature = crypto
      .createHash('sha1')
      .update(signature)
      .digest('base64');
    return hashedSignature;
  }

  const request = https
    .request(options, (response) => {
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        res.send(JSON.parse(data));
      });
    })
    .on('error', (error) => {
      console.log('error: ', error);
    });

  if (method === 'POST') {
    request.write(params);
  }
  request.end();
}

exports.curl = curl;
