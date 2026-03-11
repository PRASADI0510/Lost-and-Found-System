const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

let refreshToken = null;
const targetEmail = 's92075202@ousl.lk';
if (config.additionalAccounts) {
  for (const acct of config.additionalAccounts) {
    if (acct.user && acct.user.email === targetEmail) {
      refreshToken = acct.tokens && acct.tokens.refresh_token;
      break;
    }
  }
}
if (!refreshToken) { console.error('No token for ' + targetEmail); process.exit(1); }

const postData = [
  'grant_type=refresh_token',
  'refresh_token=' + encodeURIComponent(refreshToken),
  'client_id=563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
  'client_secret=j9iVZfS8kkCEFUPaAeJV0sAi'
].join('&');

const tokenReq = https.request({
  hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(postData) }
}, (res) => {
  let body = '';
  res.on('data', (c) => body += c);
  res.on('end', () => {
    const td = JSON.parse(body);
    if (!td.access_token) { console.error('Token error:', body); process.exit(1); }
    listAndSetCors(td.access_token);
  });
});
tokenReq.write(postData);
tokenReq.end();

function listAndSetCors(token) {
  // List all buckets for the project
  const req = https.request({
    hostname: 'storage.googleapis.com',
    path: '/storage/v1/b?project=lostandfound-8c504',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  }, (res) => {
    let d = '';
    res.on('data', (c) => d += c);
    res.on('end', () => {
      console.log('Buckets response (' + res.statusCode + '):');
      try {
        const parsed = JSON.parse(d);
        if (parsed.items) {
          parsed.items.forEach(b => console.log(' - ' + b.name));
          // Set CORS on each bucket
          parsed.items.forEach(b => setCors(token, b.name));
        } else {
          console.log(d);
        }
      } catch(e) { console.log(d); }
    });
  });
  req.end();
}

function setCors(token, bucketName) {
  const corsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'cors.json'), 'utf-8'));
  const patchData = JSON.stringify({ cors: corsConfig });
  const req = https.request({
    hostname: 'storage.googleapis.com',
    path: '/storage/v1/b/' + encodeURIComponent(bucketName) + '?fields=cors',
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(patchData)
    }
  }, (res) => {
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('CORS set on ' + bucketName + '!');
      } else {
        console.log('Failed on ' + bucketName + ': ' + res.statusCode);
      }
    });
  });
  req.write(patchData);
  req.end();
}
