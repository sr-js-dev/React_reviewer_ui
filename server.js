const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const cors = require('cors');
const request = require('request');

const app = express();

function requireSSL(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
}

if (process.env.NODE_ENV === 'production') {
  app.use(requireSSL);
}

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '20mb' }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

const proxyUrl = process.env.REACT_APP_WEB_PROXY_URL || 'http://localhost:3011';
// Removes etag generation except for static files, weak etags are automatically used
app.set('etag', false);

app.use('/server', proxy(proxyUrl));

// Catch all other routes and return the index file
let root = path.join(__dirname, '.', 'build/');
app.use(express.static(root));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root });
});

// Get Port from env
const port = process.env.PORT || '3010';
app.set('port', port);

// Create the HTTP server
const server = http.createServer(app);

// Listen on the configured port
server.listen(port, () => console.log(`API running on ${port}`));
