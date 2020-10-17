const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const vault = require('./modules/vault');
const auth = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const {
  PORT = 3000,
  NODE_ENV = 'production',
} = process.env;

if (!vault.init()) {
  // if we are here, so we are in prod and cannot initialize important secrets (like JWT_SECRET).
  // eslint-disable-next-line no-console
  console.error(new Date(), 'Could not initialize secrets vault. Exiting.');
  process.exit(1);
}

const app = express();

mongoose.connect(vault.getSecret('MONGODB_URI'), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// eslint-disable-next-line no-console
mongoose.connection.on('error', console.error.bind(console, new Date(), 'connection error:'));
// eslint-disable-next-line no-console
mongoose.connection.on('open', console.log.bind(console, new Date(), 'App connected to database'));

const logger = (req, res, next) => {
  const endHook = () => {
    res.removeListener('finish', endHook);
    res.removeListener('close', endHook);
    // eslint-disable-next-line no-console
    console.log(new Date(), req.ip, req.method, req.originalUrl, res.statusCode);
  };
  res.on('finish', endHook);
  res.on('close', endHook);
  next();
};

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

if (NODE_ENV === 'dev') app.use(logger);
if (NODE_ENV === 'production') app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', authRouter);
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);
app.use(err404);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(new Date(), `Server started at port ${PORT}`));
