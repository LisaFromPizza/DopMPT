require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const { createPool } = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

app.set('appName', 'DopMPT'); //  имя приложения в Express
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Разрешить запросы от всех источников (*)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const pool = createPool({
  'host': "localhost",
  'user': "root",
  'password': "root12345",
  'database': "DopMPT8",
});

const connection = mysql.createConnection ({
  'host': "localhost",
  'user': "root",
  'password': "root12345",
  'database': "DopMPT8",
});

// Подключение базы данных 
connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    throw err;
  }
  console.log('Успешное подключение к базе данных');
});


app.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  
  pool.query('SELECT * FROM user_tokens WHERE refresh_token = ?', refreshToken, (err, results) => {
    if (err) {
      console.error('Ошибка при поиске refresh токена:', err);
      return res.sendStatus(500);
    }
    if (results.length === 0) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generateAccessToken({ name: user.name });
      res.json({ accessToken: accessToken });
    });
  });
});
// Выход
app.delete('/logout', (req, res) => {
  const refreshToken = req.body.token;
  pool.query('DELETE FROM user_tokens WHERE refresh_token = ?', refreshToken, (err) => {
    if (err) {
      console.error('Ошибка при удалении refresh токена:', err);
      return res.sendStatus(500);
    }
    res.sendStatus(204);
  });
});
// Обновление пароля администраторов
app.post('/updatepassword', (req, res) => {
  const ID_Administrator = req.body.ID_Administrator;
  var Password_admin = req.body.Password_admin;
  
  bcrypt.hash(Password_admin, saltRounds, (err, hash) => {
    if (err) {
      console.error('Ошибка при хешировании пароля:', err);
      return res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }
    Password_admin = hash;
    const attributesToHash = [
      'Password_admin'
    ];
    const hashAttributes = () => {
      const attribute = attributesToHash.shift();
      if (!attribute) {
        pool.query('UPDATE Administrator SET Password_admin = ? WHERE ID_Administrator = ?', [Password_admin, ID_Administrator], (err, result) => {
          if (err) {
            console.error('Ошибка при сохранении данных пользователя:', err);
            return res.status(500).json({ error: 'Ошибка при сохранении данных пользователя' });
          }
          res.status(201).json({ message: 'Пароль успешно обновлен' });
        });
      } else {
        bcrypt.hash(Password_admin, saltRounds, (err, hash) => {
          if (err) {
            console.error('Ошибка при хешировании пароля:', err);
            return res.status(500).json({ error: 'Ошибка при изменении пароля пользователя' });
          }
        
          Password_admin = hash;
          hashAttributes();        
        });
      }
    };
    hashAttributes();
  });

});
// Авторизация администрторов
app.post('/login', (req, res) => {
  const Email_admin = req.body.Email_admin;
  const Password_admin = req.body.Password_admin;
  const comparePassword = async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.log(error);
    }
    return false;
  }
  console.log(Password_admin);
  console.log(comparePassword);
  
  pool.query('SELECT * FROM Administrator WHERE Email_admin = ?', [Email_admin], (err, results) => {
    if (err) {
      console.error('Ошибка при поиске пользователя:', err);
      return res.sendStatus(500);
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }
    console.log(`Password is ${!comparePassword ? 'not' : ''} valid!`)

    if(comparePassword(Password_admin, results[0].Password_admin)){

    console.log(results[0].Password_admin);
    const user = {
      id: results[0].ID_Administrator, 
      Post_ID: results[0].Post_ID,
      Email_admin: Email_admin,
      Password_admin: Password_admin
    };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    
    pool.query('UPDATE user_tokens SET refresh_token = ? WHERE id_user = ?', [refreshToken, results[0].ID_Administrator], (err) => {
      if (err) {
        console.error('Ошибка при обновлении refresh токена:', err);
        return res.sendStatus(500);
      }
      console.log(user.id, accessToken,'\n\n\n' + refreshToken);
      res.json({ id: user.id, accessToken: accessToken, refreshToken: refreshToken, post: results[0].Post_ID,
        name: `${results[0].Surname_admin} ${results[0].Name_admin}`
       });
    });
  }
  });
});
// Авторизауия пользователя
app.post('/loginuser', (req, res) => {
  const Email_User = req.body.Email_User;
  const Password_User = req.body.Password_User;
  
  pool.query('SELECT * FROM User WHERE Email_User = ? AND Password_User = ?', [Email_User, Password_User], (err, results) => {
    if (err) {
      console.error('Ошибка при поиске пользователя:', err);
      return res.sendStatus(500);
    }
    if (results.length == 0) {
      return res.status(401).json({ message: 'Неверный логин или пароль' });
    }
    if(results[0].Access == '1'){
      return res.status(402).json({ message: 'Пользователь заблокирован' });
    }
    res.json({ id: results[0].ID_User, name: `${results[0].Surname_User} ${results[0].Name_User}`, post: results[0].Post_ID});
  });
});

// Генерация AccessToken
function generateAccessToken(user){ 
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1m'});
}
// Генерация authenticateToken
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
// Регистрация админа
app.post('/register', (req, res) => {
  const userData = req.body;

  bcrypt.hash(userData.Password_admin, saltRounds, (err, hash) => {
    if (err) {
      console.error('Ошибка при хешировании пароля:', err);
      return res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
    }

    userData.Password_admin = hash;

    const attributesToHash = [
      'Password_admin'
    ];

    const hashAttributes = () => {
      const attribute = attributesToHash.shift();
      if (!attribute) {
        pool.query('INSERT INTO Administrator SET ?', userData, (err, result) => {
          if (err) {
            console.error('Ошибка при сохранении данных пользователя:', err);
            return res.status(500).json({ error: 'Ошибка при сохранении данных пользователя' });
          }
          res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
        });
      } else {
        bcrypt.hash(userData.Password_admin, saltRounds, (err, hash) => {
          if (err) {
            console.error('Ошибка при хешировании пароля:', err);
            return res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
          }
        
          userData.Password_admin = hash;
          hashAttributes();        
        });
      }
    };
    hashAttributes();
  });
});
// Регистриация пользователей
app.post('/registeruser', (req, res) => {
  const userData = req.body;
  pool.query('INSERT INTO User SET ?', userData, (err, result) => {
    if (err) {
      console.error('Ошибка при сохранении данных пользователя:', err);
      return res.status(500).json({ error: 'Ошибка при сохранении данных пользователя' });
    }
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
  });
});

app.get('/current-user', authenticateToken, (req, res) => {
  res.json({ username: req.user.name });
});
// Запуск сервера
app.listen(3001);