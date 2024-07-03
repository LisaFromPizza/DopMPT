require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { createPool } = require('mysql2');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cron = require('node-cron')
const moment = require('moment')
const fs = require('fs')
const spawn = require('child_process').spawn
const app = express();

app.set('appName', 'DopMPT'); 
app.use(express.urlencoded({extended: true}));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('/'));

const { exec } = require('child_process');
const { json } = require('body-parser');

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

const PORT = 3000;
const HOSTNAME = 'localhost'; 

const pool = createPool({
  'host': "localhost",
  'user': "root",
  'password': "root12345",
  'database': "DopMPT8",
});

// Запуск сервера
app.listen(PORT, HOSTNAME, (error) => {
    error ? console.log(error) : console.log(`listening port ${HOSTNAME}:${PORT}`);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// Загрузка бэкапа базы данных
app.post('/downloadBackup', (req, res) => {
  const {Hours, Minutes} = req.body;
  cron.schedule(`${Minutes} ${Hours} * * *`, () => {
      const fileName = `${process.env.DB_NAME}_${moment().format('YYYY_MM_DD')}.sql`;
      const wstream = fs.createWriteStream(`../${fileName}`);
      console.log('---------------------');
      console.log('Running Database Backup Cron Job');
      const mysqldump = spawn('mysqldump', [ '-u', process.env.DB_USER, `-p${process.env.DB_PASSWORD}`, process.env.DB_NAME ]);
    
      mysqldump
        .stdout
        .pipe(wstream)
        .on('finish', () => {
          console.log('DB Backup Completed!');
        })
        .on('error', (err) => {
          console.log(err);
        });
    });
});
// Запрос для вывода пользователей
app.get('/allusers', (req, res) => {
  const sql = 'SELECT * FROM User';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для вывода пользователя по ID
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM User WHERE ID_User = ?`;
  pool.query(sql, userId, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json({
        ID_User: result[0].ID_User,
        Surname_User: result[0].Surname_User,
        Name_User: result[0].Name_User,
        Middle_User: result[0].Middle_User,
        Email_User: result[0].Email_User,
        Password_User: result[0].Password_User,
        Post_ID: result[0].Post_ID,
        Access: result[0].Access,
        Reason_Block: result[0].Reason_Block
      });
      console.log(result);
  });
  return;
});
// Запрос для обновления профиля пользователя
app.put('/updateuserprofile/:userId', (req, res) => {
  const userId = req.params.userId;
  const {Surname_User, Name_User, Middle_User, Email_User} = req.body;
  pool.query('UPDATE User SET Surname_User = ?, Name_User = ?, Middle_User = ?, Email_User = ? WHERE ID_User = ?', 
  [Surname_User, Name_User, Middle_User, Email_User, userId], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update user' });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});
// Запрос для обновления пароля пользователя
app.put('/updateuserpassword/:userId', (req, res) => {
  const userId = req.params.userId;
  const {Password_User} = req.body;
  pool.query('UPDATE User SET Password_User = ? WHERE ID_User = ?', 
  [Password_User, userId], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to update user' });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});
// Запрос для блокировки пользователя
app.put('/blockuser/:id', (req, res) => {
  const id = req.params.id;
  const {Reason_Block} = req.body;
  pool.query('UPDATE User SET Access = 1, Reason_Block = ? WHERE ID_User = ?', [Reason_Block, id], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Failed to block user' });
    } else {
      res.status(200).json({ message: 'User blocked successfully' });
    }
  });
});
// Запрос для вывода статистики
app.get('/statistics', (req, res) => {
  const sql = 'SELECT * FROM Statistics';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для вывод всех тем
app.get('/allthemes', (req, res) => {
    const sql = 'SELECT * FROM Theme';
    pool.query(sql, (error, result) => {
        if(error){
            console.error('Ошибка запроса: ' + error.message);
            res.status(500).send('Ошибка сервера');
            return;
        }
        res.json(result);
        console.log(result);
    });
    return;
});
// Запрос для вывода темы по ID
app.get('/themeid/:id', (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM Theme WHERE User_ID = ? order by ID_Theme desc limit 1`;
  pool.query(sql, userId, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json({
        ID_Theme: result[0].ID_Theme
      });
      console.log(result);
  });
  return;
});
// Запрос для обновления статистических данных
app.post('/putview', (req, res) => {
  const {Theme_ID} = req.body;
  pool.query(`INSERT INTO Statistics(Count_Watch, DateStatistics, Theme_ID) VALUES(1, CURDATE(), ?) ON DUPLICATE KEY UPDATE Count_Watch=Count_Watch+1`,
  [Theme_ID], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to put statistics' });
    } else {
      res.status(200).json({ message: 'Statistics puted successfully' });
    }
  });
});
// Запрос для обновления темы
app.put('/updatetheme/:themeId', (req, res) => {
  const themeId = req.params.themeId;
  const {Title_Theme, Description_Theme, Text_Theme, TypeTheme_ID} = req.body;
  pool.query('UPDATE Theme SET Title_Theme = ?, Description_Theme = ?, Text_Theme = ?, TypeTheme_ID = ? WHERE ID_Theme = ?', [Title_Theme, Description_Theme, Text_Theme, TypeTheme_ID, themeId], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete user' });
      console.log(error);
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
});
// Запрос для блокировки темы
app.put('/deletetheme/:themeId', (req, res) => {
  const themeId = req.params.themeId;
  pool.query('UPDATE Theme SET Access = 1 WHERE ID_Theme = ?', themeId, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
});
// Запрос для создания темы
app.post('/createtheme', (req, res) => {
  const {Title_Theme, Description_Theme, Text_Theme, TypeTheme_ID, User_ID, Access} = req.body;
  pool.query('INSERT INTO Theme (Title_Theme, Description_Theme, Text_Theme, TypeTheme_ID, User_ID, Access) VALUES (?, ?, ?, ?, ?, ?)', 
  [Title_Theme, Description_Theme, Text_Theme, TypeTheme_ID, User_ID, Access], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create theme' });
    } else {
      res.status(200).json({ message: 'Theme created successfully' });
    }
  });
});
// Заппрос для вывода файлов
app.get('/filesintheme', (req, res) => {
  const sql = 'SELECT * FROM FilesInTheme';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для просмотра файлов
app.post('/filesinthemepost', (req, res) => {
  const {Files_ID, Theme_ID} = req.body;
  pool.query('INSERT INTO FilesInTheme (Files_ID, Theme_ID) VALUES (?, ?)', 
  [Files_ID, Theme_ID], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create file' });
    } else {
      res.status(200).json({ message: 'File created successfully' });
    }
  });
});
// Запрос для просмотра файлов
app.get('/files', (req, res) => {
  const sql = 'SELECT * FROM Files';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для сохранения файлов
app.post('/filespost', (req, res) => {
  const {Title_Files, Path_Files} = req.body;
  pool.query('INSERT INTO Files (Title_Files, Path_Files) VALUES (?, ?)', 
  [Title_Files, Path_Files], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create file' });
    } else {
      res.status(200).json({ message: 'File created successfully' });
    }
  });
});
// Запрос для вывода комментариев к теме
app.get('/comments/:themeId', (req, res) => {
  const themeId = req.params.themeId;
  const sql = `SELECT * FROM Comments WHERE Theme_ID = ${themeId}`;
  pool.query(sql,  (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для созданияя комментария
app.post('/createcomment', (req, res) => {
  const {Theme_ID, Comment_Text, AdminFrom_ID, Date_comment, Access} = req.body;
  pool.query('INSERT INTO Comments (Theme_ID, Comment_Text, AdminFrom_ID, Date_comment, Access) VALUES(?, ?, ?, ?, ?)', 
  [Theme_ID, Comment_Text, AdminFrom_ID, Date_comment, Access], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Failed to create comment' });
    } else {
      res.status(200).json({ message: 'Comment created successfully' });
    }
  });
});
// Запрос для создания ответа на комментарий
app.post('/createanswertocomment', (req, res) => {
  const {Theme_ID, Comment_Text, AdminFrom_ID, CommentTo_ID, Date_comment, Access} = req.body;
  pool.query('INSERT INTO Comments (Theme_ID, Comment_Text, AdminFrom_ID, CommentTo_ID, Date_comment, Access) VALUES(?, ?, ?, ?, ?, ?)', 
  [Theme_ID, Comment_Text, AdminFrom_ID, CommentTo_ID, Date_comment, Access], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create comment' });
    } else {
      res.status(200).json({ message: 'Comment created successfully' });
    }
  });
});
// Запрос для блокировки комментария
app.put('/deletecomment/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  pool.query('UPDATE Comments SET Access = 1 WHERE ID_Comments = ?', commentId, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete comment' });
    } else {
      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  });
});
// Запрос для вывода администраторов
app.get('/alladmins', (req, res) => {
  const sql = 'SELECT * FROM Administrator';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для вывода администратора по ID
app.get('/admin/:id', (req, res) => {
  const adminId = req.params.id;
  const sql = `SELECT * FROM Administrator WHERE ID_Administrator = ?`;
  pool.query(sql, adminId, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json({
        ID_Administrator: result[0].ID_Administrator,
        Surname_admin: result[0].Surname_admin,
        Name_admin: result[0].Name_admin,
        Middle_admin: result[0].Middle_admin,
        Email_admin: result[0].Email_admin,
        Password_admin: result[0].Password_admin,
        Post_ID: result[0].Post_ID
      });
      console.log(result);
  });
  return;
});
// Запрос для вывода комментариев
app.get('/comments', (req, res) => {
  const sql = 'SELECT * FROM Comments';
  pool.query(sql, (error, result) => {
      if(error){
          console.error('Ошибка запроса: ' + error.message);
          res.status(500).send('Ошибка сервера');
          return;
      }
      res.json(result);
      console.log(result);
  });
  return;
});
// Запрос для переадресации на страницу регистрации
app.get('/register', (req, res) => {
    res.sendFile('/public/registerAdmin.html');
  });
// Запрос для вывода администраторов
app.get('/userPosts/', (req, res) => {
    try {
    const sql = `
    SELECT * FROM Administrator
    INNER JOIN Post ON Administrator.Post_ID = Post.ID_Post;  
    `;
    pool.query(sql, (error, results) => {
      if (error) {
        console.error('Ошибка запроса: ' + error.message);
        console.log(error);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Ошибка при получении пользователей', error);
    res.status(500).send('Ошибка сервера');
  }
  });
// Запрос для удаления администраторов
app.delete('/userPosts/:userId', (req, res) => {
    const userId = req.params.userId;
    pool.query('DELETE FROM Administrator WHERE ID_Administrator = ?', userId, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Failed to delete user' });
      } else {
        res.status(200).json({ message: 'User deleted successfully' });
      }
    });
  });
// Запрос для обновления данных администратора
  app.put('/updateuser/:userId', (req, res) => {
    const userId = req.params.userId;
    const {Surname_admin, Name_admin, Middle_admin, Email_admin, Post_ID} = req.body;
    pool.query('UPDATE Administrator SET Surname_admin = ?, Name_admin = ?, Middle_admin = ?, Email_admin = ?, Post_ID = ? WHERE ID_Administrator = ?', 
    [Surname_admin, Name_admin, Middle_admin, Email_admin, Post_ID, userId], (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update user' });
      } else {
        res.status(200).json({ message: 'User updated successfully' });
      }
    });
  });
// Метод для авторизици админа
  function authorizeAdmin(req, res, next) {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).send('Токен отсутствует');
    }
  
    jwt.verify(token, accessTokenSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send('Недействительный токен');
      }
  
      const userId = decoded.id; //  ID пользователя из декодированного токена
  
      const sql = `
        SELECT P.Post_Name AS Role
        FROM Administrator U
        JOIN Post P ON U.Post_ID = P.ID_Post
        WHERE U.ID_Administrator = ?
      `;
  
      pool.query(sql, userId, (err, results) => {
        if (err) {
          console.error('Ошибка при запросе роли пользователя из базы данных:', err);
          res.status(500).send('Ошибка при запросе роли пользователя');
        } else {
          if (results.length === 0) {
            console.error('Пользователь не найден');
            res.status(404).send('Пользователь не найден');
          } else {
            const userRole = results[0].Role;
  
            if (userRole === '2') {
              req.user = decoded;
              next();
            } else {
              res.status(403).send('Доступ запрещен');
            }
          }
        }
      });
    });
  }  