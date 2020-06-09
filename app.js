const express = require('express');
const path = require('path');
const cardsRouter = require('./routes/cards');
const usersRouter = require('./routes/users');

const { HTTP_PORT = 3000, NODE_ENV = 'prod' } = process.env;
const app = express();

const logger = (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(new Date(), req.ip, req.method, req.url, res.statusCode);
  next();
};

const err404 = (req, res) => {
  res.status(404).send({
    message: 'Запрашиваемый ресурс не найден',
  });
};


app.use(express.static(path.join(__dirname, 'public')));
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
if (NODE_ENV === 'dev') app.use(logger);
app.use(err404);


app.listen(HTTP_PORT);
