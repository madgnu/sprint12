const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const {
  PORT = 3000,
  NODE_ENV = 'prod',
  MONGODB_URI = 'mongodb://localhost:27017/mestodb',
  OWNER_ID = '5f867fc39e2c800abe5e84d4',
} = process.env;
const app = express();

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', console.error.bind(console, new Date(), 'connection error:'));
mongoose.connection.on('open', console.log.bind(console, new Date(), `App connected to mongo at ${MONGODB_URI}.`));

const logger = (req, res, next) => {
  console.log(new Date(), req.ip, req.method, req.url, res.statusCode);
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

const authWithinEnvId = (req, res, next) => {
  req.user = {
    _id: OWNER_ID,
  };
  next();
};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(authWithinEnvId);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(err404);
if (NODE_ENV === 'dev') app.use(logger);


app.listen(PORT, () => console.log(new Date(), `Server started at port ${PORT}`));
