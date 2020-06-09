const fsPromises = require('fs').promises;
const path = require('path');
const router = require('express').Router();

const usersFilePath = path.join(__dirname, '../data/users.json');
const getUsers = async () => JSON.parse(await fsPromises.readFile(usersFilePath, { encoding: 'utf8' }));
// eslint-disable-next-line no-underscore-dangle
const findUserById = async (id) => (await getUsers()).find((el) => el._id === id);

router.get('/', async (req, res, next) => {
  try {
    res.send(await getUsers());
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка при загрузке пользователей, обратитесь к погроммисту',
      error: err.toString(),
    });
  }
  next();
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({
        message: 'Нет пользователя с таким id',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка при загрузке пользователя, обратитесь к погроммисту',
      error: err.toString(),
    });
  }
  next();
});

module.exports = router;
