// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const csrf = require('csurf');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/Pawprints';

mongoose.connect(
  dbURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log('Could not connect to database');
      throw err;
    }
  }
);

let redisURL = {
  hostname: 'redis-16081.c83.us-east-1-2.ec2.cloud.redislabs.com', // your hostname from RedisLabs
  port: 16081, // your port number from RedisLabs
};

let redisPASS = 'gWJxmuIV5cU02zfr61BIvnk3D7R8qk3c'; // password from RedisLabs

if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(':')[1];
}

// pull in our routes
const router = require('./router.js');

const app = express();

app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
app.use('/images', express.static(path.resolve(`${__dirname}/../hosted/img/`)));
app.use(express.static(path.join(__dirname, '/../hosted')));

app.disable('x-powered-by');
app.use(compression());

// Add the file upload package. This will place all uploaded files into req.files
app.use(fileUpload());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    key: 'sessionid',
    store: new RedisStore({
      host: redisURL.hostname,
      port: redisURL.port,
      pass: redisPASS,
    }),
    secret: 'Pawprints',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
  })
);

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(cookieParser());

// csrf must come aFTER app.use(cookieParser());
// and app.use(session({.....})) should come BEFORE the router
app.use(csrf());
app.use((err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, err => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
