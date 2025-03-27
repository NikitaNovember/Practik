const { Router } = require('express');
const router = Router();


router.get('/', async (req, res) => {
  try {
    const [todos] = await req.db.execute('SELECT * FROM todos');

    res.render('index', {
      title: 'Todos list',
      isIndex: true,
      todos
    });
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    res.status(500).send('Ошибка сервера');
  }
});


router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create todo',
    isCreate: true
  });
});


router.post('/create', async (req, res) => {
  try {
    await req.db.execute('INSERT INTO todos (title, status) VALUES (?, ?)', [req.body.title, 0]);
    res.redirect('/');
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).send('Ошибка сервера');
  }
});


router.post('/complete', async (req, res) => {
    try {
      console.log('Полученные данные:', req.body);
  
      const id = req.body.id && req.body.id.trim() !== '' ? parseInt(req.body.id, 10) : null;
      const status = req.body.completed ? 1 : 0;
  
      if (!id) {
        console.error('Ошибка: отсутствует ID задачи!');  
        return res.status(400).send(`Ошибка: ID не передан. Полученные данные: ${JSON.stringify(req.body)}`);
      }
  
      await req.db.execute('UPDATE todos SET status = ? WHERE Id = ?', [status, id]);
  
      res.redirect('/');
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      res.status(500).send('Ошибка сервера');
    }
  });
  

module.exports = router;
