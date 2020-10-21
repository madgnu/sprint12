const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const celebrateErrors = require('celebrate').errors;

const vault = require('./modules/vault');
const auth = require('./middlewares/auth');
const logger = require('./middlewares/logger');
const errhandler = require('./middlewares/errhandler');
const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const {
  PORT = 3000,
  NODE_ENV = 'production',
  LOGS_DIR = 'logs',
  LOGS_FORMAT = 'json',
  LOGS_TYPE = 'file',
} = process.env;

if (!vault.init()) {
  // if we are here, so we are in prod and cannot initialize important secrets (like JWT_SECRET).
  // eslint-disable-next-line no-console
  process.exit(1);
}

const app = express();

mongoose.connect(vault.getSecret('MONGODB_URI'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const err404 = (req, res, next) => {
  if (!res.headersSent) {
    res.status(404).send({
      message: 'Запрашиваемый ресурс не найден',
    });
  }
  next();
};

if (vault.getSecret('AUTH_STRATEGY') === 'cookie') {
  app.use(cookieParser());
}

if (NODE_ENV === 'production') app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger({
  loggerType: 'log',
  format: LOGS_FORMAT,
  transportType: LOGS_TYPE,
  filename: 'request.log',
  dirname: LOGS_DIR,
}));

app.get('/crash-test', (req, res) => {
  res.status(500).send({
    message: 'https://stackoverflow.com/search?q=how+to+fix+production+server',
  });
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 500);
});

app.use('/', authRouter);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
if (NODE_ENV === 'dev') app.use(celebrateErrors());
app.use(logger({
  loggerType: 'error',
  format: LOGS_FORMAT,
  transportType: LOGS_TYPE,
  filename: 'error.log',
  dirname: LOGS_DIR,
}));
app.use(errhandler);
app.use(err404);

// eslint-disable-next-line no-console
app.listen(PORT);
