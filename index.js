const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const exphbs = require('express-handlebars');
const todoRoutes = require('./routes/todos'); 

const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function connectDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'platon.teyhd.ru',
      port: 3407,
      user: 'student',
      password: 'studpass',
      database: 'Nikita_todo'
    });

    console.log('Подключение к базе данных успешно!');
    return connection;
  } catch (error) {
    console.error(' Ошибка подключения к базе данных:', error.message);
    process.exit(1);
  }
}


async function start() {
  const db = await connectDB(); 
  app.use((req, res, next) => {
    req.db = db; 
    next();
  });

  app.use(todoRoutes); 

  app.listen(PORT, () => {
    console.log(` Сервер запущен на порту ${PORT}`);
  });
}

start();
