const express = require("express");
const path = require('path');
const sqlite3 = require("sqlite3").verbose();
const app = express();
const bodyParser = require('body-parser');


// Configura aquí tus detalles de conexión a la base de datos SQLite
const DB_PATH = path.join(__dirname, 'database.sqlite');


const db = new sqlite3.Database(DB_PATH, (err) => {
  try {
    if (err) {
      console.error('Error al abrir la base de datos', err.message);
    } else {
      console.log('Conectado a la base de datos SQLite');
    }
    
  } catch (error) {
    
  }
});



app.use(bodyParser.json());
// Endpoint para obtener los jugadores de un equipo específico por el nombre del equipo
app.post("/jugadores", async (req, res) => {
  try {
    const equipo = req.body.equipo; // Obtén el nombre del equipo de los parámetros de la URL
    console.log(equipo); // Obtén el nombre del equipo de los parámetros de la URL;  // Obtén el nombre del equipo de los parámetros de la URL
    const query = `SELECT * FROM Team`;

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