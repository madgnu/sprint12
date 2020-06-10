const fsPromises = require('fs').promises;
const path = require('path');
const router = require('express').Router();

const cardsFilePath = path.join(__dirname, '../data/cards.json');
const getCards = async () => JSON.parse(await fsPromises.readFile(cardsFilePath, { encoding: 'utf8' }));

router.get('/', async (req, res, next) => {
  try {
    res.send(await getCards());
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка при загрузке карточек, обратитесь к погроммисту',
      error: err.toString(),
    });
  }
  next();
});

module.exports = router;
