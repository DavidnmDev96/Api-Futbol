const express = require("express");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
const app = express();
const bodyParser = require('body-parser');

// Configura aquí tus detalles de conexión a la base de datos SQLite
const DB_PATH = path.resolve(__dirname, "db", 'database.sqlite');



const db = new sqlite3.Database(DB_PATH,  sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});



app.use(bodyParser.json());
// Endpoint para obtener los jugadores de un equipo específico por el nombre del equipo
app.post("/jugadores", async (req, res) => {
  try {
    const equipo = req.body.equipo; // Obtén el nombre del equipo de los parámetros de la URL
    console.log(equipo); // Obtén el nombre del equipo de los parámetros de la URL;  // Obtén el nombre del equipo de los parámetros de la URL
    const query = `SELECT DISTINCT p.player_name
       FROM Player p
      JOIN Match m ON (
           p.player_api_id = m.home_player_1 OR
          p.player_api_id = m.home_player_2 OR
           p.player_api_id = m.home_player_3 OR
           p.player_api_id = m.home_player_4 OR
          p.player_api_id = m.home_player_5 OR
            p.player_api_id = m.home_player_6 OR
           p.player_api_id = m.home_player_7 OR
            p.player_api_id = m.home_player_8 OR
           p.player_api_id = m.home_player_9 OR
           p.player_api_id = m.home_player_10 OR
           p.player_api_id = m.home_player_11
       )
        JOIN Team t ON t.team_api_id = m.home_team_api_id
       WHERE t.team_long_name = ?
       AND strftime('%Y', m.date) = (SELECT strftime('%Y', MAX(date)) FROM Match)
        UNION
        SELECT DISTINCT p.player_name
       FROM Player p
       JOIN Match m ON (
          p.player_api_id = m.away_player_1 OR
           p.player_api_id = m.away_player_2 OR
           p.player_api_id = m.away_player_3 OR
         p.player_api_id = m.away_player_4 OR
          p.player_api_id = m.away_player_5 OR
           p.player_api_id = m.away_player_6 OR
          p.player_api_id = m.away_player_7 OR
           p.player_api_id = m.away_player_8 OR
            p.player_api_id = m.away_player_9 OR
           p.player_api_id = m.away_player_10 OR
          p.player_api_id = m.away_player_11
      )
        JOIN Team t ON t.team_api_id = m.away_team_api_id
       WHERE t.team_long_name = ?
         AND strftime('%Y', m.date) = (SELECT strftime('%Y', MAX(date)) FROM Match);`;

    db.all(query, [equipo], async (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error en el servidor"); 
        return;
      }
      const playersObject = {};
      rows.forEach((row, index) => {
        // Obtener el nombre del jugador de la fila actual
        const playerName = row.player_name;

        // Crear una propiedad para cada jugador en el objeto de jugadores
        playersObject[`player_${index + 1}`] = playerName;
    });
 
        res.json(playersObject); 
       
    
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor"); 
  }
});
 

 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});