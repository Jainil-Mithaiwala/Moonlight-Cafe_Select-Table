const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 2001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'brpas2iea9jom89b3qnr-mysql.services.clever-cloud.com',
  user: 'uu19tu8hjb0q1yhz',
  password: 'p1zXV4UJrwNSnVVVOtjW',
  database: 'brpas2iea9jom89b3qnr'
});

const promisePool = pool.promise();

app.get('/select-tables', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT id, table_no, url, is_available FROM food_tables');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/update-table', async (req, res) => {
  const { id, is_available } = req.body;

  // Validate input
  if (typeof id !== 'number' || typeof is_available !== 'number') {
    return res.status(400).json({ error: 'Invalid request data. Ensure id and is_available are numbers.' });
  }

  try {
    // Check if the table exists
    const [table] = await promisePool.query('SELECT * FROM food_tables WHERE id = ?', [id]);

    if (table.length === 0) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Update table availability
    await promisePool.query('UPDATE food_tables SET is_available = ? WHERE id = ?', [is_available, id]);

    res.status(200).json({ message: 'Table availability updated successfully' });
  } catch (err) {
    res.status(500).json({ error: `Error updating table availability: ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
