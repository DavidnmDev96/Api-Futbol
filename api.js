const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
 
// Configura aquí tus detalles de conexión a la base de datos SQLite
const db = new sqlite3.Database("./db/database.sqlite");
 
// Endpoint para obtener los jugadores de un equipo específico por el nombre del equipo
app.get("/jugadores/:equipo", (req, res) => {
  try {
    const { equipo } = req.params;
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
    AND strftime('%Y', m.date) = '2016' -- Filtrar por el año 2016
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
    AND strftime('%Y', m.date) = '2016'
    AND strftime('%Y', m.date) = (SELECT strftime('%Y', MAX(date)) FROM Match);`;
    // Consulta SQL para seleccionar jugadores por equipo
    db.all(query, [equipo], (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error en el servidor"); // Maneja errores potenciales
        return;
      }
      res.json(rows); // Envía los jugadores como respuesta en formato JSON
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error en el servidor"); // Maneja errores potenciales
  }
});
 


// El servidor escucha en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
 
