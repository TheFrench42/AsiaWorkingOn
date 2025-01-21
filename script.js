
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.querySelector('.search');
  const campo1Filter = document.getElementById('campo1Filter');
  const resultsBody = document.getElementById('resultsBody');

  // Ascolta l'evento "Enter" sulla barra di ricerca
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      const testo = searchInput.value;
      const filtro = campo1Filter.value;

      console.log('Input di ricerca:', testo); // Debug
      console.log('Filtro selezionato:', filtro); // Debug

      fetch(`/search?query=${encodeURIComponent(testo)}&filter=${encodeURIComponent(filtro)}`)
        .then((res) => {
          if (!res.ok) {
            console.error('Errore nella risposta del server:', res.statusText);
            return [];
          }
          return res.json();
        })
        .then((data) => {
          console.log('Risultati ricevuti:', data); // Debug

          // Svuota la tabella
          resultsBody.innerHTML = '';

          // Determina il numero di righe da mostrare (sempre 20)
          const rowsToShow = 20;

          for (let i = 0; i < rowsToShow; i++) {
            const row = data[i] || {}; // Usa un oggetto vuoto se i dati sono finiti
            const tr = document.createElement('tr');

            // Prima colonna: Campo dinamico basato sul filtro
            const tdCampo1 = document.createElement('td');
            tdCampo1.textContent = getCampo1Value(row, filtro);
            tr.appendChild(tdCampo1);

            // Seconda colonna: Nome articolo
            const tdNomeArticolo = document.createElement('td');
            tdNomeArticolo.textContent = row.nome_articolo || 'N/A';
            tr.appendChild(tdNomeArticolo);

            // Terza colonna: Magazzino
            const tdMagazzino = document.createElement('td');
            tdMagazzino.textContent = row.magazzino !== undefined ? row.magazzino : '0';
            tr.appendChild(tdMagazzino);

            // Quarta colonna: Cantina
            const tdCantina = document.createElement('td');
            tdCantina.textContent = row.cantina !== undefined ? row.cantina : '0';
            tr.appendChild(tdCantina);

            resultsBody.appendChild(tr);
          }
        })
        .catch((err) => {
          console.error('Errore nella ricerca:', err);
        });
    }
  });

  // Funzione per ottenere il valore corretto per Campo 1
  function getCampo1Value(row, filtro) {
    switch (filtro) {
      case 'fattura':
        return row.fattura_1 || 'N/A';
      case 'prezzo':
        return row.acquisto || 'N/A';
      case 'vitigni':
        return [row.vitigno_1, row.vitigno_2, row.vitigno_3].filter(Boolean).join(', ') || 'N/A';
      case 'localita':
        return row.localita || 'N/A';
      default:
        return 'N/A';
    }
  }
});
