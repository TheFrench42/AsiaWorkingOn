
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Apri/crea il database
const db = new sqlite3.Database('cantina.db', (err) => {
  if (err) {
    console.error('Errore apertura DB:', err);
  } else {
    console.log('Database SQLite aperto correttamente.');
  }
});

// Servire i file statici (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route per servire index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint di ricerca
app.get('/search', (req, res) => {
  const query = req.query.query || '';
  const lowerQuery = query.toLowerCase();

  console.log('Query ricevuta dal client:', query); // Debug

  // Query SQL aggiornata per includere magazzino e cantina
  const sql = `
    SELECT nome_articolo, magazzino, cantina
    FROM vini
    WHERE lower(nome_articolo) LIKE '%' || ? || '%'
  `;
  const params = [lowerQuery];

  console.log('Query SQL costruita:', sql); // Debug

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Errore query:', err);
      return res.status(500).json({ error: 'Errore query DB' });
    }

    console.log('Risultati trovati:', rows.length); // Debug
    res.json(rows);
  });
});

// Avvia il server
app.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
