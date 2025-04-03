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
    const title = req.body.title.trim();

    if (!title) {
      return res.status(400).send('Ошибка: Название не может быть пустым!');
    }

    // Проверяем, существует ли уже такая задача
    const [existingTodos] = await req.db.execute('SELECT * FROM todos WHERE title = ?', [title]);

    if (existingTodos.length > 0) {
      return res.status(400).send('Ошибка: Такая задача уже существует!');
    }

    // Если такой задачи нет – создаём новую
    await req.db.execute('INSERT INTO todos (title, status) VALUES (?, ?)', [title, 0]);
    res.redirect('/');
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    res.status(500).send('Ошибка сервера');
  }
});



router.post('/complete', async (req, res) => {
  try {
    const { id, completed } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'ID не передан' });
    }

    await req.db.execute('UPDATE todos SET status = ? WHERE Id = ?', [completed, id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});


router.post('/delete', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'ID не передан' });
    }

    await req.db.execute('DELETE FROM todos WHERE Id = ?', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении задачи:', error);
    res.status(500).json({ success: false, error: 'Ошибка сервера' });
  }
});


module.exports = router;
